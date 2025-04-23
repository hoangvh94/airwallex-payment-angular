import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'dashboards/analytics' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'dashboards/analytics',
    },

    // Auth routes for guests
    {
        path: '',
        // canActivate: [NoAuthGuard],
        // canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
            {
                path: 'register/verify',
                loadChildren: () =>
                    import('app/modules/auth/verify/verify.routes'),
            },
            {
                path: 'auth/social/callback',
                loadChildren: () =>
                    import('app/modules/auth/callback/callback.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            // {path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            // Dashboards
            {
                path: 'dashboards',
                children: [
                    {
                        path: 'analytics',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/analytics/analytics.routes'
                            ),
                    },
                ],
            },

            {
                path: 'apps',
                children: [
                    {
                        path: 'motor',
                        loadChildren: () =>
                            import('app/modules/admin/motor/motor.routes'),
                    },
                ],
            },

            // Apps
            {
                path: 'apps',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                children: [
                    {
                        path: 'ecommerce',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/apps/ecommerce/ecommerce.routes'
                            ),
                    },
                    {
                        path: 'file-manager',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/apps/file-manager/file-manager.routes'
                            ),
                    },
                    {
                        path: 'help-center',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/apps/help-center/help-center.routes'
                            ),
                    },
                    {
                        path: 'example',
                        loadChildren: () =>
                            import('app/modules/admin/example/example.routes'),
                    },
                ],
            },

            // Pages
            {
                path: 'pages',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                children: [
                    // Pricing
                    {
                        path: 'pricing',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/pages/pricing/modern/modern.routes'
                            ),
                    },

                    {
                        path: 'success',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/pages/success/success.routes'
                            ),
                    },

                    // Settings
                    {
                        path: 'settings',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/pages/settings/settings.routes'
                            ),
                    },
                ],
            },

            // 404 & Catch all
            {
                path: '404-not-found',
                pathMatch: 'full',
                loadChildren: () =>
                    import(
                        'app/modules/admin/pages/error/error-404/error-404.routes'
                    ),
            },
            { path: '**', redirectTo: '404-not-found' },
        ],
    },
];
