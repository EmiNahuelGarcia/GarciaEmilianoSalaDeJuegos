import { Component, inject } from '@angular/core';
import { GitHubService } from '../../services/github';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy {
  githubService = inject(GitHubService);
  usuarioGitHub = this.githubService.usuarioGitHub;

  ngOnInit() {
    this.githubService.obtenerUsuarioGitHub();
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
