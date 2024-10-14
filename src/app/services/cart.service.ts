import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { WishlistService } from "./wishlist.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
  cartProducts = new BehaviorSubject<any[]>([]);
  cartProducts$: Observable<any[]> = this.cartProducts.asObservable();

  cartCount = new BehaviorSubject<number>(0);
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
    const cartProducts = this.cartProducts.value;
    const index = cartProducts.findIndex((p: any) => p.id === product.id);

    if (index !== -1) {
      cartProducts[index].quantity += count;
    } else {
      cartProducts.push({ ...product, quantity: count });
    }

    this.cartProducts.next(cartProducts);
    this.cartCount.next(this.getCartCount()); // Update cart count
    this.updateCartInDb();
    this.wishlistService.removeFromWishlist(product.id);
  }

  updateCartInDb(): void {
    const cartItems = this.cartProducts.value; // Extract the current value of cartProducts
    this.firestore
      .collection("cartItems")
      .doc("cart")
      .set(
        {
          // Remove the extra space
          items: cartItems,
        },
        { merge: true }
      ) // Use merge to avoid overwriting other fields
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
      .valueChanges() as Observable<{ items: any[] }>;
  }
  getCartCount(): number {
    return this.cartProducts.value.reduce(
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
      this.updateCartInDb(); // Update Firestore
    }
  }
  
  increaseQuantity(product: any): void {
    const cartProducts = this.cartProducts.value;
    const index = cartProducts.findIndex((p: any) => p.id === product.id);
    if (index !== -1) {
      cartProducts[index].quantity++;
      this.cartProducts.next(cartProducts);
      this.cartCount.next(this.cartCount.value + 1);
      this.updateCartInDb();
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
