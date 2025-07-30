import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string | null = null; // Gérer les erreurs
  showPassword: boolean = false;

  constructor(private authServie : AuthService, private fb:FormBuilder, private router: Router){

    this.registerForm = this.fb.group({
      username:['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

  }

  togglePasswordVisibility():void{
    this.showPassword = !this.showPassword;
  }

  onSubmit(){

    if(this.registerForm.valid){
           const formValue = this.registerForm.value;

      this.authServie.register(formValue)
      .subscribe({
        next:(value)=> {

          this.router.navigate(['/login'])
        },
         error: err => {
          console.error('Register failed', err);
          this.errorMessage = "Email ou mot de passe incorrect"; // Afficher un message d'erreur
        }
      })
    }
    
  }

}
