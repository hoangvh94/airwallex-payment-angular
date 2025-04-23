import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'auth-verify-required',
    templateUrl: './verify.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
    ],
})
export class VerifyComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    signUpForm: UntypedFormGroup;
    token = '';

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    getToken() {
        this.route.queryParams.subscribe((params) => {
            console.log(params);
            this.token = params.token;
            console.log(this.token);
            this.verify();
        });
    }

    reVerify() {
        this._authService.verify(this.token).subscribe({
            next: (response: any) => {
                this.router.navigateByUrl('/confirmation-required');
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
        this.getToken();
    }

    verify() {
        this._authService.verify(this.token).subscribe({
            next: (response: any) => {
                this.router.navigate(['sign-in'], {
                    queryParams: {
                        verify: response.data[0],
                    },
                });
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
