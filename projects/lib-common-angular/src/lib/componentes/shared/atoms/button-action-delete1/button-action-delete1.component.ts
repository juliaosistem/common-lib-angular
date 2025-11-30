import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-button-action-delete1',
  standalone: true,
  imports: [PrimegModule],
  templateUrl: './button-action-delete1.component.html',
  styleUrl: './button-action-delete1.component.scss'
})
export class ButtonActionDelete1Component {

  componente: ComponentesDTO = {
    id: 15,
    nombreComponente: 'lib-button-action-delete1',
    version: '1.0'
  };

  @Input() item: Record<string, unknown> = {};
  @Input() disabled: boolean = false;
  @Input() size: 'small' | 'large' | undefined = undefined;
  @Input() outlined: boolean = true;
  @Input() rounded: boolean = true;
  
  @Output() delete = new EventEmitter<Record<string, unknown>>();

  onDelete() {
    if (!this.disabled) {
      this.delete.emit(this.item);
    }
  }
}
