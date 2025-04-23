import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ServerService } from 'app/core/server/server.service';
import { FileManagerService } from 'app/modules/admin/apps/file-manager/file-manager.service';
import { Item } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'file-manager-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule],
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy {
    item: Item;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: FileManagerListComponent,
        private _fileManagerService: FileManagerService,
        private _serverService: ServerService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this._fileManagerListComponent.matDrawer.open();

        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                // Open the drawer in case it is closed
                console.log(item);

                this._fileManagerListComponent.matDrawer.open();

                // Get the item
                this.item = item;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._fileManagerListComponent.matDrawer.close();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    askAi() {
        this._router.navigate(['apps/example'], {
            queryParams: {
                file: this.item.collection_name,
            },
        });
    }

    confirmCancel(){
        const confirmation = this._fuseConfirmationService.open(
            {
                title: 'Cancel a subscription',
                message: 'Are you sure to remove this product. It wont back you money',
                actions: {
                    confirm: {
                        label: 'Yes',
                    },
                    cancel: {
                        label: 'No',
                    },
                },
            }
        );

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            console.log(result);
            if (result === 'confirmed') {
                this.cancel()
            } else {
            }
        });
    }

    cancel() {
        this._serverService.cancel(this.item.sku).subscribe({
            next: (next) => {
                console.log(next);
                this._router.navigate(['apps/file-manager']);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
