import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { WishlistService } from "./wishlist.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartProducts = new BehaviorSubject<any[]>([]); // Initialized with an empty array
  cartProducts$: Observable<any[]> = this.cartProducts.asObservable();

 cartCount  = new BehaviorSubject<number>(0);
cartCount$: Observable<number> = this.cartCount.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private wishlistService: WishlistService
  ) {
    this.getCartItems().subscribe((cartData) => {
      this.cartProducts.next(cartData.items);
      this.cartCount.next(this.getCartCount()); // Initialize cartCount from fetched items
    });
  }
  addToCart(count: number, product: any): void {
    console.log('Product:', product);
  
    // Ensure cartProducts is always an array
    const cartProducts = this.cartProducts.value;
  
    // Check if product already exists in the cart
    const index = cartProducts.findIndex((p: any) => p.id === product.id);
  
    // If product exists, update the quantity, otherwise add the product to the cart
    if (index !== -1) {
      cartProducts[index].quantity += count;  // Update the quantity
    } else {
      cartProducts.push({ ...product, quantity: count });  // Add new product with quantity
    }
  
    // Log the updated cart products array
    console.log('Updated Cart Products:', cartProducts);
  
    // Update the BehaviorSubject with the new cart data
    this.cartProducts.next(cartProducts);
    this.cartCount.next(this.getCartCount());  // Update the cart count (total number of items in cart)
  
    // Now update Firestore with the latest cart data
    this.updateCartInDb(cartProducts);
  
    // Optionally, remove product from wishlist
    this.wishlistService.removeFromWishlist(product.id);
  }
  
  updateCartInDb(cartProducts: any[]): void {
  
    // Set the updated cartItems in Firestore document
    this.firestore
      .collection("cartItems")
      .doc("cart")
      .set(
        {
          items: cartProducts,  // Ensure the `items` field is updated as an array
        },
        { merge: true }  // Merge ensures we don't overwrite other fields in the document
      )
      .then(() => {
        console.log("Cart updated in Firestore successfully.");
      })
      .catch((error) => {
        console.error("Error updating cart in Firestore:", error);
      });
  }
  
getCartItems(): Observable<{ items: any[] }> {
  return this.firestore
    .collection("cartItems")
    .doc("cart")
    .valueChanges()
    .pipe(
      map((cartData: any) => {
        console.log('Fetched cart data:', cartData); // Log fetched data

        // Check if items exist and are an array, otherwise return an empty array
        if (!cartData || !Array.isArray(cartData.items)) {
          console.warn('Cart items are missing or not an array, returning empty array.');
          return { items: [] }; // Return empty array if no items
        }

        return cartData;
      })
    ) as Observable<{ items: any[] }>;
}

  getCartCount(): number {
    const cartProducts = this.cartProducts.value;
  

  
    // Use reduce to sum up the quantity of items
    return cartProducts.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  }
  decreaseQuantity(product: any): void { // Use 'product' for consistency
    const cartProducts = this.cartProducts.value;
    const index = cartProducts.findIndex((p: any) => p.id === product.id); // Use 'product' here too
    if (index !== -1) {
      if (cartProducts[index].quantity > 1) {
        cartProducts[index].quantity--;
        this.cartCount.next(this.cartCount.value - 1);
      } else {
        cartProducts.splice(index, 1);
        this.cartCount.next(this.cartCount.value - 1);
      }
      this.cartProducts.next(cartProducts);
      this.updateCartInDb(cartProducts); // Update Firestore
    }
  }
  
  increaseQuantity(product: any): void {
    const cartProducts = this.cartProducts.value;
    const index = cartProducts.findIndex((p: any) => p.id === product.id);
    if (index !== -1) {
      cartProducts[index].quantity++;
      this.cartProducts.next(cartProducts);
      this.cartCount.next(this.cartCount.value + 1);
      this.updateCartInDb(cartProducts);
    }
  }
  

getTotalPrice(): number {
  const currentProducts = this.cartProducts.value;

  // Sum up the total price for each product (price * quantity)
  return currentProducts.reduce((total, product) => {
    return total + product.price * (product.quantity || 1);
  }, 0);
}
}