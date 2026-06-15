import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, throwError, timeout } from 'rxjs';

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface GeocodingResponse {
  results?: Array<{
    latitude: number;
    longitude: number;
  }>;
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

  obtenerClima(nombreLugar: string, coordenadasRespaldo?: Coordinates) {
    if (coordenadasRespaldo) {
      return this.consultarPorCoordenadas(coordenadasRespaldo.lat, coordenadasRespaldo.lng);
    }

    const lugarBuscado = encodeURIComponent(nombreLugar);

    return this.http.get<GeocodingResponse>(
      `/openmeteo-geocoding/v1/search?name=${lugarBuscado}&count=1&language=es&format=json`
    ).pipe(
      timeout(10000),
      switchMap((geoRespuesta) => {
        const lugar = geoRespuesta.results?.[0];

        if (!lugar) {
          return throwError(() => new Error('No se encontraron coordenadas.'));
        }

        return this.consultarPorCoordenadas(lugar.latitude, lugar.longitude);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  private consultarPorCoordenadas(latitude: number, longitude: number) {
    return this.http.get<WeatherResponse>(
      `/openmeteo-forecast/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m`
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
}
