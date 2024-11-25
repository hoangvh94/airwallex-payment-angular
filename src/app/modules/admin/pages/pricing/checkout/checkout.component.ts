// import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import Airwallex from 'airwallex-payment-elements';
import { AirwallexService } from 'app/core/airwallex/airwallex.service';
import { StripeElementsDirective } from 'ngx-stripe';

@Component({
    selector: 'pricing-checkout',
    templateUrl: './checkout.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButtonModule, FuseCardComponent, MatIconModule],
})
export class PricingCheckoutComponent implements OnInit, OnDestroy {
    @ViewChild(StripeElementsDirective) elements!: StripeElementsDirective;
    yearlyBilling: boolean = true;
    airwallexAuth: any = {
        expires_at: '2024-11-20T03:38:36+0000',
        token: 'eyJhbGciOiJIUzI1NiJ9',
    };

    airCustomer: any;

    // stripe = injectStripe(
    //     'pk_test_51MziZKDnfhTxQmx98ded7vhy40ATWeQVFNL7F7nVFIlbsbBL4mLOaSyVxKSOTBmcnMJWVo6CnxLTZQxr1pxWcMSj00tgxXYVjU'
    // );
    // elementsOptions: StripeElementsOptions = {
    //     locale: 'en',
    //     // passing the client secret obtained from the server
    //     clientSecret: 'sk_test_51MziZKDnfhTxQmx9WBtyiN9rFLpKaKDdZ8llMMAj8eyyPnh2LWzVLuz707ovmOW980kqD8yW8HW0EP34N26fTP0b00w0bDa8bu',
    // };

    /**
     * Constructor
     */
    constructor(private airwallexService: AirwallexService) {}

    ngOnInit(): void {
        Airwallex.loadAirwallex({
            env: 'demo', // 'staging' | 'demo' | 'prod'
        });
    }

    // createCustomer(airwallexAuth: any) {
    //     const customer = {
    //         id: 'cus_hkdmht8f4h21bn9ex4w',
    //         client_secret:"eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzIyNjUxOTgsImV4cCI6MTczMjI2ODc5OCwidHlwZSI6ImNsaWVudC1zZWNyZXQiLCJwYWRjIjoiSEsiLCJhY2NvdW50X2lkIjoiMzM1Y2ZlYjUtYjZkMy00MjQzLWIwZmEtMWY2N2I1MjY2YmJmIiwiY3VzdG9tZXJfaWQiOiJjdXNfaGtkbWh0OGY0aDIxYm45ZXg0dyJ9.EpSF6bC8FguLnYlmsg-OM9Gl_m3VsjJur5oozl77c6s"
    //     };
    //     this.dropIn(customer);
    //     // this.airwallexService.createCustomer(airwallexAuth).subscribe(
    //     //     (next) => {
    //     //         console.log(next);
    //     //         const customer = next;
    //     //         this.dropIn(customer);
    //     //     },
    //     //     (error) => {
    //     //         console.log(error);
    //     //         // // Re-enable the form
    //     //         // this.signInForm.enable();

    //     //         // // Reset the form
    //     //         // this.signInNgForm.resetForm();

    //     //         // // Set the alert
    //     //         // this.alert = {
    //     //         //     type: 'error',
    //     //         //     message: 'Wrong email or password',
    //     //         // };

    //     //         // // Show the alert
    //     //         // this.showAlert = true;
    //     // }
    //     // );
    // }

    airAuthen() {
        this.airwallexService.authen().subscribe(
            (next: any) => {
                console.log(next);
                const res = next.data[0];
                this.dropIn(res.customerId, res.customerSecret, res.intentId);
                // this.airwallexAuth = next;
                // this.getCustomers(next);
                // this.createCustomer(next);
            },
            (error) => {
                console.log(error);
                // // Re-enable the form
                // this.signInForm.enable();

                // // Reset the form
                // this.signInNgForm.resetForm();

                // // Set the alert
                // this.alert = {
                //     type: 'error',
                //     message: 'Wrong email or password',
                // };

                // // Show the alert
                // this.showAlert = true;
            }
        );
    }

    // getCustomers(airwallexAuth: any) {
    //     this.airwallexService.getCustomer(airwallexAuth).subscribe(
    //         (next) => {
    //             console.log(next);
    //             const customer = next;
    //             console.log(customer);
    //         },
    //         (error) => {
    //             console.log(error);
    //             // // Re-enable the form
    //             // this.signInForm.enable();

    //             // // Reset the form
    //             // this.signInNgForm.resetForm();

    //             // // Set the alert
    //             // this.alert = {
    //             //     type: 'error',
    //             //     message: 'Wrong email or password',
    //             // };

    //             // // Show the alert
    //             // this.showAlert = true;
    //         }
    //     );
    // }

    payByCard() {
        this.airAuthen();

        // this.dropIn(
        //     "cus_hkdmht8f4h24lp5676q",
        //     "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzI1MjIxNzIsImV4cCI6MTczMjUyNTc3MiwidHlwZSI6ImNsaWVudC1zZWNyZXQiLCJwYWRjIjoiSEsiLCJhY2NvdW50X2lkIjoiMzM1Y2ZlYjUtYjZkMy00MjQzLWIwZmEtMWY2N2I1MjY2YmJmIiwiY3VzdG9tZXJfaWQiOiJjdXNfaGtkbWh0OGY0aDI0bHA1Njc2cSJ9.GVDkzM8cnYKbxLSaz6oMUamOTQpylBNQ6uuzBndp66E",
        //     "int_hkdmht8f4h24lp59ddw"
        // );
    }

    dropIn(customer_id: string, client_secret, intent_id: string) {
        console.log('pay by drop');
        // const cardElement = Airwallex.createElement('card');
        // cardElement.mount('card');
        setTimeout(() => {
            const element = Airwallex.createElement('dropIn', {
                intent_id,
                customer_id,
                client_secret,
                currency: 'USD',
                methods: ['googlepay', 'applepay', 'card'],
                // mode: 'recurring',
                // recurringOptions: {
                //     next_triggered_by: 'merchant',
                //     merchant_trigger_reason: 'scheduled',
                //     currency: 'SGD',
                // },
                // googlePayRequestOptions: {
                //     countryCode: 'US',
                //     merchantInfo: {
                //         merchantName: 'Example Merchant',
                //     },
                //     buttonType: 'buy', // Indicate the type of button you want displayed on your payments form. Like 'buy'
                // },
            });
            element.mount('dropIn');
            window.addEventListener('onReady', this.onReady);
            window.addEventListener('onSuccess', this.onSuccess);
            window.addEventListener('onError', this.onError);
        }, 0);
    }

    onReady(event: any): void {
        /**
         * ... Handle events on element mount
         */
        // this.loading = false;
        console.log(`Element is mounted: ${JSON.stringify(event.detail)}`);
    }

    // STEP #7: Add an event listener to handle events when the payment is successful.
    onSuccess(event: any): void {
        /**
         * ... Handle events on success
         */
        console.log(`Confirm success with ${JSON.stringify(event.detail)}`);
    }

    // STEP #8: Add an event listener to handle events when the payment has failed.
    onError(event: any) {
        /**
         * ... Handle events on error
         */
        const { error } = event.detail;
        // this.errorMessage = error.message ?? JSON.stringify(error); // Example: set error message
        console.error('There was an error', error);
    }

    ngOnDestroy(): void {
        Airwallex.destroyElement('dropIn');
    }
}
