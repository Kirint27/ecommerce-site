import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CartService } from "../services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  product: any;
  cartProducts: any[] = [];
  cartCount: number = 0;
  totalPrice: number = 0;
  cartData: any;
  constructor(private router: Router, public cartService: CartService) {}

  ngOnInit(): void {
    // Subscribe to cartProducts observable
    this.cartService.cartProducts$.subscribe((products: any[]) => {
      this.cartProducts = products;
    });
    this.totalPrice = this.cartService.getTotalPrice();

    // Subscribe to cartCount observable
    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });

    this.cartService.getCartItems().subscribe((cartData) => {
      this.cartData = cartData;
    });
  }

  goBack() {
    this.router.navigate([""]);
  }
  goToCheckout() {
    this.router.navigate(["/checkout"]);
  }

  decreaseQuantity(product: any): void {
    this.cartService.decreaseQuantity(product);
  }

  increaseQuantity(product: any): void {
    this.cartService.increaseQuantity(product);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }
}
