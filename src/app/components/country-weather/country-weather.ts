import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  private changeDetector = inject(ChangeDetectorRef);

  pais = computed(() => this.countryState.paisSeleccionado());
  clima: CurrentWeather | null = null;
  cargando = false;
  mensajeError = '';

  ngOnInit() {
    const paisSeleccionado = this.pais();

    if (!paisSeleccionado) {
      return;
    }

    if (!paisSeleccionado.coordinates) {
      this.mensajeError = 'No hay coordenadas disponibles para consultar el clima.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const coordenadas = paisSeleccionado.coordinates;
    let climaCargado = false;

    const cargarConFetch = async () => {
      if (climaCargado) {
        return;
      }

      try {
        const clima = await this.weatherService.obtenerClimaConFetch(coordenadas);
        climaCargado = true;
        this.clima = clima;
        this.mensajeError = '';
      } catch {
        this.mensajeError = 'No se pudo obtener el clima.';
      } finally {
        this.cargando = false;
        this.changeDetector.detectChanges();
      }
    };

    const respaldo = window.setTimeout(() => {
      cargarConFetch();
    }, 3000);

    this.weatherService.obtenerClima(coordenadas).subscribe({
      next: (clima) => {
        if (climaCargado) {
          return;
        }

        window.clearTimeout(respaldo);
        climaCargado = true;
        this.clima = clima;
        this.cargando = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        window.clearTimeout(respaldo);
        cargarConFetch();
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
