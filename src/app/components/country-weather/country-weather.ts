import { Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CountryStateService } from '../../services/country-state';
import { CurrentWeather, WeatherService } from '../../services/weather';

@Component({
  selector: 'app-country-weather',
  imports: [],
  templateUrl: './country-weather.html',
  styleUrl: './country-weather.css'
})
export class CountryWeather implements OnInit {
  private countryState = inject(CountryStateService);
  private weatherService = inject(WeatherService);
  private router = inject(Router);

  pais = computed(() => this.countryState.paisSeleccionado());
  clima: CurrentWeather | null = null;
  cargando = false;
  mensajeError = '';

  ngOnInit() {
    const paisSeleccionado = this.pais();

    if (!paisSeleccionado) {
      return;
    }

    const lugar = paisSeleccionado.capital?.[0] || paisSeleccionado.name.common;
    this.cargando = true;
    this.mensajeError = '';

    this.weatherService.obtenerClima(lugar, paisSeleccionado.coordinates).pipe(
      finalize(() => {
        this.cargando = false;
      })
    ).subscribe({
      next: (clima) => {
        this.clima = clima;
      },
      error: () => {
        this.mensajeError = 'No se pudo obtener el clima.';
      }
    });
  }

  regresar() {
    this.router.navigate(['/']);
  }

  verDetalle() {
    this.router.navigate(['/detalle']);
  }
}
