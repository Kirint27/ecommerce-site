import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CartComponent } from "./cart/cart.component";
import { HomeComponent } from "./home/home.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { WishlistComponent } from "./wishlist/wishlist.component";

const routes: Routes = [


  
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "checkout",
    component: CheckoutComponent,
  },

  {
    path: "",
    component: HomeComponent,
  },
{
  path: "wishlist",
  component: WishlistComponent,
}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
