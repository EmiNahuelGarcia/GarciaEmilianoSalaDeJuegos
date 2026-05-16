import { Component, inject, computed, OnInit } from '@angular/core';
import { GitHubService } from '../../services/github';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/spinnerComponent';

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit {
  githubService = inject(GitHubService);
  usuarioGitHub = this.githubService.usuarioGitHub;
  loading = computed(() => !this.usuarioGitHub());


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