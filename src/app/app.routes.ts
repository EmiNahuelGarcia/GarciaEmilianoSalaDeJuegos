import { Routes } from '@angular/router';

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
        loadComponent: () => import('./pages/login/login').then((m) => m.Login)
    },
    {
        path: 'registro',
        loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro)
    },
    {
        path: 'quien-soy',
        loadComponent: () => import('./pages/quien-soy/quien-soy').then((m) => m.QuienSoy)
    }
];
