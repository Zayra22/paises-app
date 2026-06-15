import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CountryStateService } from '../../services/country-state';

@Component({
  selector: 'app-country-detail',
  imports: [DecimalPipe],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.css'
})
export class CountryDetail {
  private countryState = inject(CountryStateService);
  private router = inject(Router);

  pais = computed(() => this.countryState.paisSeleccionado());

  regresar() {
    this.router.navigate(['/']);
  }

  verClima() {
    this.router.navigate(['/clima']);
  }
}
