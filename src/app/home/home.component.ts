import { Component, OnInit } from "@angular/core";
import { CartService } from "../services/cart.service";
import { ProductService } from "../services/product.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  products: any[] = []; // Specify type if possible
  cartCount: number = 0;
  dropdownIsOpen: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data.products;
    });

    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });
  }
  toggleDropdown() {
    this.dropdownIsOpen = !this.dropdownIsOpen;
  }
  addToCart(product: any): void {
    this.cartService.addToCart(1, product);

    // Example: Add 1 item to cart
  }

  sortByPrice(order: "high-to-low" | "low-to-high"): void {
    if (order === "high-to-low") {
      this.products.sort((a, b) => b.price - a.price);
    } else if (order === "low-to-high") {
      this.products.sort((a, b) => a.price - b.price);
    }
  }
}
