import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Favorite {
  private apiUrl = 'https://weatheria-back.onrender.com/api'

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<any[]> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http.get<any[]>(`${this.apiUrl}/favorites`, { headers })
  }

  deleteFavorite(cityName: string):Observable<any[]> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http.delete<any[]>(`${this.apiUrl}/favorites/${cityName}`, { headers })
  }

  createFavorite(cityData: { cityName: string; lat: number, lon: number }):Observable<any[]> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http.post<any[]>(`${this.apiUrl}/favorites`,cityData, { headers })
  }
}
