import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterUserDTO } from '@juliaosistem/core-dtos';
import { City, ICity } from 'country-state-city';
import { getCountryByCode, ICountry } from 'ngx-countries-dropdown';
import { CountryDropdownComponent } from '../../atoms/country-dropdown/country-dropdown.component';
import { CountryYmonedaUtilities } from '../../../../services/country-ymoneda.utilities';
import { PrimegModule } from '../../../../modulos/primeg.module';

export interface UserProfileDialogData {
  idbusiness: number | null;
  email: string;
  password: string;
  datesUserId: string;
  firstName: string;
  secondName: string;
  idUrl: string;
  estado: string;
  nombreRol: string;
  phoneNumber: string;
  phoneCityCode: number | null;
  phoneCountryCode: number | null;
  phoneNameCity: string;
  phoneNameCountry: string;
  address: string;
  city: string;
  department: string;
  country: string;
  postalCode: string;
}

export interface UserProfileUpdateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  country: string;
  postalCode: string;
}

export interface UserProfileSavePayload {
  profileData: UserProfileDialogData;
  registerUserDTO: RegisterUserDTO;
  updateProfileDTO: UserProfileUpdateDTO;
}

@Component({
  selector: 'lib-user-profile-dialog1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimegModule, CountryDropdownComponent],
  templateUrl: './user-profile-dialog1.component.html',
  styleUrl: './user-profile-dialog1.component.scss',
})
export class UserProfileDialog1Component implements OnChanges {
  @Input() visible = false;
  @Input() profileData: Partial<UserProfileDialogData> | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() profileSave = new EventEmitter<UserProfileSavePayload>();
  @Output() profileClose = new EventEmitter<void>();

  countryOptions: ICountry[] = [];
  cityOptions: { label: string; value: string }[] = [];
  selectedCountry: ICountry | null = null;
  selectedCountryCode = '';

  readonly profileForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.minLength(8)] }),
    datesUserId: new FormControl('', { nonNullable: true }),
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }),
    secondName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }),
    idUrl: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    estado: new FormControl('ACTIVO', { nonNullable: true, validators: [Validators.required] }),
    nombreRol: new FormControl('USUARIO', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[+]?[0-9\s()-]{7,20}$/)] }),
    phoneCityCode: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    phoneCountryCode: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    phoneNameCity: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    phoneNameCountry: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    department: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    country: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    postalCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Za-z0-9\s-]{4,10}$/)],
    }),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profileData']) {
      this.patchForm();
    }

    if (changes['visible'] && this.visible) {
      this.syncCountrySelection();
    }
  }

  openDialog(): void {
    this.visible = true;
    this.visibleChange.emit(true);
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onDialogHide(): void {
    this.profileClose.emit();
    this.closeDialog();
  }

  onClose(): void {
    this.profileClose.emit();
    this.closeDialog();
  }

  onCountrySelected(countryCode: string): void {
    const selectedFromCatalog = getCountryByCode(countryCode?.toUpperCase());
    this.selectedCountry = selectedFromCatalog ?? null;
    this.handleSelection(countryCode, selectedFromCatalog);
  }

  handleSelection(countryCode: string, selectedFromCatalog?: ICountry): void {
    const selectedCountry = selectedFromCatalog ?? this.findCountryByCode(countryCode) ?? this.findCountryByName(countryCode);
    const countryName = CountryYmonedaUtilities.resolveCountryName(selectedCountry);
    const resolvedCode = CountryYmonedaUtilities.resolveCountryCode(selectedCountry ?? countryCode);
    const callingCode = CountryYmonedaUtilities.resolveCallingCode(selectedCountry);
    
    this.selectedCountry = selectedCountry;
    this.selectedCountryCode = resolvedCode;
    this.updateCityOptions(resolvedCode);
    this.profileForm.patchValue({
      country: countryName,
      city: '',
      phoneNameCountry: countryName,
      phoneNameCity: '',
      phoneCountryCode: callingCode,
    });
  }
  onCitySelected(city: string): void {
    this.profileForm.patchValue({
      city,
      phoneNameCity: city,
    });
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const profileData = this.toProfileData();
    const registerUserDTO = this.toRegisterUserDTO(profileData);
    const updateProfileDTO = this.toUpdateProfileDTO(profileData);
    this.profileSave.emit({ profileData, registerUserDTO, updateProfileDTO });
    this.closeDialog();
  }

  showError(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: string, label: string): string {
    const errors = this.profileForm.get(controlName)?.errors;
    if (!errors) return '';
    if (errors['required']) return `${label} es obligatorio.`;
    if (errors['email']) return 'Ingresa un email valido.';
    if (errors['minlength']) return `${label} no cumple la longitud minima.`;
    if (errors['maxlength']) return `${label} supera la longitud permitida.`;
    if (errors['pattern']) return `${label} tiene un formato invalido.`;
    if (errors['min']) return `${label} debe ser mayor a 0.`;
    return `El campo ${label} es invalido.`;
  }

  private patchForm(): void {
    this.profileForm.patchValue(this.buildFormPatchValue());
    this.syncCountrySelection();
    this.resetFormState();
  }

  private buildFormPatchValue() {
    return {
      ...this.buildAccountPatchValue(),
      ...this.buildPersonalPatchValue(),
      ...this.buildPhonePatchValue(),
      ...this.buildAddressPatchValue(),
    };
  }

  private buildAccountPatchValue() {
    return {
      email: this.profileData?.email ?? '',
      password: this.profileData?.password ?? '',
      datesUserId: this.profileData?.datesUserId ?? '',
    };
  }

  private buildPersonalPatchValue() {
    return {
      firstName: this.profileData?.firstName ?? '',
      secondName: this.profileData?.secondName ?? '',
      idUrl: this.profileData?.idUrl ?? '',
      estado: this.profileData?.estado ?? 'ACTIVO',
      nombreRol: this.profileData?.nombreRol ?? 'USUARIO',
    };
  }

  private buildPhonePatchValue() {
    return {
      phoneNumber: this.profileData?.phoneNumber ?? '',
      phoneCityCode: this.profileData?.phoneCityCode ?? null,
      phoneCountryCode: this.profileData?.phoneCountryCode ?? null,
      phoneNameCity: this.profileData?.phoneNameCity ?? '',
      phoneNameCountry: this.profileData?.phoneNameCountry ?? '',
    };
  }

  private buildAddressPatchValue() {
    return {
      address: this.profileData?.address ?? '',
      city: this.profileData?.city ?? '',
      department: this.profileData?.department ?? '',
      country: this.profileData?.country ?? '',
      postalCode: this.profileData?.postalCode ?? '',
    };
  }

  private updateCityOptions(countryCode: string): void {
    const normalizedCountryCode = CountryYmonedaUtilities.resolveCountryCode(countryCode).toUpperCase();
    if (!normalizedCountryCode) {
      this.cityOptions = [];
      this.profileForm.controls.city.clearValidators();
      this.profileForm.controls.city.setValue('');
      this.profileForm.controls.city.updateValueAndValidity({ emitEvent: false });
      return;
    }

    const cities = City.getCitiesOfCountry(normalizedCountryCode) ?? [];
    this.cityOptions = cities.map((city: ICity) => ({
      label: city.name,
      value: city.name,
    }));
    this.profileForm.controls.city.setValidators([Validators.required, Validators.minLength(2)]);
    this.profileForm.controls.city.updateValueAndValidity({ emitEvent: false });
  }

  private syncCountrySelection(): void {
    const currentCountry = String(this.profileData?.country ?? this.profileForm.getRawValue().country ?? '').trim();
    const matchedCountry = this.findCountryByName(currentCountry) ?? this.findCountryByCode(currentCountry);
    this.selectedCountry = matchedCountry;
    this.selectedCountryCode = CountryYmonedaUtilities.resolveCountryCode(matchedCountry ?? currentCountry);
    this.updateCityOptions(this.selectedCountryCode);

    const currentCity = String(this.profileData?.city ?? this.profileForm.getRawValue().city ?? '').trim();
    if (currentCity && this.cityOptions.some((city) => city.value.toLowerCase() === currentCity.toLowerCase())) {
      this.profileForm.patchValue({ city: currentCity });
      this.profileForm.controls.city.markAsPristine();
    }
  }

  private findCountryByCode(countryCode: string): ICountry | null {
    return CountryYmonedaUtilities.findCountryByCode(countryCode);
  }

  private findCountryByName(countryName: string): ICountry | null {
    return CountryYmonedaUtilities.findCountryByName(countryName);
  }



  private resetFormState(): void {
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
  }

  private toProfileData(): UserProfileDialogData {
    const raw = this.profileForm.getRawValue();
    return {
      idbusiness: this.profileData?.idbusiness ?? null,
      ...this.mapAccountFromRaw(raw),
      ...this.mapPersonalFromRaw(raw),
      ...this.mapPhoneFromRaw(raw),
      ...this.mapAddressFromRaw(raw),
    };
  }

  private mapAccountFromRaw(raw: ReturnType<typeof this.profileForm.getRawValue>) {
    return {
      email: raw.email,
      password: raw.password,
      datesUserId: raw.datesUserId,
    };
  }

  private mapPersonalFromRaw(raw: ReturnType<typeof this.profileForm.getRawValue>) {
    return {
      firstName: raw.firstName,
      secondName: raw.secondName,
      idUrl: raw.idUrl,
      estado: raw.estado,
      nombreRol: raw.nombreRol,
    };
  }

  private mapPhoneFromRaw(raw: ReturnType<typeof this.profileForm.getRawValue>) {
    return {
      phoneNumber: raw.phoneNumber,
      phoneCityCode: raw.phoneCityCode,
      phoneCountryCode: raw.phoneCountryCode,
      phoneNameCity: raw.phoneNameCity,
      phoneNameCountry: raw.phoneNameCountry,
    };
  }

  private mapAddressFromRaw(raw: ReturnType<typeof this.profileForm.getRawValue>) {
    return {
      address: raw.address,
      city: raw.city,
      department: raw.department,
      country: raw.country,
      postalCode: raw.postalCode,
    };
  }

  private toUpdateProfileDTO(data: UserProfileDialogData): UserProfileUpdateDTO {
    return {
      firstName: data.firstName,
      lastName: data.secondName,
      email: data.email,
      phone: data.phoneNumber,
      address: data.address,
      city: data.city,
      department: data.department,
      country: data.country,
      postalCode: data.postalCode,
    };
  }

  private toRegisterUserDTO(data: UserProfileDialogData): RegisterUserDTO {
    return {
      idbusiness: data.idbusiness ?? undefined,
      email: data.email,
      password: data.password || undefined,
      DatesUser: this.toDatesUserDTO(data),
    };
  }

  private toDatesUserDTO(data: UserProfileDialogData) {
    return {
      id: data.datesUserId || '',
      firstName: data.firstName,
      secondName: data.secondName,
      idUrl: data.idUrl,
      estado: data.estado,
      nombreRol: data.nombreRol,
      phone: [this.toPhoneDTO(data)],
      addresses: [this.toAddressDTO(data)],
    };
  }

  private toPhoneDTO(data: UserProfileDialogData) {
    return {
      number: data.phoneNumber,
      cityCode: data.phoneCityCode ?? undefined,
      countryCode: data.phoneCountryCode ?? undefined,
      nameCity: data.phoneNameCity,
      nameCountry: data.phoneNameCountry,
    };
  }

  private toAddressDTO(data: UserProfileDialogData) {
    return {
      adress: data.address,
      country: {
        name: data.country,
        cities: [{ name: data.city }],
      },
    };
  }
}
