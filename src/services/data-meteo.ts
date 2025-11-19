import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataMeteo {
  private backendUrl = 'http://localhost:3000/api'

  constructor(private http: HttpClient) {}

  getCoordinates(city: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/coordinates?city=${encodeURIComponent(city)}`)
  }

  getWeather(lat: number,lon: number): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/weather?lat=${lat}&lon=${lon}`)
  }
  
  getWeeklyWeather(lat: number, lon: number): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/weekly?lat=${lat}&lon=${lon}`)
  }
}
