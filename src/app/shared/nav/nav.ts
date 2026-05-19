import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';


@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './nav.html',
    styleUrl: './nav.css',
})
export class Nav {
    router = inject(Router);
    auth = inject(AuthService);

    nameUser(): string | null {
        const user = this.auth.actualUser();
        return user?.user_metadata?.['name'] || 'invitado'
    }

    logout() {
        this.auth.logout();
        this.router.navigateByUrl('/home')
    }
}
