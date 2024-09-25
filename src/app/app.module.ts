import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { HomeComponent } from "./home/home.component";
import { ProductCardComponent } from "./product-card/product-card.component";
import { AuthComponent } from "./auth/auth.component";
import { LoginComponent } from "./auth/login/login.component";
import { LoginFormComponent } from "./auth/login/login-form/login-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material";
import { HttpClientModule } from "@angular/common/http";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore"; // Import Firestore module
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { environment } from "../environments/environment";
import { ElectronicsComponent } from './electronics/electronics.component';
import { ToysGamesComponent } from './toys-games/toys-games.component'; // Make sure to set this up
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [
    AppComponent,
    
    CartComponent,
    CheckoutComponent,
    HomeComponent,
    ProductCardComponent,
    AuthComponent,
    LoginComponent,
    LoginFormComponent,
ElectronicsComponent,
ToysGamesComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // Add this line    AngularFireDatabaseModule, // Firebase Database module
    MatIconModule,
    BrowserAnimationsModule,
    NgxStripeModule.forRoot('pk_test_51Q2sDAFjw3T4CEAFqr4xQ1ZgdE4zAHHKXIe8n4wrVzousR2medpoCAmzR2LCP88eYgrmwNteybka8uJ21uBPXaDh00S6mRag81')

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
