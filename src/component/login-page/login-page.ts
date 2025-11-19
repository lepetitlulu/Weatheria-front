import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  standalone: true
})
export class LoginPage {
  email: string = ''
  password: string = ''
  errorMessage: string = ''


  constructor(private auth: Auth, private router: Router) {}

  onLogin() {
    this.errorMessage = ''
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Connexion réussie, token reçu')
        this.router.navigate(['/main'])
      },
      error: (err) => {
        console.error('Erreur de login:', err)
        this.errorMessage = 'Email ou mot de passe incorrect.'
      }
    })
  }

  goToSignup() {
    this.router.navigate(['/sign'])
  }
}
