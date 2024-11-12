import { Routes } from '@angular/router';
import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { isNotLoggedInGuard } from './guards/is-not-logged-in.guard';
import { isAdminGuard } from './guards/is-admin.guard';
import { isEspecialistaGuard } from './guards/is-especialista.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: "full" },
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
        path: 'mis-turnos', loadComponent: () => import('./components/mis-turnos/mis-turnos.component').then(
            x => x.MisTurnosComponent
        ),
        canActivate: [isLoggedInGuard],
        
    },

    {
        path: 'turnos', loadComponent: () => import('./components/turnos/turnos.component').then(
            x => x.TurnosComponent
        ),
        canActivate: [isAdminGuard],
    },

    {
        path: 'solicitar-turno', loadComponent: () => import('./components/solicitar-turno/solicitar-turno.component').then(
            x => x.SolicitarTurnoComponent
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
        path: 'users', loadComponent: () => import('./components/users/users.component').then(
            x => x.UsersComponent
        ),
        canActivate: [isAdminGuard],
    },

    {
        path: 'pacientes', loadComponent: () => import('./components/pacientes/pacientes.component').then(
            x => x.PacientesComponent
        ),
        canActivate: [isEspecialistaGuard],
    },
];
