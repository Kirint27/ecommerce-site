import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { StripeService,  } from 'ngx-stripe';
import { CreatePaymentMethodAcssDebitData, CreatePaymentMethodData, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from "@stripe/stripe-js";
import { CartService } from "../services/cart.service";



@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  showPaymentForm: boolean = false;
  stripeTest: FormGroup;
  totalPrice: number = 0;

  deliveryForm: FormGroup;
  deliveryFormSubmitted = false;
  httpRequestIsPending = false;
  deliveryErrorMessage: string;
  showCheckoutErrorMessage = false;
  card: any;
  stripeForm: FormGroup; // New form group for payment

  cardDetails: any = {}; // To hold card details from ngx-stripe-card
  cardOptions: any; // Add options for the Stripe card component



  constructor(private formBuilder: FormBuilder, private cartService: CartService, private stripeService: StripeService, private router: Router) {}

  ngOnInit() {
    this.buildForm();
    this.totalPrice = this.cartService.getTotalPrice();
    console.log('Total Price:', this.totalPrice); 

  }

  buildForm() {
    this.deliveryForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      postcode: ['', Validators.required],
     
    });

    this.stripeForm = this.formBuilder.group({
      cardDetails: ['', Validators.required],
    });
  }
  onDeliverySubmit() {
    // Check if the delivery form is valid
    if (this.deliveryForm.valid) {
      // Show the payment form if the form is valid
      this.showPaymentForm = true;
    } else {
      // Optionally, you can handle invalid fields without marking them as touched
      console.log('Please fill in all required fields.');
    }
  }
  

  onPaymentSubmit(event: Event) {
    console.log('Payment form submit triggered'); // Log to check if function is triggered
    event.preventDefault();
  
    if (!this.cardDetails || !this.cardDetails.card) {
      this.showCheckoutErrorMessage = true;
      this.deliveryErrorMessage = "Please enter valid card details";
      return;
    }
  
    const paymentMethodData: CreatePaymentMethodData = {
      type: 'card',
      card: this.cardDetails.card,
      billing_details: {
        name: this.deliveryForm.get('fullName').value,
        email: this.deliveryForm.get('email').value,
        phone: this.deliveryForm.get('phone').value,
        address: {
          line1: this.deliveryForm.get('address').value,
          postal_code: this.deliveryForm.get('postcode').value,
        },
      },
    };
  
  
    this.stripeService.createPaymentMethod(paymentMethodData).subscribe({
      next: (result) => {
        if (result.error) {
          console.error('Error creating payment method:', result.error.message);
          this.showCheckoutErrorMessage = true;
          this.deliveryErrorMessage = result.error.message;
        } else {
          console.log('Payment Method created successfully:', result);
          this.showCheckoutErrorMessage = false;

  
          // Get total price
          const totalPrice = this.cartService.getTotalPrice();
          console.log('Total Price:', totalPrice); // This should log the total price
               console.log('Payment form submitted successfully!');   }
      },
      error: (error) => {
        console.error('Error creating payment method:', error);
        this.showCheckoutErrorMessage = true;
        this.deliveryErrorMessage = error.message;
      },
    });
  }
  

  goBack() {
    this.router.navigate(["/cart"]);
  }
}
