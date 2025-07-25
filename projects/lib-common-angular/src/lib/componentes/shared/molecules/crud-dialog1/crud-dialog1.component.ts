import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { DynamicField } from '../../interfaces/dynamic-field.interface';

@Component({
  selector: 'lib-crud-dialog1',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimegModule],
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

  internalItem: Record<string, unknown> = {};
  submitted: boolean = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentItem'] && this.currentItem) {
      this.internalItem = { ...this.currentItem };
    }
    if (changes['visible'] && !this.visible) {
      this.submitted = false;
    }
  }

  // ✅ Obtener opciones para campos de tipo select
  getSelectOptions(fieldKey: string): { label: string; value: string }[] {
    const options = this.fieldSelectOptions[fieldKey] || [];
    return options.map(option => ({ label: option, value: option }));
  }

  hideDialog() {
    this.visible = false;
    this.submitted = false;
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  saveItem() {
    this.submitted = true;

    // Validación básica - verificar que el campo 'name' esté presente
    if (this.internalItem['name'] && String(this.internalItem['name']).trim()) {
      this.save.emit({ ...this.internalItem });
      this.hideDialog();
    }
  }

  onDialogHide() {
    if (this.visible) {
      this.hideDialog();
    }
  }
}
