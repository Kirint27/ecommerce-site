import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartProducts  = new BehaviorSubject< any[]>([]);
  cartProducts$: Observable<any[]> = this.cartProducts.asObservable();

 cartCount  = new BehaviorSubject<number>(0);
cartCount$: Observable<number> = this.cartCount.asObservable();

  constructor() { }


  addToCart(count: number, product: any): void {
    const cartProducts = this.cartProducts.value;
    this.cartProducts.next([...cartProducts, product]);
    const currentCount = this.cartCount.value;
    this.cartCount.next(currentCount + count);

    const index = cartProducts.findIndex((p: any) => p.id === product.id);

    if (index !== -1) {
      cartProducts[index].quantity += count;
    } else {
      cartProducts.push({ ...product, quantity: count });
    }
    this.cartProducts.next(cartProducts);
  }
decreaseQuantity(product: any): void {
  const cartProducts = this.cartProducts.value;
const index = cartProducts.findIndex((p: any) => p.id === product.id);
if (index !== -1) {
  if (cartProducts[index].quantity > 1) {
    cartProducts[index].quantity--;
    this.cartCount.next(this.cartCount.value - 1);
  } else {
    cartProducts.splice(index, 1);  
      this.cartCount.next(this.cartCount.value - 1);

  }
  this.cartProducts.next(cartProducts);

}
}
increaseQuantity(product: any): void {
  const cartProducts = this.cartProducts.value;
  const index = cartProducts.findIndex((p: any) => p.id === product.id);
  if (index !== -1) {

      cartProducts[index].quantity++
      this.cartProducts.next(cartProducts);
      this.cartCount.next(this.cartCount.value + 1);
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