import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class WishlistService {
  wishlistProducts = new BehaviorSubject<any[]>([]); // Holds wishlist products

  constructor(private firestore: AngularFirestore) {}

  addToWishlist(product: any): void {
    const wishlistProducts = this.wishlistProducts.value; // Current wishlist products
    const index = wishlistProducts.findIndex((p: any) => p.id === product.id); // Check if product is already in wishlist

    if (index === -1) {
      // If product is not in wishlist
      wishlistProducts.push(product); 
      this.wishlistProducts.next(wishlistProducts);
      this.updateWishlistInDb(); 
    } else {
      console.log("Product is already in the wishlist");
    }
  }

  // Method to update the wishlist in Firestore
   updateWishlistInDb(): void {
    const wishlistItems = this.wishlistProducts.value; // Current value of wishlistProducts
    this.firestore
      .collection("WishlistItems")
      .doc("wishlist")
      .set(
        { items: wishlistItems },
        { merge: true } // Merge to avoid overwriting other fields
      )
      .then(() => {
        console.log("Wishlist updated in Firestore successfully.");
      })
      .catch((error) => {
        console.error("Error updating wishlist in Firestore:", error);
      });
  }

  getWishlistItems():Observable<any> {
    return this.firestore
      .collection("WishlistItems")
      .doc("wishlist")
      .valueChanges()
  }
      ;
    
  removeFromWishlist(id: string): void {
    const wishlistItems = this.wishlistProducts.value;
    const index = wishlistItems.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      wishlistItems.splice(index, 1);
      this.wishlistProducts.next(wishlistItems);
      this.updateWishlistInDb();
    }
  }
}
