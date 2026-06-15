import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, shareReplay, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Country {
  name: {
    common: string;
    official: string;
  };
  searchNames: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

interface RestCountriesV5Response {
  data?: {
    objects?: RestCountryV5[];
  };
  success?: boolean;
  errors?: Array<{ message: string }>;
}

interface RestCountryV5 {
  names?: {
    common?: string;
    official?: string;
    translations?: {
      spa?: {
        common?: string;
        official?: string;
      };
    };
  };
  capitals?: Array<{
    name?: string;
  }>;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  flag?: {
    description?: string;
    url_png?: string;
    url_svg?: string;
  };
  region?: string;
  subregion?: string;
  area?: {
    kilometers?: number;
  };
  population?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/restcountries-api/countries/v5';
  private paisesCache$?: Observable<Country[]>;

  buscarPaises(nombre: string): Observable<Country[]> {
    const texto = this.normalizar(nombre);

    if (!texto) {
      return throwError(() => new Error('Debes escribir un país.'));
    }

    return this.obtenerTodosLosPaises().pipe(
      map((paises) => paises
        .filter((pais) => pais.searchNames.some((nombreBuscable) =>
          this.normalizar(nombreBuscable).startsWith(texto)
        ))
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
      )
    );
  }

  buscarPais(nombre: string): Observable<Country[]> {
    return this.buscarPaises(nombre);
  }

  private obtenerTodosLosPaises(): Observable<Country[]> {
    if (!environment.restCountriesApiKey) {
      return throwError(() => new Error('Falta configurar la API key de REST Countries.'));
    }

    const apiKey = encodeURIComponent(environment.restCountriesApiKey);
    const pagina = (offset: number) => this.http.get<RestCountriesV5Response>(
      `${this.apiUrl}?limit=100&offset=${offset}&api-key=${apiKey}`
    );

    this.paisesCache$ ??= forkJoin([
      pagina(0),
      pagina(100),
      pagina(200)
    ]).pipe(
      map((respuestas) => {
        const objetos = respuestas.flatMap((respuesta) => respuesta.data?.objects ?? []);

        if (!objetos.length) {
          const mensaje = respuestas[0].errors?.[0]?.message || 'REST Countries no devolvió países.';
          throw new Error(mensaje);
        }

        return objetos.map((pais) => this.mapearPais(pais));
      }),
      shareReplay(1)
    );

    return this.paisesCache$;
  }

  private mapearPais(pais: RestCountryV5): Country {
    const nombreComun = pais.names?.common ?? 'Sin nombre';
    const nombreOficial = pais.names?.official ?? nombreComun;
    const nombreComunEspanol = pais.names?.translations?.spa?.common;
    const nombreOficialEspanol = pais.names?.translations?.spa?.official;
    const searchNames = [
      nombreComun,
      nombreOficial,
      nombreComunEspanol,
      nombreOficialEspanol
    ].filter((nombre): nombre is string => Boolean(nombre));

    return {
      name: {
        common: nombreComun,
        official: nombreOficial
      },
      searchNames,
      coordinates: this.mapearCoordenadas(pais),
      capital: pais.capitals?.map((capital) => capital.name ?? '').filter(Boolean),
      region: pais.region ?? 'No disponible',
      subregion: pais.subregion ?? 'No disponible',
      population: pais.population ?? 0,
      area: pais.area?.kilometers ?? 0,
      flags: {
        png: pais.flag?.url_png ?? '',
        svg: pais.flag?.url_svg ?? '',
        alt: pais.flag?.description ?? nombreComun
      }
    };
  }

  private mapearCoordenadas(pais: RestCountryV5) {
    if (typeof pais.coordinates?.lat !== 'number' || typeof pais.coordinates?.lng !== 'number') {
      return undefined;
    }

    return {
      lat: pais.coordinates.lat,
      lng: pais.coordinates.lng
    };
  }

  private normalizar(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
