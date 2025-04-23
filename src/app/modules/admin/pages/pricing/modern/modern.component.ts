import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { PricingCheckoutComponent } from '../checkout/checkout.component';
import { PLAN } from '../checkout/plan';

@Component({
    selector: 'pricing-modern',
    templateUrl: './modern.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButtonModule, FuseCardComponent, MatIconModule],
})
export class PricingModernComponent {
    yearlyBilling: boolean = true;
    plan = PLAN;
    /**
     * Constructor
     */
    constructor(private _matDialog: MatDialog) {}

    /**
     * Open the note dialog
     */
    doCheckout(plan: String): void {
        this._matDialog.open(PricingCheckoutComponent, {
            autoFocus: false,
            disableClose: true,
            data: {
                plan,
            },
        });
    }
}
