import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';

@Component({
  selector: 'lib-button-actions-row1',
  standalone: true,
  imports: [PrimegModule, FormsModule],
  templateUrl: './button-actions-row1.component.html',
  styleUrl: './button-actions-row1.component.scss'
})
export class ButtonActionsRow1Component implements OnInit {

  componente: ComponentesDTO = {
    id: 24,
    nombreComponente: 'lib-button-actions-row1',
    version: '1.0',
  };

  @Input() item: Record<string, unknown> = {};
  @Input() disabled: boolean = false;
  
  @Output() edit = new EventEmitter<Record<string, unknown>>();
  
  items: MenuItem[] = [];

  ngOnInit() {
    this.buildMenuItems();
  }

  buildMenuItems() {
    this.items = [];
    this.addEditAction();
  }

  private addEditAction() {
    this.items.push({
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.edit.emit(this.item)
    });
  }
}
