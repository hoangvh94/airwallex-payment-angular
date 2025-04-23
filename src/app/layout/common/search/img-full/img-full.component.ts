// import { NgClass } from '@angular/common';
import {
    Component,
    Inject,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogClose,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
    NgxPayPalModule
} from 'ngx-paypal';

@Component({
    selector: 'item-img',
    templateUrl: './img-full.component.html',
    styleUrls: ['./img-full.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        NgxPayPalModule,
        MatDialogClose,
    ],
})
export class ImgFullComponent
    implements OnInit
{
    src: any = null;

    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: { src: any }
    ) {}

    ngOnInit(): void {
        this.src = this._data.src;
    }
}
