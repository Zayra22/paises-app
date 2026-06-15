import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { countrySelectedGuard } from './country-selected-guard';

describe('countrySelectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => countrySelectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
