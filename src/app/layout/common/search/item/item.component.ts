// import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogClose,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AiService } from 'app/core/ai/ai.service';
import { FileType, PDF } from 'app/core/ai/file.types';
import { Product } from 'app/core/server/product.types';
import { ServerService } from 'app/core/server/server.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { NgxPayPalModule } from 'ngx-paypal';

@Component({
    selector: 'item-product',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        FuseCardComponent,
        MatIconModule,
        NgxPayPalModule,
        MatDialogClose,
        CommonModule,
    ],
})
export class ItemComponent implements OnInit {
    item: any = null;
    src = '';
    isFullView = 'none';
    user: User;
    fileType = FileType.CONTENT;
    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: { item: any },
        private serverService: ServerService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialogRef: MatDialogRef<ItemComponent>,
        private router: Router,
        private aiService: AiService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.item = this._data.item;
        this._userService.user$.subscribe((user: User) => {
            this.user = user;
        });
    }

    openFullImg(src: string) {
        // this._matDialog.open(ImgFullComponent, {
        //     autoFocus: false,
        //     disableClose: true,
        //     data: {
        //         src
        //     },
        // });
        this.src = src;
        this.isFullView = 'block';
    }

    exitFullScreen() {
        this.src = '';
        this.isFullView = 'none';
    }

    addProduct() {
        const product: Product = {
            sku: this.item.sku,
            name: this.item.name,
        };
        this.serverService.addProduct(product).subscribe({
            next: (response) => {
                console.log(response);
                switch (response['status']) {
                    case HttpStatusCode.Ok: {
                        console.log(response['data'][0]);
                        
                        // this.uploadURL(response['data'][0])
                        this._matDialogRef.close();
                        this.router.navigateByUrl('/apps/file-manager');
                        break;
                    }
                    case HttpStatusCode.UpgradeRequired: {
                        const confirmation = this._fuseConfirmationService.open(
                            {
                                title: 'Add new product',
                                message: response['message'],
                                actions: {
                                    confirm: {
                                        label: 'Upgrade',
                                    },
                                    cancel: {
                                        label: 'Cancel',
                                    },
                                },
                            }
                        );

                        // Subscribe to the confirmation dialog closed action
                        confirmation.afterClosed().subscribe((result) => {
                            // If the confirm button pressed...
                            console.log(result);
                            if (result === 'confirmed') {
                                this._matDialogRef.close();
                                // this.router.navigateByUrl('/pages/pricing');
                                this.router.navigate(['pages/pricing'], {
                                    queryParams: {
                                        sku: product.sku
                                    },
                                });
                            } else {
                                this._matDialogRef.close();
                            }
                        });
                        break;
                    }
                }
            }, // nextHandler
            error: (error) => {
                console.log(error);
            },
        });
        console.log(product);
    }

    aiUSerId() {
        return this.user.name + this.user.id;
    }

    uploadURL(file: String) {
        const pdf: PDF = {
            user_id: this.aiUSerId(),
            product: file.slice(57, -4),
            file: null,
            type: this.fileType,
            url: 'https://stormrage-bucket.s3.ap-southeast-1.amazonaws.com/John Deere 600 Amt Parts Catalog Manual.pdf'
        };
        this.aiService.uploadFile(pdf).subscribe({
            next: (response) => {
                console.log(response);
            },
            error: (error) => {
                console.log(error);
            },
        });

        console.log(pdf);
    }
}
