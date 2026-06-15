import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather';

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(WeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
