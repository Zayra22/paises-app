import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Country } from '../../services/country';
import { CountryCard } from './country-card';

describe('CountryCard', () => {
  let component: CountryCard;
  let fixture: ComponentFixture<CountryCard>;

  const pais: Country = {
    name: {
      common: 'Honduras',
      official: 'Republic of Honduras'
    },
    searchNames: ['Honduras', 'Republic of Honduras'],
    capital: ['Tegucigalpa'],
    region: 'Americas',
    subregion: 'Central America',
    population: 9904608,
    area: 112492,
    flags: {
      png: 'https://flagcdn.com/w320/hn.png',
      svg: 'https://flagcdn.com/hn.svg'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryCard],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CountryCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pais', pais);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
