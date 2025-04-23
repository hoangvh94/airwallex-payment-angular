import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'auth-callback-required',
    templateUrl: './callback.component.html',
    standalone: true,
    imports: [],
})
export class CallbackComponent implements OnInit {
    /**
     * Constructor
     */
    constructor(
        private route: ActivatedRoute,
        private _authService: AuthService,
        private _router: Router
    ) {}

    getToken() {
        this.route.queryParams.subscribe((params) => {
            console.log(params);
            const code = params.code;
            if (code) {
                this._authService.callBackGoogleUrl(code).subscribe({
                    next: (response) => {
                        console.log(response);
                        this._router.navigateByUrl('/');
                    },
                    error: (error) => {
                        console.log(error);
                    },
                });
            }
        });
    }

    ngOnInit(): void {
        this.getToken();
    }
}
