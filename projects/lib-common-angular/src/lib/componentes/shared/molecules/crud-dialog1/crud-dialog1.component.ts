import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { DynamicField } from '../../interfaces/dynamic-field.interface';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-crud-dialog1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimegModule],
  templateUrl: './crud-dialog1.component.html',
  styleUrl: './crud-dialog1.component.scss',
})
export class CrudDialog1Component implements OnChanges {
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  @Input() visible: boolean = false;
  @Input() displayFields: DynamicField[] = [];
  @Input() currentItem: Record<string, unknown> = {};
  @Input() fieldSelectOptions: Record<string, string[]> = {};
  @Input() isDefaultContent: boolean = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() body: TemplateRef<any> | undefined;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Record<string, unknown>>();
  @Output() cancel = new EventEmitter<void>();
  @Output() triggerSave = new EventEmitter<void>(); // Nuevo evento para templates personalizados

  itemForm: FormGroup;

  componente: ComponentesDTO = {
    id: 18,
    nombreComponente: 'lib-crud-dialog1',
    version: '1.0',
  };

  /**
   * Archivos seleccionados
   */
  selectedFiles: Record<string, File> = {};

  constructor(private fb: FormBuilder) {
    this.itemForm = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentItem'] && this.currentItem) {
      this.updateForm();
    }
  }

  private updateForm() {
    const formControls: Record<string, unknown> = {};

    this.displayFields.forEach((field) => {
      const initialValue = this.getInitialValue(field);
      const currentValue = this.currentItem[field.key] ?? initialValue;

      formControls[field.key] = [currentValue];
    });

    this.itemForm = this.fb.group(formControls);
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
  onFileSelect(event: { files: File[] }, fieldKey: string): void {
    const file = event.files[0] as File;

    if (file) {
      // Guardar archivo
      this.selectedFiles[fieldKey] = file;
      // Actualizar el formulario
      this.itemForm.get(fieldKey)?.setValue(file.name);
    }
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
   */
  getSelectedFile(fieldKey: string): File | null {
    return this.selectedFiles[fieldKey] || null;
  }

  // ✅ Obtener opciones para campos de tipo select
  getSelectOptions(fieldKey: string): { label: string; value: string }[] {
    const options = this.fieldSelectOptions[fieldKey] || [];
    return options.map((option) => ({ label: option, value: option }));
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();

    // ✅ Limpiar archivos seleccionados
    this.selectedFiles = {};
  }

  saveItem() {
    // Si hay un template personalizado, delegar el guardado al template
    if (this.body) {
      this.triggerSave.emit();
      return;
    }

    // Lógica original para formularios por defecto
    const formValue = this.itemForm.value;

    // ✅ Preservar el ID si existe (para edición)
    if (this.currentItem['id']) {
      formValue['id'] = this.currentItem['id'];
    }

// Procesar archivos seleccionados antes de guardar
/**
 * Si es imagen → crea URL temporal (Blob) para vista previa.
 * Si es PDF/Excel → guarda nombre, pero conserva el File real en selectedFiles.
 */
    Object.entries(this.selectedFiles).forEach(([key, file]) => {
      if (!file) return;
      formValue[key] = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : file.name;
    });

    // ✅ Agregar archivos originales al payload para procesamiento posterior
    if (Object.keys(this.selectedFiles).length > 0) {
      formValue['_files'] = this.selectedFiles;
    }

    this.save.emit(formValue);
    this.hideDialog();
  }

  onDialogHide() {
    // ✅ Solo limpiar archivos y resetear estado interno sin emitir eventos
    // Esto evita el bucle infinito con el two-way binding
    this.selectedFiles = {};

    // ✅ Solo emitir cancel si el diálogo se cerró sin guardar
    if (this.visible) {
      this.cancel.emit();
    }
  }

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
}
