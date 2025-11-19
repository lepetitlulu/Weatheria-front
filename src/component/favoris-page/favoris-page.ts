import { Component, OnInit } from '@angular/core';
import { Favorite } from '../../services/favorite';
import { Header } from '../header/header';
import { DataMeteo } from '../../services/data-meteo'

@Component({
  selector: 'app-favoris-page',
  imports: [Header],
  templateUrl: './favoris-page.html',
  styleUrl: './favoris-page.css'
})
export class FavorisPage implements OnInit {
 favorites: any[] = []
 loading = true
 error = ''

 constructor(private favoriteService: Favorite, private meteoService: DataMeteo) {}

 ngOnInit() {
  this.loadFavorites()
 }

 loadFavorites() {
  this.favoriteService.getFavorites().subscribe({
    next: (data) => {
      this.favorites = data.map((fav) => ({
        ...fav,
        meteo: null
      }))
      
      this.favorites.forEach((fav) => {
        this.meteoService.getWeather(fav.lat, fav.lon).subscribe({
          next: (weather) => {
            fav.meteo = weather
          },
          error: (err) => console.error(`Erreur météo pour ${fav.cityName}`, err)
        })
      })
      this.loading = false
    },
    error: (err) => {
      console.error('Erreur de récupération des favoris', err)
      this.error = 'Impossible de charger vos favoris'
      this.loading = false
    }
  })
 }

 removeFavorite(cityName: string) {
  this.favoriteService.deleteFavorite(cityName).subscribe({
    next: (updatedFavorites) => {
      this.favorites = updatedFavorites
    },
    error: (err) => {
      console.error('Erreur de suppression du favori', err)
    }
  })
 }
} 
