import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';

@Component({
  selector: 'lib-button-action-edit1',
  standalone: true,
  imports: [PrimegModule],
  templateUrl: './button-action-edit1.component.html',
  styleUrls: ['./button-action-edit1.component.scss']
})
export class ButtonActionEdit1Component {
  @Input() item: Record<string, unknown> = {};
  @Input() disabled: boolean = false;
  @Input() size: 'small' | 'large' | undefined = undefined;
  @Input() outlined: boolean = true;
  @Input() rounded: boolean = true;
  
  @Output() edit = new EventEmitter<Record<string, unknown>>();

  onEdit() {
    if (!this.disabled) {
      this.edit.emit(this.item);
    }
  }
}
