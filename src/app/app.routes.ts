import { Routes } from '@angular/router';
import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { isNotLoggedInGuard } from './guards/is-not-logged-in.guard';
import { isAdminGuard } from './guards/is-admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: "full" },
    {
        path: 'home', loadComponent: () => import('./components/home/home.component').then(
            x => x.HomeComponent
        ),
        canActivate: [isLoggedInGuard],
    },
    {
        path: 'mi-perfil', loadComponent: () => import('./components/mi-perfil/mi-perfil.component').then(
            x => x.MiPerfilComponent
        ),
        canActivate: [isLoggedInGuard],
    },

    
    {
        path: 'login', loadComponent: () => import('./components/login/login.component').then(
            x => x.LoginComponent
        ),
        canActivate: [isNotLoggedInGuard],
    },

    {
        path: 'register', loadComponent: () => import('./components/register/register.component').then(
            x => x.RegisterComponent
        ),
        canActivate: [isNotLoggedInGuard],
    },

    {
        path: 'welcome', loadComponent: () => import('./components/welcome/welcome.component').then(
            x => x.WelcomeComponent
        ),
        canActivate: [isNotLoggedInGuard],
    },

    {
        path: 'verify-email', loadComponent: () => import('./components/verify-email/verify-email.component').then(
            x => x.VerifyEmailComponent
        )
    },

    {
        path: 'not-enabled', loadComponent: () => import('./components/not-enabled/not-enabled.component').then(
            x => x.NotEnabledComponent
        )
    },

    {
        path: 'users', loadComponent: () => import('./components/users/users.component').then(
            x => x.UsersComponent
        ),
        canActivate: [isAdminGuard],
    },

    {
        path: '**', loadComponent: () => import('./components/page-not-found/page-not-found.component').then(
            x => x.PageNotFoundComponent
        )
    },
];
