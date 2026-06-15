import { Injectable, signal } from '@angular/core';
import { Country } from './country';

@Injectable({
  providedIn: 'root'
})
export class CountryStateService {
  readonly paisSeleccionado = signal<Country | null>(null);

  seleccionarPais(pais: Country) {
    this.paisSeleccionado.set(pais);
  }
}
