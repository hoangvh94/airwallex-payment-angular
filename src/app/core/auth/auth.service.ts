import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    private authenUrl = environment.authenUrl;

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set tokenExpire(expire: string) {
        localStorage.setItem('tokenExpire', expire);
    }

    get tokenExpire(): string {
        return localStorage.getItem('tokenExpire') ?? '';
    }

    set user(u: any) {
        localStorage.setItem('user', u);
    }

    get user(): any {
        return localStorage.getItem('user') ?? {};
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient
            .post(this.authenUrl + '/signin', credentials)
            .pipe(
                switchMap((response: any) => {
                    console.log(response);
                    const auth = response.data[0];
                    // Store the access token in the local storage
                    this.accessToken = auth.jwt;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = {
                        id: auth.userId,
                        name: auth.userName,
                        email: auth.email,
                        avatar: 'images/avatars/brian-hughes.jpg',
                        status: 'online',
                    };
                    this.user = JSON.stringify({
                        id: auth.userId,
                        name: auth.userName,
                        email: auth.email,
                        avatar: 'images/avatars/brian-hughes.jpg',
                        status: 'online',
                    });

                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        let d = new Date();
        let now = d.getMilliseconds();
        if (Number(this.tokenExpire) < now) {
            this._userService.user = JSON.parse(this.user);
            return of(true);
        } else {
            return of(false);
        }
        // Sign in using the token
        // return this._httpClient
        //     .post('api/auth/sign-in-with-token', {
        //         accessToken: this.accessToken,
        //     })
        //     .pipe(
        //         catchError(() =>
        //             // Return false
        //             of(false)
        //         ),
        //         switchMap((response: any) => {
        //             // Replace the access token with the new one if it's available on
        //             // the response object.
        //             //
        //             // This is an added optional step for better security. Once you sign
        //             // in using the token, you should generate a new one on the server
        //             // side and attach it to the response object. Then the following
        //             // piece of code can replace the token with the refreshed one.
        //             if (response.accessToken) {
        //                 this.accessToken = response.accessToken;
        //             }

        //             // Set the authenticated flag to true
        //             this._authenticated = true;

        //             // Store the user on the user service
        //             this._userService.user = response.user;

        //             // Return true
        //             return of(true);
        //         })
        //     );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post(this.authenUrl + '/signup', user);
        // return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
    /**
     * Sign in using the social
     */
    loginSocial() {}

    getGoogleUrl() {
        return this._httpClient.get(this.authenUrl + '/google').pipe(
            switchMap((response: any) => {
                console.log(response);
                const url = response.data[0];
                return of(url);
            })
        );
    }

    callBackGoogleUrl(code: string) {
        let params = new HttpParams().set('code', code);
        return this._httpClient
            .get(this.authenUrl + '/social/callback', {
                params,
            })
            .pipe(
                switchMap((response: any) => {
                    console.log(response);
                    const auth = response.data[0];
                    // Store the access token in the local storage
                    this.accessToken = auth.jwt;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = {
                        id: auth.userId,
                        name: auth.userName,
                        email: auth.email,
                        avatar: 'images/avatars/brian-hughes.jpg',
                        status: 'online',
                    };
                    this.user = JSON.stringify({
                        id: auth.userId,
                        name: auth.userName,
                        email: auth.email,
                        avatar: 'images/avatars/brian-hughes.jpg',
                        status: 'online',
                    });

                    // Return a new observable with the response
                    return of(response);
                })
            );
        // return of('acv');
    }

    verify(token: string) {
        let params = new HttpParams().set('token', token);
        return this._httpClient
            .get(this.authenUrl + '/verify', {
                params,
            })
            .pipe(
                switchMap((response: any) => {
                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    reVerify(email: string) {
        const body = {
            email,
        };
        return this._httpClient.post(this.authenUrl + '/verify', body).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }
}
