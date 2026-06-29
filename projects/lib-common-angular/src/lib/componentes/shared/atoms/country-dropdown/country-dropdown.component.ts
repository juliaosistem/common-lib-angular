import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CountryListComponent, IConfig } from 'ngx-countries-dropdown';

/**
 * Wrapper reusable de lib-country-list.
 * Mantiene una API estable para usar el selector de país en múltiples formularios.
 * 
 * @example
 * <app-country-dropdown
 *   [selectedCountryCode]="'US'"
 *   [placeholderText]="'Buscar país o código'"
 *   (onCountryChange)="onCountrySelected($event)"
 * ></app-country-dropdown>
 */
@Component({
  selector: 'app-country-dropdown',
  standalone: true,
  imports: [CountryListComponent],
  templateUrl: './country-dropdown.component.html',
  styleUrl: './country-dropdown.component.scss',
})
export class CountryDropdownComponent {
  @Input() selectedCountryCode = '';
  @Input() placeholderText = 'Buscar pais o codigo';
  @Input() preferredCountryCodes: string[] = [];
  @Input() allowedCountryCodes: string[] = [];
  @Input() blockedCountryCodes: string[] = [];
  @Input() countryListConfig: IConfig = {
    hideSearch: false,
    hideCode: false,
    hideName: false,
    displayCurrencyCode: true,
    
  };

  @Output() onCountryChange = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  handleCountryChange(countryCode: string): void {
    this.onCountryChange.emit(countryCode);
    this.valueChange.emit(countryCode);
  }
}
