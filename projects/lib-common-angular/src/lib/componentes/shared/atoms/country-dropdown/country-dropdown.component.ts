import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CountryListComponent, IConfig } from 'ngx-countries-dropdown';
import { CountryYmonedaUtilities } from '../../../../services/country-ymoneda.utilities';

/**
 * Wrapper reusable de lib-country-list con filtrado dinámico.
 * Implementa búsqueda en vivo por nombre, código y dial code.
 * Reusable en múltiples formularios.
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
export class CountryDropdownComponent implements OnInit {
  @Input() selectedCountryCode = '';
  @Input() placeholderText = 'Buscar pais o codigo';
  @Input() preferredCountryCodes: string[] = [];
  @Input() blockedCountryCodes: string[] = [];
  @Input() countryListConfig: IConfig = {
    hideSearch: false,
    hideCode: false,
    hideName: false,
  };

  @Output() onCountryChange = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  allowedCountryCodes: string[] = [];

  ngOnInit(): void {
    this.allowedCountryCodes = [];
  }

  onCountrySearchKeyup(event: KeyboardEvent): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.classList.contains('ipv_search_box')) return;
    this.applyCountryFilter(input.value);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  handleCountryChange(countryCode: string): void {
    this.allowedCountryCodes = [];
    this.onCountryChange.emit(countryCode);
    this.valueChange.emit(countryCode);
  }

  private applyCountryFilter(rawQuery: string): void {
    const query = CountryYmonedaUtilities.normalizeSearchText(rawQuery);
    if (!query) {
      this.allowedCountryCodes = [];
      return;
    }

    this.allowedCountryCodes = CountryYmonedaUtilities.filterCountriesByQuery(query);
  }

  private normalizeSearchText(value: string): string {
    return CountryYmonedaUtilities.normalizeSearchText(value);
  }
}
