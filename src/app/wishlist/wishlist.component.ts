import { Component, OnInit } from "@angular/core";
import { WishlistService } from "../services/wishlist.service";
import { CartService } from "../services/cart.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.scss"],
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];

  constructor(private wishlistService: WishlistService, private router: Router, public cartService: CartService) {}

  ngOnInit() {
    this.wishlistService.getWishlistItems().subscribe((data: any) => {
      this.wishlistItems = data.items;
    })
    ;
    this.wishlistService.wishlistProducts.subscribe((items: any[]) => {
      this.wishlistItems = items;
    });

    // Fetch the wishlist items.
  }

  removeFromWishlist(id: string): void {
    this.wishlistService.removeFromWishlist(id);
  }


  addToCart(product: any): void {
    this.cartService.addToCart(1, product);

    // Example: Add 1 item to cart
  }

  goBack() {
    this.router.navigate([""]);
  }

}
