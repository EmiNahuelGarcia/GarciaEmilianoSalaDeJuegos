import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';


export const guestGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    await auth.checkSession();

    if (auth.isAutehticated()) {
        return router.navigate(['/home']);
    }

    return true;
};