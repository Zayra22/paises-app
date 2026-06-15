import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from '../../services/country';



@Component({
  selector: 'app-country-card',
  imports: [],
  templateUrl: './country-card.html',
  styleUrl: './country-card.css'
})
export class CountryCard {

  @Input({ required: true }) pais!: Country;

  @Output() accionSeleccionada = new EventEmitter<string>();

  verDetalle() {
    this.accionSeleccionada.emit('detalle');
  }

  verClima() {
    this.accionSeleccionada.emit('clima');
  }
}
