import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,   } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  showPaymentForm: boolean = false;

  deliveryForm: FormGroup;
  deliveryFormSubmitted = false;
  httpRequestIsPending = false;
  deliveryErrorMessage: string;
  showCheckoutErrorMessage = false;
  constructor( private formBuilder: FormBuilder,
    private router: Router,) { }

  ngOnInit() {
    this.buildForm();
  }


  buildForm() {
    this.deliveryForm = this.formBuilder.group({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      postcode: '',
      cvc: '',
      card:'',
      expiry:''
    });
  }onDeliverySubmit() {
    // Show the payment form regardless of validity
    this.showPaymentForm = true;
  }

  goBack() {
    this.router.navigate(['/cart'])
  };
}
