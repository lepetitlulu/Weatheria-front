import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataMeteo } from '../../services/data-meteo';


@Component({
  selector: 'app-weekly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weekly.html',
  styleUrl: './weekly.css'
})
export class Weekly implements OnChanges {
  @Input() lat!: any
  @Input() lon!: any

  datas: any[] = []
  loading = false
  error = ''
  groupedData: { [day: string]: any[] } = {}

  constructor(private api: DataMeteo) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['lat'] || changes['lon']) && this.lat && this.lon) {
      this.getWeekly(this.lat, this.lon)
    }
  }

  getWeekly(lat: number, lon: number) {
    this.loading = true
    this.api.getWeeklyWeather(lat, lon).subscribe({
      next: (res) => {
        this.datas = res.list ?? []

        this.groupedData = this.datas.reduce((acc: any, entry: any) => {
          const dayLabel = this.formatDate(entry.dt)
          if (!acc[dayLabel]) acc[dayLabel] = []
          acc[dayLabel].push(entry)
          return acc
        }, {})
        
        this.loading = false
        console.log('Prévision 5 jours regroupées :', this.groupedData)
      },
      error: (err) => {
        console.error(err)
        this.error = 'Impossible de charger la météo.'
        this.loading = false
      }
    })
  }

  formatDate(unix: number): string {
    return new Date(unix * 1000).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    })
  }

  formatHour(unix: number): string {
    return new Date(unix * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  get dayKeys(): string[] {
    return Object.keys(this.groupedData)
  }

  getWindSpeedKmH(speed: number): number {
    return Math.round(speed * 3.6)
  }
}
