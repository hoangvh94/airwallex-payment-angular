import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AiService } from 'app/core/ai/ai.service';
import { FileType, PDF } from 'app/core/ai/file.types';
import { FileManagerService } from 'app/modules/admin/apps/file-manager/file-manager.service';
import {
    Item,
    Items,
} from 'app/modules/admin/apps/file-manager/file-manager.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'file-manager-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        RouterOutlet,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
})
export class FileManagerListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    items: Items;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    currentFile?: File;
    fileName: string = 'Select File';

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _aiService: AiService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getAllFile();

        // Get the items
        this._fileManagerService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: Items) => {
                this.items = items;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this.selectedItem = item;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media query change
        this._fuseMediaWatcherService
            .onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

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
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
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

    selectFile(event: any): void {
        if (event.target.files && event.target.files[0]) {
          const file: File = event.target.files[0];
          this.currentFile = file;
          this.fileName = this.currentFile.name;
        } else {
          this.fileName = 'Select File';
        }
        // this.progress = 0;
        // this.message = '';
      }

    getAllFile() {
        const pdf: PDF = {
            user_id: 'E1',
            product: 'Komatsu WA320-5 SN 60001-UP (KomatsuTRAX(GPRS)) Parts manual Wheel Loader',
            file: this.currentFile,
            type: FileType.CONTENT
        }
        this._aiService.getAllFile().subscribe(
            (next) => {
                console.log(next);
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
    

    uploadFile() {
        const pdf: PDF = {
            user_id: 'E2',
            product: this.fileName.slice(0, -4),
            file: this.currentFile,
            type: FileType.CATALOG
        }
        console.log(pdf);
        this._aiService.uploadFile(pdf).subscribe(
            (next) => {
                console.log(next);
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
}
