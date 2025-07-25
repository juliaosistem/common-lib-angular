import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { DynamicField } from '../../interfaces/dynamic-field.interface';

@Component({
  selector: 'lib-crud-dialog1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimegModule],
  templateUrl: './crud-dialog1.component.html',
  styleUrl: './crud-dialog1.component.scss'
})
export class CrudDialog1Component implements OnChanges {
  @Input() visible: boolean = false;
  @Input() displayFields: DynamicField[] = [];
  @Input() currentItem: Record<string, unknown> = {};
  @Input() fieldSelectOptions: Record<string, string[]> = {};

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Record<string, unknown>>();
  @Output() cancel = new EventEmitter<void>();

  itemForm: FormGroup;

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
    
    this.displayFields.forEach(field => {
      const initialValue = this.getInitialValue(field);
      const currentValue = this.currentItem[field.key] ?? initialValue;
      
      formControls[field.key] = [currentValue];
    });
    
    this.itemForm = this.fb.group(formControls);
  }

  /**
   * Obtiene el valor inicial basado en el tipo de campo
   */
  private getInitialValue(field: DynamicField): string | number | boolean | null {
    switch (field.type) {
      case 'checkbox':
        return false;
      case 'number':
        return 0;
      case 'select':
        return null;
      default:
        return '';
    }
  }

  // ✅ Obtener opciones para campos de tipo select
  getSelectOptions(fieldKey: string): { label: string; value: string }[] {
    const options = this.fieldSelectOptions[fieldKey] || [];
    return options.map(option => ({ label: option, value: option }));
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  saveItem() {
    const formValue = this.itemForm.value;
    
    // ✅ Preservar el ID si existe (para edición)
    if (this.currentItem['id']) {
      formValue['id'] = this.currentItem['id'];
    }
    
    this.save.emit(formValue);
    this.hideDialog();
  }

  onDialogHide() {
    if (this.visible) {
      this.hideDialog();
    }
  }
}
