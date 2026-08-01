import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { DynamicField } from '../../interfaces/dynamic-field.interface';
import { ComponentesDTO } from '@juliaosistem/core-dtos';
import { CrudFeedbackToast1Component } from '../crud-feedback-toast1/crud-feedback-toast1.component';

type ImagePreviewItem = {
  url: string;
  alt: string;
  source: 'persisted' | 'selected';
  fingerprint: string;
};

@Component({
  selector: 'lib-crud-dialog1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimegModule],
  templateUrl: './crud-dialog1.component.html',
  styleUrl: './crud-dialog1.component.scss',
})
export class CrudDialog1Component implements OnChanges, AfterViewInit {
  /**
   * Metodo placeholder heredado de integraciones previas.
   * @throws Error Siempre, porque no esta implementado en este componente.
   */
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  //propiedad para saber si se muestra el dialogo o no
  @Input() visible: boolean = false;
  @Input() displayFields: DynamicField[] = [];
  @Input() currentItem: Record<string, unknown> = {};
  @Input() fieldSelectOptions: Record<string, { label: string; value: string | number | boolean }[]> = {};
  @Input() isDefaultContent: boolean = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() body: TemplateRef<any> | undefined;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Record<string, unknown>>();
  @Output() cancel = new EventEmitter<void>();
  @Output() triggerSave = new EventEmitter<void>(); // Nuevo evento para templates personalizados

  itemForm: FormGroup;
  private readonly maxImageSize = 5 * 1024 * 1024;

  componente: ComponentesDTO = {
    id: 18,
    nombreComponente: 'lib-crud-dialog1',
    version: '1.0',
  };

  /**
   * Archivos seleccionados
   */
  selectedFiles: Record<string, File[]> = {};
  private feedbackToastRef?: ComponentRef<CrudFeedbackToast1Component>;

  @ViewChild('toastHost', { read: ViewContainerRef })
  private toastHost?: ViewContainerRef;

  /**
   * Inicializa el formulario reactivo vacio para su construccion dinamica posterior.
   * @param fb FormBuilder usado para crear controles reactivos.
   */
  constructor(private fb: FormBuilder) {
    this.itemForm = this.fb.group({});
  }

  /**
   * Reacciona a cambios de inputs para sincronizar el formulario con el item actual.
   * @param changes Cambios detectados por Angular en los @Input del componente.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentItem'] && this.currentItem) {
      this.updateForm();
    }
  }

  /**
   * Inicializa el contenedor de toasts cuando la vista ya esta disponible.
   */
  ngAfterViewInit(): void {
    if (this.toastHost && !this.feedbackToastRef) {
      this.feedbackToastRef = this.toastHost.createComponent(CrudFeedbackToast1Component);
    }
  }

  /**
   * Reconstruye los controles dinamicos del formulario con valores iniciales y validadores.
   */
  private updateForm() {
    const formControls: Record<string, unknown> = {};

    this.displayFields.forEach((field) => {
      const initialValue = this.getInitialValue(field);
      const currentValue = this.currentItem[field.key] ?? initialValue;
      const validators = this.buildValidators(field);

      formControls[field.key] = [currentValue, validators];
    });

    this.itemForm = this.fb.group(formControls);
  }

  /**
   * Construye la lista de validadores para un campo dinamico.
   * @param field Configuracion del campo.
   * @returns Arreglo de validadores de Angular Forms.
   */
  private buildValidators(field: DynamicField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.required) {
      validators.push(Validators.required);
    }

    const min = this.resolveNumericMin(field);
    if (min !== null) {
      validators.push(Validators.min(min));
    }

    return validators;
  }

  /**
   * Resuelve el valor minimo para campos numericos segun configuracion y reglas por llave.
   * @param field Configuracion del campo.
   * @returns Minimo numerico o null cuando no aplica.
   */
  private resolveNumericMin(field: DynamicField): number | null {
    if (field.type !== 'number') {
      return null;
    }

    const customMin = Number((field as { min?: unknown }).min);
    if (Number.isFinite(customMin)) {
      return customMin;
    }

    if (field.key === 'precio') {
      return 0.01;
    }

    if (field.key === 'cantidad') {
      return 0;
    }

    return null;
  }

  /**
   * Obtiene el modo de visualizacion del campo numerico.
   * @param field Configuracion del campo dinamico.
   * @returns Modo decimal o currency para p-inputNumber.
   */
  getNumberMode(field: DynamicField): 'decimal' | 'currency' {
    const configMode = (field as { mode?: unknown }).mode;
    if (configMode === 'currency') {
      return this.getNumberCurrency(field) ? 'currency' : 'decimal';
    }

    const currencyControl = this.getCurrencyControlKey(field);
    if (!currencyControl) {
      return 'decimal';
    }

    return this.getNumberCurrency(field) ? 'currency' : 'decimal';
  }

  /**
   * Resuelve la moneda a mostrar desde la configuracion o desde otro control del formulario.
   * @param field Configuracion del campo dinamico.
   * @returns Codigo ISO de moneda o undefined cuando no aplica.
   */
  getNumberCurrency(field: DynamicField): string | undefined {
    const staticCurrency = String((field as { currency?: unknown }).currency ?? '').trim().toUpperCase();
    if (staticCurrency) {
      return staticCurrency;
    }

    const currencyControl = this.getCurrencyControlKey(field);
    if (!currencyControl) {
      return this.resolveCurrencyFallback(field);
    }

    const currencyValue = this.itemForm.get(currencyControl)?.value;
    const normalized = String(currencyValue ?? '').trim().toUpperCase();
    if (normalized) {
      return normalized;
    }

    return this.resolveCurrencyFallback(field);
  }

  /**
   * Obtiene el locale para formato numerico/currency.
   * @param field Configuracion del campo dinamico.
   * @returns Locale para p-inputNumber.
   */
  getNumberLocale(field: DynamicField): string {
    const locale = String((field as { locale?: unknown }).locale ?? '').trim();
    return locale || 'es-CO';
  }

  /**
   * Obtiene el valor minimo configurable para el campo numerico.
   * @param field Configuracion del campo dinamico.
   * @returns Minimo numerico o undefined.
   */
  getNumberMin(field: DynamicField): number | undefined {
    const min = Number((field as { min?: unknown }).min);
    if (Number.isFinite(min)) {
      return min;
    }

    const resolved = this.resolveNumericMin(field);
    return resolved === null ? undefined : resolved;
  }

  /**
   * Define si el simbolo de moneda se muestra como codigo o simbolo.
   * @param field Configuracion del campo dinamico.
   * @returns Tipo de visualizacion de moneda.
   */
  getCurrencyDisplay(field: DynamicField): 'symbol' | 'code' {
    const display = String((field as { currencyDisplay?: unknown }).currencyDisplay ?? '').trim().toLowerCase();
    return display === 'code' ? 'code' : 'symbol';
  }

  /**
   * Obtiene la llave de un control auxiliar de moneda configurado para el campo.
   * @param field Configuracion del campo dinamico.
   * @returns Llave del control de moneda o undefined.
   */
  private getCurrencyControlKey(field: DynamicField): string | undefined {
    const controlKey = String((field as { currencyFieldKey?: unknown }).currencyFieldKey ?? '').trim();
    return controlKey || undefined;
  }

  /**
   * Resuelve una moneda por defecto cuando no existe valor explicito en configuracion o formulario.
   * @param field Configuracion del campo dinamico.
   * @returns Codigo de moneda de fallback o undefined.
   */
  private resolveCurrencyFallback(field: DynamicField): string | undefined {
    const fallback = String((field as { currencyFallback?: unknown }).currencyFallback ?? '').trim().toUpperCase();
    if (fallback) {
      return fallback;
    }

    const explicitCurrencyMode = (field as { mode?: unknown }).mode === 'currency';
    return explicitCurrencyMode ? 'COP' : undefined;
  }

  /**
   * Obtiene el valor inicial basado en el tipo de campo
   */
  private getInitialValue(
    field: DynamicField,
  ): string | number | boolean | null {
    switch (field.type) {
      case 'checkbox':
        return false;
      case 'number':
        return 0;
      case 'select':
        return null;
      case 'textarea':
        return '';
      case 'img':
      case 'file':
        return '';
      default:
        return '';
    }
  }

  /**
   * Maneja la selección de archivos desde p-fileUpload
   */
  onFileSelect(event: unknown, fieldKey: string): void {
    const files = this.extractFilesFromUploadEvent(event);
    if (!files.length) return;

    const validFiles = files.filter((file) => this.isValidSelectedFile(file, fieldKey));
    if (!validFiles.length) {
      this.onFileRemove(fieldKey);
      return;
    }

    const isMultiple = this.isMultipleField(fieldKey);
    this.selectedFiles[fieldKey] = isMultiple ? validFiles : [validFiles[0]];
    const names = this.selectedFiles[fieldKey].map((file) => file.name).join(', ');
    this.itemForm.get(fieldKey)?.setValue(names);
  }

  /**
   * Extrae archivos desde diferentes formatos de evento emitidos por p-fileUpload.
   * @param event Evento de seleccion de archivos.
   * @returns Archivos normalizados y sin duplicados.
   */
  private extractFilesFromUploadEvent(event: unknown): File[] {
    if (!event || typeof event !== 'object') {
      return [];
    }

    const fileEvent = event as {
      files?: unknown;
      currentFiles?: unknown;
      originalEvent?: { files?: unknown; target?: { files?: FileList | null } };
    };

    const candidates: unknown[] = [
      fileEvent.files,
      fileEvent.currentFiles,
      fileEvent.originalEvent?.files,
      fileEvent.originalEvent?.target?.files,
    ];

    const files = candidates.reduce<File[]>((accumulator, candidate) => {
      accumulator.push(...this.normalizeToFiles(candidate));
      return accumulator;
    }, []);

    return this.deduplicateFiles(files);
  }

  /**
   * Normaliza un valor desconocido a un arreglo de archivos.
   * @param value Valor potencialmente compatible con File, FileList o arreglo.
   * @returns Lista de archivos normalizada.
   */
  private normalizeToFiles(value: unknown): File[] {
    if (!value) {
      return [];
    }

    if (value instanceof File) {
      return [value];
    }

    if (value instanceof FileList) {
      return Array.from(value);
    }

    if (Array.isArray(value)) {
      return value.reduce<File[]>((accumulator, entry) => {
        accumulator.push(...this.normalizeToFiles(entry));
        return accumulator;
      }, []);
    }

    return [];
  }

  /**
   * Elimina archivos repetidos usando una huella basada en metadatos del archivo.
   * @param files Archivos candidatos.
   * @returns Lista unica de archivos.
   */
  private deduplicateFiles(files: File[]): File[] {
    const unique = new Map<string, File>();

    files.forEach((file) => {
      const fingerprint = `${file.name}__${file.size}__${file.lastModified}__${file.type}`;
      if (!unique.has(fingerprint)) {
        unique.set(fingerprint, file);
      }
    });

    return Array.from(unique.values());
  }

  /**
   * Valida tipo y tamano del archivo segun configuracion del campo.
   * @param file Archivo seleccionado.
   * @param fieldKey Llave del campo asociado.
   * @returns true si el archivo es valido; false en caso contrario.
   */
  private isValidSelectedFile(file: File, fieldKey: string): boolean {
    const imageField = this.isImageField(fieldKey);
    if (imageField && !file.type.startsWith('image/')) {
      this.feedbackToastRef?.instance.showError('Solo se permiten imágenes');
      return false;
    }

    const maxFileSize = this.resolveMaxFileSize(fieldKey);
    if (file.size > maxFileSize) {
      const limitMb = Math.round(maxFileSize / (1024 * 1024));
      this.feedbackToastRef?.instance.showError(`El archivo no puede superar ${limitMb} MB`);
      return false;
    }

    return true;
  }

  /**
   * Resuelve el tamano maximo permitido por campo.
   * @param fieldKey Llave del campo.
   * @returns Tamano maximo en bytes.
   */
  private resolveMaxFileSize(fieldKey: string): number {
    const field = this.displayFields.find((item) => item.key === fieldKey);
    return field?.maxFileSize ?? (this.isImageField(fieldKey) ? this.maxImageSize : 10 * 1024 * 1024);
  }

  /**
   * Indica si un campo dinamico corresponde a una imagen.
   * @param fieldKey Llave del campo.
   * @returns true cuando el tipo del campo es img.
   */
  private isImageField(fieldKey: string): boolean {
    const field = this.displayFields.find((item) => item.key === fieldKey);
    return field?.type === 'img';
  }

  /**
   * Verifica si el campo acepta multiples archivos.
   * @param fieldKey Llave del campo.
   * @returns true si el campo esta marcado como multiple.
   */
  isMultipleField(fieldKey: string): boolean {
    const field = this.displayFields.find((item) => item.key === fieldKey);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((field as any)?.multiple);
  }

  /**
   * Remueve un archivo seleccionado
   */
  onFileRemove(fieldKey: string): void {
    delete this.selectedFiles[fieldKey];
    this.itemForm.get(fieldKey)?.setValue('');
  }

  /**
   * Obtiene el archivo seleccionado para un campo
   * @param fieldKey Llave del campo.
   * @returns Archivo unico, arreglo de archivos o null si no hay seleccion.
   */
  getSelectedFile(fieldKey: string): File | File[] | null {
    const files = this.selectedFiles[fieldKey];
    if (!files?.length) return null;
    return this.isMultipleField(fieldKey) ? files : files[0];
  }

  /**
   * Combina imagenes persistidas y seleccionadas para renderizar previsualizaciones.
   * @param fieldKey Llave del campo de imagen.
   * @returns Lista completa de items de preview.
   */
  getImagePreviewItems(fieldKey: string): ImagePreviewItem[] {
    return [...this.getPersistedImagePreviewItems(fieldKey), ...this.getSelectedImagePreviewItems(fieldKey)];
  }

  /**
   * Elimina una imagen de la previsualizacion segun su origen.
   * @param fieldKey Llave del campo de imagen.
   * @param preview Item de previsualizacion a remover.
   */
  removeImagePreview(fieldKey: string, preview: ImagePreviewItem): void {
    if (preview.source === 'selected') {
      this.removeSelectedImagePreview(fieldKey, preview.fingerprint);
      return;
    }

    this.removePersistedImagePreview(fieldKey, preview.fingerprint);
  }

  /**
   * Obtiene las opciones configuradas para un campo select.
   * @param fieldKey Llave del campo select.
   * @returns Lista de opciones label/value para el control.
   */
  getSelectOptions(fieldKey: string): { label: string; value: string | number | boolean }[] {
    return this.fieldSelectOptions[fieldKey] || [];
  }


  /**
   * Cierra el dialogo, notifica cancelacion y limpia archivos temporales.
   */
  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();

    // ✅ Limpiar archivos seleccionados
    this.selectedFiles = {};
  }

  /**
   * Ejecuta el guardado del formulario por defecto o delega al template personalizado.
   * @returns void
   */
  saveItem(): void {
    if (this.body) {
      this.triggerSave.emit();
      return;
    }

    if (!this.validateDefaultForm()) {
      return;
    }

    const formValue = this.buildFormValueForSave();
    this.save.emit(formValue);
    this.hideDialog();
  }

  /**
   * Valida el formulario reactivo y notifica cuando hay campos requeridos faltantes.
   * @returns true cuando el formulario es valido; false en caso contrario.
   */
  private validateDefaultForm(): boolean {
    if (!this.itemForm.invalid) {
      return true;
    }

    this.itemForm.markAllAsTouched();
    this.feedbackToastRef?.instance.showError('Completa los campos obligatorios antes de guardar');
    return false;
  }

  /**
   * Construye el payload final de guardado incluyendo IDs, archivos y fallback de imagenes existentes.
   * @returns Objeto listo para emitirse en el evento save.
   */
  private buildFormValueForSave(): Record<string, unknown> {
    const formValue = this.itemForm.value as Record<string, unknown>;
    this.preserveCurrentId(formValue);
    this.applySelectedFilesToFormValue(formValue);
    this.attachOriginalFiles(formValue);
    this.attachPersistedImagesFallback(formValue);
    return formValue;
  }

  /**
   * Preserva el id actual cuando el dialogo esta en modo edicion.
   * @param formValue Payload del formulario en construccion.
   */
  private preserveCurrentId(formValue: Record<string, unknown>): void {
    if (this.currentItem['id']) {
      formValue['id'] = this.currentItem['id'];
    }
  }

  /**
   * Convierte archivos seleccionados a valores de formulario y deja previsualizacion para imagenes.
   * @param formValue Payload del formulario en construccion.
   */
  private applySelectedFilesToFormValue(formValue: Record<string, unknown>): void {
    Object.entries(this.selectedFiles).forEach(([key, files]) => {
      if (!files?.length) return;

      const isImage = files[0].type.startsWith('image/');
      if (this.isMultipleField(key)) {
        formValue[key] = isImage
          ? files.map((file) => URL.createObjectURL(file))
          : files.map((file) => file.name);
        return;
      }

      formValue[key] = isImage ? URL.createObjectURL(files[0]) : files[0].name;
    });
  }

  /**
   * Adjunta los archivos originales al payload para procesamiento posterior.
   * @param formValue Payload del formulario en construccion.
   */
  private attachOriginalFiles(formValue: Record<string, unknown>): void {
    if (Object.keys(this.selectedFiles).length > 0) {
      formValue['_files'] = this.selectedFiles;
    }
  }

  /**
   * Si no hay imagenes nuevas en el formulario, mantiene las imagenes ya persistidas.
   * @param formValue Payload del formulario en construccion.
   */
  private attachPersistedImagesFallback(formValue: Record<string, unknown>): void {
    const existingImages = this.getPersistedImages();
    if (!formValue['imagenes'] && existingImages.length) {
      formValue['imagenes'] = existingImages;
    }
  }

  /**
   * Gestiona el evento hide del dialogo sin disparar ciclos de cierre duplicados.
   */
  onDialogHide() {
    // ✅ Solo limpiar archivos y resetear estado interno sin emitir eventos
    // Esto evita el bucle infinito con el two-way binding
    this.selectedFiles = {};

    // ✅ Solo emitir cancel si el diálogo se cerró sin guardar
    if (this.visible) {
      this.cancel.emit();
    }
  }

  /**
   * Sincroniza el estado de visibilidad cuando PrimeNG emite cambios internos.
   * @param visible Nuevo estado de visibilidad del dialogo.
   */
  onVisibilityChange(visible: boolean) {
    // ✅ Manejar el cambio de visibilidad desde PrimeNG
    this.visible = visible;
    this.visibleChange.emit(visible);

    if (!visible) {
      // ✅ Limpiar archivos cuando se cierra el diálogo
      this.selectedFiles = {};
      this.cancel.emit();
    }
  }

  /**
   * Obtiene previsualizaciones de imagenes persistidas en formato simple para la vista.
   * @param fieldKey Llave del campo de imagen.
   * @returns Lista de objetos con url y texto alternativo.
   */
  getImagePreviews(fieldKey: string): Array<{ url: string; alt: string }> {
    return this.getPersistedImages(fieldKey)
      .map((entry, index) => {
        const url = this.extractImageUrl(entry);
        if (!url) {
          return null;
        }

        return {
          url,
          alt: this.extractImageAlt(entry, index),
        };
      })
      .filter((item): item is { url: string; alt: string } => Boolean(item));
  }

  /**
   * Recupera imagenes persistidas desde posibles propiedades candidatas del item actual.
   * @param fieldKey Llave principal del campo de imagen.
   * @returns Lista unica de entradas de imagen.
   */
  private getPersistedImages(fieldKey = 'imagen'): unknown[] {
    const candidates = [
      this.currentItem[fieldKey],
      this.currentItem['imagenes'],
      this.currentItem[`${fieldKey}s`],
    ];

    const unique = new Map<string, unknown>();

    candidates
      .reduce<unknown[]>((accumulator, candidate) => {
        accumulator.push(...this.normalizeToArray(candidate));
        return accumulator;
      }, [])
      .forEach((entry) => {
        const key = this.buildPersistedImageKey(entry);
        if (!unique.has(key)) {
          unique.set(key, entry);
        }
      });

    return Array.from(unique.values());
  }

  /**
   * Construye items de previsualizacion para imagenes que ya existen en persistencia.
   * @param fieldKey Llave del campo de imagen.
   * @returns Lista de items de preview persistidos.
   */
  getPersistedImagePreviewItems(fieldKey = 'imagen'): ImagePreviewItem[] {
    return this.getPersistedImages(fieldKey)
      .map((entry, index) => {
        const url = this.extractImageUrl(entry);
        if (!url) {
          return null;
        }

        return {
          url,
          alt: this.extractImageAlt(entry, index),
          source: 'persisted' as const,
          fingerprint: this.extractPersistedFingerprint(entry, url, index),
        } as ImagePreviewItem;
      })
      .filter(Boolean) as ImagePreviewItem[];
  }

  /**
   * Genera previews temporales para imagenes seleccionadas en la sesion actual.
   * @param fieldKey Llave del campo de imagen.
   * @returns Lista de items de preview seleccionados.
   */
  private getSelectedImagePreviewItems(fieldKey = 'imagen'): ImagePreviewItem[] {
    const files = this.selectedFiles[fieldKey] ?? [];

    return files
      .filter((file) => file.type.startsWith('image/'))
      .map((file, index) => ({
        url: URL.createObjectURL(file),
        alt: file.name,
        source: 'selected' as const,
        fingerprint: this.buildFileFingerprint(file, index),
      }));
  }

  /**
   * Elimina una imagen seleccionada usando su huella unica.
   * @param fieldKey Llave del campo de imagen.
   * @param fingerprint Huella del archivo a remover.
   */
  private removeSelectedImagePreview(fieldKey: string, fingerprint: string): void {
    const files = this.selectedFiles[fieldKey] ?? [];
    const remaining = files.filter((file, index) => this.buildFileFingerprint(file, index) !== fingerprint);

    if (!remaining.length) {
      this.onFileRemove(fieldKey);
      return;
    }

    this.selectedFiles[fieldKey] = remaining;
    this.itemForm.get(fieldKey)?.setValue(remaining.map((file) => file.name).join(', '));
  }

  /**
   * Elimina una imagen persistida y actualiza el estado actual del item.
   * @param fieldKey Llave del campo de imagen.
   * @param fingerprint Huella de la imagen persistida a remover.
   */
  private removePersistedImagePreview(fieldKey: string, fingerprint: string): void {
    const currentImages = this.getPersistedImages(fieldKey)
      .map((entry, index) => {
        const url = this.extractImageUrl(entry);
        if (!url) {
          return null;
        }

        return {
          url,
          alt: this.extractImageAlt(entry, index),
          source: 'persisted' as const,
          fingerprint: this.extractPersistedFingerprint(entry, url, index),
        } as ImagePreviewItem;
      })
      .filter(Boolean) as ImagePreviewItem[];
    const remaining = currentImages.filter((item) => item.fingerprint !== fingerprint);
    this.updateCurrentItemImages(fieldKey, remaining);
    this.itemForm.get(fieldKey)?.setValue(remaining.length ? remaining.map((item) => item.alt || item.url).join(', ') : '');
  }

  /**
   * Sincroniza en currentItem las imagenes restantes tras una eliminacion.
   * @param fieldKey Llave del campo de imagen principal.
   * @param items Imagenes restantes en formato preview.
   */
  private updateCurrentItemImages(fieldKey: string, items: ImagePreviewItem[]): void {
    this.currentItem = {
      ...this.currentItem,
      [fieldKey]: items.map((item) => ({ url: item.url, alt: item.alt })),
      imagenes: fieldKey === 'imagen' ? items.map((item) => ({ url: item.url, alt: item.alt })) : this.currentItem['imagenes'],
    };
  }

  /**
   * Extrae una huella estable para imagenes persistidas usando id o url.
   * @param entry Entrada de imagen.
   * @param url URL resuelta de la imagen.
   * @param index Indice de respaldo cuando no hay id.
   * @returns Huella unica para la imagen.
   */
  private extractPersistedFingerprint(entry: unknown, url: string, index: number): string {
    if (entry && typeof entry === 'object') {
      const id = String((entry as { id?: unknown }).id ?? '').trim();
      if (id) {
        return `id:${id}`;
      }
    }

    return `url:${url}:${index}`;
  }

  /**
   * Construye una llave de unicidad para deduplicar imagenes persistidas.
   * @param entry Entrada de imagen persistida.
   * @returns Llave unica de deduplicacion.
   */
  private buildPersistedImageKey(entry: unknown): string {
    if (entry && typeof entry === 'object') {
      const id = String((entry as { id?: unknown }).id ?? '').trim();
      if (id) {
        return `id:${id}`;
      }
    }

    const url = this.extractImageUrl(entry);
    if (url) {
      return `url:${url}`;
    }

    return `entry:${JSON.stringify(entry ?? '')}`;
  }

  /**
   * Genera huella unica para un archivo seleccionado.
   * @param file Archivo seleccionado.
   * @param index Posicion del archivo en la lista.
   * @returns Huella del archivo.
   */
  private buildFileFingerprint(file: File, index: number): string {
    return `${file.name}__${file.size}__${file.lastModified}__${file.type}__${index}`;
  }

  /**
   * Convierte un valor unico o nulo en arreglo para unificar tratamiento.
   * @param value Valor de entrada.
   * @returns Arreglo con cero o mas elementos.
   */
  private normalizeToArray(value: unknown): unknown[] {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [value];
  }

  /**
   * Extrae una URL de imagen desde string directo o estructura con propiedad url.
   * @param entry Entrada de imagen.
   * @returns URL normalizada o cadena vacia.
   */
  private extractImageUrl(entry: unknown): string {
    if (typeof entry === 'string') {
      return entry.trim();
    }

    if (entry && typeof entry === 'object') {
      return String((entry as { url?: unknown }).url ?? '').trim();
    }

    return '';
  }

  /**
   * Extrae texto alternativo desde la entrada o genera uno por defecto.
   * @param entry Entrada de imagen.
   * @param index Posicion de la imagen en la coleccion.
   * @returns Texto alternativo para accesibilidad.
   */
  private extractImageAlt(entry: unknown, index: number): string {
    if (entry && typeof entry === 'object') {
      const alt = String((entry as { alt?: unknown }).alt ?? '').trim();
      if (alt) {
        return alt;
      }
    }

    return `Imagen ${index + 1}`;
  }
}
