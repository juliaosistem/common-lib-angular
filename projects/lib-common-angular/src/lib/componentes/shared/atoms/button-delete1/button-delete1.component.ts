import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-button-delete1',
  standalone: true,
  imports: [PrimegModule],
  templateUrl: './button-delete1.component.html',
  styleUrl: './button-delete1.component.scss'
})
export class ButtonDelete1Component {

  componente: ComponentesDTO = {
    id: 22,
    nombreComponente: 'lib-button-delete1',
    version: '1.0',
  };

  @Input() label: string = 'Delete';
  @Input() icon: string = 'pi pi-trash';
  @Input() disabled: boolean = false;
  @Input() size: 'small' | 'large' | undefined = undefined;
  @Input() outlined: boolean = false;
  @Input() rounded: boolean = false;
  @Input() severity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | undefined = 'danger';
  @Input() tooltip: string = 'Delete selected items';
  @Input() loading: boolean = false;
  
  @Output() delete = new EventEmitter<void>();

  onDelete(): void {
    this.delete.emit();
  }
}
