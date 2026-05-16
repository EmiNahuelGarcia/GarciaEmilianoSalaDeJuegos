import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRegister } from '../../models/registro-interface';
import { SpinnerComponent } from '../../shared/spinner/spinnerComponent';


@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  auth = inject(AuthService);
  error = signal('');
  loading = signal(false);
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]*$'), Validators.minLength(3), Validators.maxLength(15)]),
    surname: new FormControl('', [Validators.minLength(3), Validators.maxLength(15), Validators.pattern('^[a-zA-Z]*$'), Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail\\.com|hotmail\\.com|outlook\\.com)$')
    ]),
    age: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(18), Validators.max(99)]),
    password: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(8), Validators.maxLength(20)])
  });

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.error.set('Por favor, complete todos los campos correctamente.');
      return;
    }

    this.loading.set(true);

    try {
      const response = await this.auth.register(this.registerForm.value as IRegister);

      if (!response.ok) {
        this.error.set(response.message || 'No se pudo registrar el usuario.' );
      }
    } finally {
      this.loading.set(false);
    }
  }

  get name() {
    return this.registerForm.get('name');
  }

  get surname() {
    return this.registerForm.get('surname');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get age() {
    return this.registerForm.get('age');
  }

  get password() {
    return this.registerForm.get('password');
  }
}
