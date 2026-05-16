import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';



@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  //placeholder para injectar el service de auth de sprint 2
  error = signal('');
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
    //placeholder para el submit del registro del sprint 2
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
