import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.scss"],
})
export class ProductCardComponent {
  @Input() product: any;
  @Output() addingToCart = new EventEmitter<any>(); // Updated to accept any data
  @Output() addingToWishList = new EventEmitter<any>(); // Updated to accept any data


  addToCart(): void {
    console.log("Emitting product:", this.product); // Log to verify product
    this.addingToCart.emit(this.product); // Emit the product
  }



addToWishlist(): void {
  console.log("Emitting product:", this.product); // Log to verify product
  this.addingToWishList.emit(this.product); // Emit the product
}
}