import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { StripeElementsOptions } from '@stripe/stripe-js';
import {
    StripeElementsDirective,
    StripePaymentElementComponent,
    injectStripe,
} from 'ngx-stripe';

@Component({
    selector: 'pricing-single',
    templateUrl: './single.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FuseCardComponent,
        MatIconModule,
        MatButtonModule,
        StripeElementsDirective,
        StripePaymentElementComponent,
    ],
})
export class PricingSingleComponent {
    stripe = injectStripe(
        'pk_test_51MziZKDnfhTxQmx98ded7vhy40ATWeQVFNL7F7nVFIlbsbBL4mLOaSyVxKSOTBmcnMJWVo6CnxLTZQxr1pxWcMSj00tgxXYVjU'
    );
    elementsOptions: StripeElementsOptions = {
        locale: 'en',
        // d: this.stripe.retrievePaymentIntent
        // passing the client secret obtained from the server
        // clientSecret:
        //     'sk_test_51MziZKDnfhTxQmx9WBtyiN9rFLpKaKDdZ8llMMAj8eyyPnh2LWzVLuz707ovmOW980kqD8yW8HW0EP34N26fTP0b00w0bDa8bu',
    };
    /**
     * Constructor
     */
    constructor() {}
}
