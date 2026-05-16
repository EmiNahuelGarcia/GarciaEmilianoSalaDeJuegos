import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { IGitHubUser } from '../models/github-interface';

@Injectable({ providedIn: 'root' })
export class GitHubService {
    usuario = "EmiNahuelGarcia";
    apiGithub = environment.githubApiUrl;
    http = inject(HttpClient);
    usuarioGitHub = signal<IGitHubUser | null>(null);

    obtenerUsuarioGitHub(usuario: string = this.usuario) {
        this.http.get<IGitHubUser>(this.apiGithub + usuario)
            .subscribe({
                next: (dato) => this.usuarioGitHub.set(dato),
                error: (err) => console.error('Error al obtener usuario:', err)
            });
    }
}