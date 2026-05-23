import { Component, inject, computed, OnInit } from '@angular/core';
import { GitHubService } from '../../services/github';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/spinnerComponent';
import { FormatearFechaPipe } from '../../shared/pipes/formatear-fecha.pipe';

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule, SpinnerComponent, FormatearFechaPipe],
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
}