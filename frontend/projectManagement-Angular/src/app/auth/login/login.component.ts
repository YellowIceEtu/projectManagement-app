import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup; //formulaire réactif qui contient les champs du formulaire
  errorMessage: string | null = null; // Gérer les erreurs
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    //définit un formulaire de connexion avec 2 champs (email et password) qui ont une valeur initiale vide et qui ont des règles de validations
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.authService.getToken()) {
      console.log('auhuidauda, ', this.authService.getToken());
      this.router.navigate(['/login']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  //fonction qui soumet le formulaire de connexion
  onSubmit() {
    //vérifie que le formulaire est valide avant de faire la suite
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: () => {
            console.log('Login réussi');
            this.router.navigate(['/projects']); // Redirection après succès
          },
          error: (err) => {
            if (err.status == 401) {
              console.error('Login failed', err);
              this.errorMessage = 'Email ou mot de passe incorrect'; // Afficher un message d'erreur
            } else {
              this.errorMessage = 'Erreur ';
            }
            setTimeout(() => {
              this.errorMessage = '';
            }, 5000);
          },
        });
    }
  }
}
