import { Component } from '@angular/core';
import { Header } from "../header/header";
import { DataMeteo } from '../../services/data-meteo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Weekly } from '../weekly/weekly';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Subject } from 'rxjs'
import { Favorite } from '../../services/favorite';
import { SettingPage } from "../setting-page/setting-page";

@Component({
  selector: 'app-main-page',
  imports: [Header, CommonModule, FormsModule, Weekly, SettingPage],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {
  datas: any[] = [];
  weather: any[] = [];
  cityName: string = '';
  lat?: number
  lon?: number

  suggestions: any[] = []
  private searchSubject = new Subject<string>()

  constructor(private api: DataMeteo, private favoriteService: Favorite) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => this.api.getCoordinates(query))
    ).subscribe({
      next: (res) => {
        this.suggestions = res
      },
      error: () => this.suggestions = []
    })
  }

  onInputChange(query: string) {
    if (query.length > 2) {
      this.searchSubject.next(query)
    } else {
      this.suggestions = []
    }
  }

  selectSuggestion(city: any) {
    this.cityName = city.name
    this.lat = city.lat
    this.lon = city.lon
    this.suggestions = []
    this.searchCity()
  }

  searchCity() {
    console.log('Recherche ville :', this.cityName);
    if (!this.cityName.trim()) return;

    this.datas = [];
    this.weather = [];

    this.api.getCoordinates(this.cityName).subscribe({
      next: (coords) => {
        console.log('Réponse coords :', coords);
        if (coords.length > 0) {
          const { lat, lon } = coords[0];
          console.log('Lat/Lon trouvés :', lat, lon);

          this.lat = lat
          this.lon = lon

          this.api.getWeather(lat, lon).subscribe({
            next: (meteo) => {
              console.log('Réponse meteo:', meteo);
              this.datas = [meteo];
              this.weather = meteo.weather;
            },
            error: (err) => console.error('Erreur météo', err)
          });
        } else {
          console.error('Ville non trouvée');
        }
      },
      error: (err) => console.error('Erreur géocodage', err)
    });
  }

  addToFavorites(data: any) {
    const cityData = {
      cityName: data.name,
      lat: data.coord.lat,
      lon: data.coord.lon
    }
    this.favoriteService.createFavorite(cityData).subscribe({
      next: (favorites) => {
        console.log('Favoris ajouté !', favorites)
        alert(`${data.name} a été ajouter à vos favoris`)
      },
      error: (err) => {
        console.error('Erreur ajout de favoris', err)
        alert(`Impossible d'ajouter ${data.name}`)
      }
    })
  }

  /**
   * Convertit les degrés en une direction de vent (Nord, Est, Sud, Ouest...)
   */
  getWindDirection(deg: number): string {
    const directions = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  }

  /**
   * Convertit la vitesse du vent de m/s en km/h
   */
  getWindSpeedKmH(speed: number): number {
    return Math.round(speed * 3.6);
  }
}
