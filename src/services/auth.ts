import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private router = inject(Router)

  private apiUrl = 'https://weatheria-back.onrender.com/api'

  constructor(private http: HttpClient) {}

  isLoggedIn = signal(this.hasValidToken())

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
    .pipe(
      tap(response => {
        localStorage.setItem('token', response.token)
        this.isLoggedIn.set(true)
      })
    )
  }
  logout() {
    localStorage.removeItem('token')
    this.isLoggedIn.set(false)
    this.router.navigate(['/login'])
  }
  getToken() {
    return localStorage.getItem('token')
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, userData)
  }

  private hasValidToken(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }
}
