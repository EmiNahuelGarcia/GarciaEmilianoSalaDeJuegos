import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';



@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './nav.html',
    styleUrl: './nav.css',
})
export class Nav {
    router = inject(Router);
    //placeholder para el service de auth de sprint 2

    nameUser(): string | null {
        return 'placeholder'; // Reemplazar con el nombre del usuario obtenido del servicio de autenticación
    }

    logout() {
        //placeholder para el service de auth de sprint 2
        this.router.navigateByUrl('/home')
    }
}
