import { Routes } from '@angular/router';
import { guestGuard } from './guards/guest-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home)
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/login/login').then((m) => m.Login)
    },
    {
        path: 'registro',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro)
    },
    {
        path: 'juegos',
        children: [
            {
                path: 'ahorcado',
                loadComponent: () => import('./games/ahorcado/ahorcado').then((a) => a.Ahorcado),
                canActivate: [authGuard]
            },
            {
                path: 'mayor-menor',
                loadComponent: () => import('./games/mayor-menor/mayor-menor').then((m) => m.MayorMenor),
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: 'quien-soy',
        loadComponent: () => import('./pages/quien-soy/quien-soy').then((m) => m.QuienSoy)
    },

    {
        path: 'resultados',
        loadComponent: () => import('./pages/resultados/resultados').then((m) => m.Resultados),
        canActivate: [authGuard]       
    },
    {
        path: '**',
        loadComponent: () => import('./pages/error-page/error-page').then((m) => m.ErrorPage)
    },

];
