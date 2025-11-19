import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css'
})
export class SignupPage {
  signupForm: FormGroup
  message: string = ''
  serverError: string = ''


  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(4)]],
      consent: [false,Validators.requiredTrue]
    })
  }

  get f() {
    return this.signupForm.controls
  }


  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (res) => {
          this.message = "Compte créé avec succès !"
          console.log('Compte crée avec succès !')
          this.router.navigate(['/login'])
        },
        error: (err) => {
          if (err.status === 409) {
            this.serverError = "Adresse email déjà utilisée"
          } else if (err.status === 400) {
            this.serverError = "Mot de passe incorrect"
          } else {
            this.serverError = "Erreur lors de la création du compte"
          }
          console.error(err)
        }
      })
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
