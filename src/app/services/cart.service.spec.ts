import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CartService } from "./cart.service";
import { TestBed } from "@angular/core/testing";

describe("CartService", () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should increase the quantity of a product in the cart", () => {
    const product = { id: 1, quantity: 1, price: 100 };
    const cartProducts = [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
    ];

    // Set the initial value for cartProducts
    service.cartProducts.next(cartProducts);

    // Call the increaseQuantity method
    service.increaseQuantity(product);

    // Debug output
    console.log("Cart Products after increase:", service.cartProducts.value);
    console.log("Cart Count after increase:", service.cartCount.value);

    // Assert that the product's quantity has increased
    expect(service.cartProducts.value).toEqual([
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ]);

    // Assert that the cart count has been updated correctly
    expect(service.cartCount.value).toBe(3);
  });

  it("should decrease the quantity of a product in the cart", () => {
    const product = { id: 1, quantity: 2, price: 100 };
    const cartProducts = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ];

    // Set the initial value for cartProducts
    service.cartProducts.next(cartProducts);

    // Call the decreaseQuantity method (assuming you have this method implemented)
    service.decreaseQuantity(product);

    // Assert that the product's quantity has decreased
    expect(service.cartProducts.value).toEqual([
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
    ]);

    // Assert that the cart count has been updated correctly
    expect(service.cartCount.value).toBe(2);
  });
});
