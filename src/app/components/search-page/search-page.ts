import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { Country, CountryService } from '../../services/country';
import { CountryStateService } from '../../services/country-state';
import { CountryCard } from '../country-card/country-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CountryCard],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage implements OnDestroy {
  private router = inject(Router);
  private countryService = inject(CountryService);
  private countryState = inject(CountryStateService);
  private busquedaSubject = new Subject<string>();
  private busquedaSubscription: Subscription;

  nombrePais = '';
  pais = this.countryState.paisSeleccionado();
  recomendaciones: Country[] = [];
  cargando = false;
  mensajeError = '';

  constructor() {
    this.busquedaSubscription = this.busquedaSubject.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      switchMap((termino) => {
        const texto = termino.trim();

    if (!texto) {
      this.recomendaciones = [];
      this.mensajeError = '';
      return of([]);
    }

        this.cargando = true;
        this.mensajeError = '';

        return this.countryService.buscarPaises(texto).pipe(
          catchError((error: Error) => {
            this.mensajeError = error.message.includes('API key')
              ? 'Falta configurar la API key de REST Countries.'
              : 'No se pudo consultar la API de países.';
            return of([]);
          })
        );
      })
    ).subscribe((paises) => {
      this.cargando = false;
      this.recomendaciones = paises.slice(0, 8);

      if (this.nombrePais.trim() && paises.length === 0 && !this.mensajeError) {
        this.mensajeError = 'No se encontraron países con ese texto.';
      }
    });
  }

  ngOnDestroy() {
    this.busquedaSubscription.unsubscribe();
  }

  onBuscarTexto(valor: string) {
    this.nombrePais = valor;
    this.busquedaSubject.next(valor);
  }

  buscarPais() {
    const termino = this.nombrePais.trim();

    if (!termino) {
      return;
    }

    const paisExacto = this.recomendaciones.find((pais) =>
      pais.name.common.toLowerCase() === termino.toLowerCase()
    );

    if (paisExacto) {
      this.seleccionarPais(paisExacto);
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    this.countryService.buscarPais(termino).subscribe({
      next: (respuesta) => {
        this.cargando = false;

        if (!respuesta.length) {
          this.pais = null;
          this.mensajeError = 'País no encontrado.';
          return;
        }

        this.seleccionarPais(respuesta[0]);
      },
      error: (error: Error) => {
        this.cargando = false;
        this.pais = null;
        this.mensajeError = error.message.includes('API key')
          ? 'Falta configurar la API key de REST Countries.'
          : 'No se pudo consultar la API de países.';
      }
    });
  }

  seleccionarPais(pais: Country) {
    this.pais = pais;
    this.nombrePais = pais.name.common;
    this.recomendaciones = [];
    this.mensajeError = '';
    this.countryState.seleccionarPais(pais);
  }

  manejarAccion(accion: string) {
  if (accion === 'detalle') {
    this.router.navigate(['/detalle']);
  }

  if (accion === 'clima') {
    this.router.navigate(['/clima']);
  }
}
}
