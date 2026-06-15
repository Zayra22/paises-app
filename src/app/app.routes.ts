import { Routes } from '@angular/router';
import { countrySelectedGuard } from './guards/country-selected-guard';
import { SearchPage } from './components/search-page/search-page';
import { CountryDetail } from './components/country-detail/country-detail';
import { CountryWeather } from './components/country-weather/country-weather';

export const routes: Routes = [
  {
    path: '',
    component: SearchPage
  },
  {
    path: 'detalle',
    component: CountryDetail,
    canActivate: [countrySelectedGuard]
  },
  {
    path: 'clima',
    component: CountryWeather,
    canActivate: [countrySelectedGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
