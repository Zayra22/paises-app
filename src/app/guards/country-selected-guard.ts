import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CountryStateService } from '../services/country-state';

export const countrySelectedGuard: CanActivateFn = () => {
  const countryState = inject(CountryStateService);
  const router = inject(Router);

  if (countryState.paisSeleccionado()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
