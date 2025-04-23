import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ServerService } from 'app/core/server/server.service';

@Component({
    selector: 'success',
    standalone: true,
    templateUrl: './success.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
})
export class SuccessComponent {
    /**
     * Constructor
     */

    constructor(
        private serverService: ServerService,
        private router: Router
    ) {
        if (this.serverService.sessionSubscription === '') {
            this.router.navigateByUrl('');
        }
    }

    gotIt() {
        this.router.navigate(['apps/file-manager']);
    }
}
