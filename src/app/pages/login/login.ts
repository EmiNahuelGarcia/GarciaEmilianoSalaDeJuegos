import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILogin } from '../../models/registro-interface';
import { SpinnerComponent } from '../../shared/spinner/spinnerComponent';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, SpinnerComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);
  auth = inject(AuthService);
  showPassword = signal(false);
  error = signal('');
  loading = signal(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(8), Validators.maxLength(20)])
  });
  
  async onSubmit() {
    if (this.loginForm.invalid) {
      this.error.set('Por favor, ingrese un email válido y una contraseña de 8 a 20 caracteres alfanuméricos.');
      return;
    }
    this.error.set('');
    this.loading.set(true);
    try{
      const response= await this.auth.login(this.loginForm.value as ILogin);
      if(!response){
        this.error.set('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
      }    
    } catch (error) {
      this.error.set('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  quickLogin(email: string, password: string) {
    this.loginForm.setValue({ email, password });
    this.onSubmit();


}

  
}
