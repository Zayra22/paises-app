import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from '../../services/country';

@Component({
  selector: 'app-country-card',
  imports: [],
  templateUrl: './country-card.html',
  styleUrl: './country-card.css',
})
export class CountryCard {
  private router = inject(Router);

  @Input({ required: true }) pais!: Country;

  verDetalle() {
    this.router.navigate(['/detalle']);
  }

  verClima() {
    this.router.navigate(['/clima']);
  }
}
