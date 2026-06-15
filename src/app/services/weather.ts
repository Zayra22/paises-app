import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, timeout } from 'rxjs';

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface WeatherResponse {
  current?: {
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);

  obtenerClima(coordenadas: Coordinates) {
    return this.http.get<WeatherResponse>(
      `/openmeteo-forecast/v1/forecast?latitude=${coordenadas.lat}&longitude=${coordenadas.lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m`
    ).pipe(
      timeout(10000),
      map((respuesta) => {
        if (!respuesta.current) {
          throw new Error('Open-Meteo no devolvió clima actual.');
        }

        return {
          temperature: respuesta.current.temperature_2m,
          windspeed: respuesta.current.wind_speed_10m,
          winddirection: respuesta.current.wind_direction_10m
        };
      })
    );
  }

  async obtenerClimaConFetch(coordenadas: Coordinates): Promise<CurrentWeather> {
    const respuesta = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coordenadas.lat}&longitude=${coordenadas.lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m`
    );

    if (!respuesta.ok) {
      throw new Error('Open-Meteo no respondió correctamente.');
    }

    const datos = await respuesta.json() as WeatherResponse;

    if (!datos.current) {
      throw new Error('Open-Meteo no devolvió clima actual.');
    }

    return {
      temperature: datos.current.temperature_2m,
      windspeed: datos.current.wind_speed_10m,
      winddirection: datos.current.wind_direction_10m
    };
  }
}
