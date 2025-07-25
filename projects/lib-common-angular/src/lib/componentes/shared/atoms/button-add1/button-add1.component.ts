import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';

@Component({
  selector: 'lib-button-add1',
  standalone: true,
  imports: [PrimegModule],
  templateUrl: './button-add1.component.html',
  styleUrl: './button-add1.component.scss'
})
export class ButtonAdd1Component {
  @Input() label: string = 'New';
  @Input() icon: string = 'pi pi-plus';
  @Input() disabled: boolean = false;
  @Input() size: 'small' | 'large' | undefined = undefined;
  @Input() outlined: boolean = false;
  @Input() rounded: boolean = false;
  @Input() severity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | undefined = 'success';
  @Input() tooltip: string = 'Add new item';
  @Input() loading: boolean = false;
  
  @Output() add = new EventEmitter<void>();

  onAdd() {
    if (!this.disabled && !this.loading) {
      this.add.emit();
    }
  }
}
