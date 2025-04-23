// import { NgClass } from '@angular/common';
import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogClose,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import Airwallex from 'airwallex-payment-elements';
import { AirwallexService } from 'app/core/airwallex/airwallex.service';
import { ServerService } from 'app/core/server/server.service';
import {
    ICreateSubscriptionRequest,
    IPayPalConfig,
    NgxPayPalModule,
} from 'ngx-paypal';
import { StripeElementsDirective } from 'ngx-stripe';
import { PLAN } from './plan';

@Component({
    selector: 'pricing-checkout',
    templateUrl: './checkout.component.html',
    styles: '.close-button {position: absolute; top:0; right:0}',
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        FuseCardComponent,
        MatIconModule,
        NgxPayPalModule,
        MatDialogClose,
    ],
})
export class PricingCheckoutComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild(StripeElementsDirective) elements!: StripeElementsDirective;
    yearlyBilling: boolean = true;
    payPalConfig?: IPayPalConfig;

    PAYPAL_PLAN_ID = 'P-0L210117S24646005M5DOAVI';
    plan = PLAN.DIY;
    sku = '';
    airCustomer: any;
    /**
     * Constructor
     */
    constructor(
        private airwallexService: AirwallexService,
        private serverService: ServerService,
        private router: Router,
        private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public _data: { plan: string },
        private _matDialogRef: MatDialogRef<PricingCheckoutComponent>
    ) {}

    ngOnInit(): void {
        this.getFile();
    }

    getFile() {
        this.route.queryParams.subscribe((params) => {
            this.sku = params.sku;
        });
    }

    ngAfterViewInit(): void {
        this.plan = PLAN[this._data.plan];

        Airwallex.loadAirwallex({
            env: 'demo', // 'staging' | 'demo' | 'prod'
        }).then(() => {
            this.initPaymentMethod();
        });
    }

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
            }
        );
    }

    initPaymentMethod() {
        this.airAuthen();
        this.initPaypal();
    }

    dropIn(customer_id: string, client_secret, intent_id: string) {
        console.log('pay by drop');
        // const cardElement = Airwallex.createElement('card');
        // cardElement.mount('card');
        setTimeout(() => {
            const element = Airwallex.createElement('dropIn', {
                // intent_id: 'int_hkdmht8f4h25hz50pp3',
                customer_id,
                client_secret,
                currency: 'USD',
                methods: ['googlepay', 'applepay', 'card'],
                mode: 'recurring',
                recurringOptions: {
                    next_triggered_by: 'merchant',
                    merchant_trigger_reason: 'scheduled',
                    currency: 'USD',
                },
            });
            element.mount('dropIn');
            window.addEventListener('onReady', this.onReady);
            window.addEventListener('onSuccess', this.onSuccess);
            window.addEventListener('onError', this.onError);
        }, 0);
    }

    subscription(customerId: string, consentId: string) {
        console.log('subscription', this.sku);
        this.airwallexService
            .makeSubscription(customerId, consentId, this._data.plan, this.sku)
            .subscribe(
                (next: any) => {
                    console.log(next);
                    this.serverService.sessionSubscription = next.data[0];
                    this._matDialogRef.close();
                    this.router.navigateByUrl('/pages/success');
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    onReady(event: any): void {
        /**
         * ... Handle events on element mount
         */
        // this.loading = false;
        console.log(`Element is mounted: ${JSON.stringify(event.detail)}`);
    }

    onSuccess = (event: any) => {
        console.log(`Confirm success with`, event);
        const id = (event.target as Element).id;

        if (id === 'dropIn') {
            this.subscription(
                event.detail.intent.latest_payment_attempt.payment_method
                    .customer_id,
                event.detail.intent.payment_consent_id
            );
            // this.registerPlan();
        }
    };

    // STEP #8: Add an event listener to handle events when the payment has failed.
    onError(event: any) {
        /**
         * ... Handle events on error
         */
        const { error } = event.detail;
        // this.errorMessage = error.message ?? JSON.stringify(error); // Example: set error message
        console.error('There was an error', error);
    }

    initPaypal(): void {
        this.payPalConfig = {
            currency: 'USD',
            clientId:
                'AbhOH2p7mGDxgkKOLOgBAJjVFESKAZXSg6TbznqMgEL2BPwt8Dp0zB6c0VEswBRIA-bcEu7USeccXhmT',
            // createOrderOnClient: (data) => < ICreateOrderRequest > {
            //     intent: 'CAPTURE',
            //     purchase_units: [{
            //         amount: {
            //             currency_code: 'USD',
            //             value: '9.99',
            //             breakdown: {
            //                 item_total: {
            //                     currency_code: 'USD',
            //                     value: '9.99'
            //                 }
            //             }
            //         },
            //         items: [{
            //             name: 'Enterprise Subscription',
            //             quantity: '1',
            //             category: 'DIGITAL_GOODS',
            //             unit_amount: {
            //                 currency_code: 'USD',
            //                 value: '9.99',
            //             },
            //         }]
            //     }]
            // },
            fundingSource: 'PAYPAL',
            createSubscriptionOnClient: (data) =>
                <ICreateSubscriptionRequest>{
                    plan_id: this.PAYPAL_PLAN_ID,
                    custom_id: 'rps-sub1',
                },
            vault: 'true',
            advanced: {
                commit: 'true',
            },
            style: {
                label: 'paypal',
                layout: 'vertical',
                height: 40,
            },
            onApprove: (data, actions) => {
                console.log(
                    'onApprove - transaction was approved, but not authorized',
                    data
                );
                this.registerPlan();
            },
            onClientAuthorization: (data) => {
                console.log(
                    'onClientAuthorization - you should probably inform your server about completed transaction at this point',
                    data
                );
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
            },
            onError: (err) => {
                console.log('OnError', err);
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
            },
        };
    }

    registerPlan() {
        this.serverService.registerPlan(this.plan.name).subscribe(
            (next: any) => {
                console.log(next);
                this.serverService.sessionSubscription = next.data[0];
                this._matDialogRef.close();
                this.router.navigateByUrl('/pages/success');
            },
            (error) => {
                console.log(error);
            }
        );
    }

    ngOnDestroy(): void {
        // Airwallex.destroyElement('dropIn');
        window.removeEventListener('onReady', this.onReady);
        window.removeEventListener('onSuccess', this.onSuccess);
        window.removeEventListener('onError', this.onError);
    }
}
