import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/tablaDataSharedDTO';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-button-options-table',
  imports: [PrimegModule, FormsModule],
  templateUrl: './button-options-table.component.html',
  styleUrl: './button-options-table.component.scss',
  standalone: true,
})
export class ButtonOptionsTableComponent implements OnInit {

  componente: ComponentesDTO = {
    id: 8,
    nombreComponente: 'lib-button-options-table',
    version: '1.0',
  };

  @Input() isAdd: boolean = true; 
  @Input() isDelete: boolean = true;
  @Input() isExportExcel: boolean = true;
  @Input() selectedItem: unknown; // Producto seleccionado
  
  @Output() onAdd = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() onExportExcel = new EventEmitter<void>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() tablaDataSharedDTO!: TablaDataSharedDTO<Menu, any>;
  
  items: MenuItem[]=[];

  ngOnInit() {

    this.addButtons()
   
  }

  addButtons() {
     this.addAddButton();
     this.addButtonExportExcelOrPdf();
     this.addDeleteButton();
  }


  addButtonExportExcelOrPdf(){
      if (this.isExportExcel) {
    this.items.push({ separator: true });
    this.items.push({
      label: 'Export',
      icon: 'pi pi-download',
      items: [
        
        ...(this.isExportExcel ? [{ 
          label: 'Export to Excel', 
          icon: 'pi pi-file-excel',
          command: () => this.onExportExcel.emit()
        }] : [])
      ].filter(Boolean)
    });
  }}

  
  
  
  addAddButton(){
    if(this.isAdd) {this.items.push({ 
      label: 'Add', 
      icon: 'pi pi-plus',
      command: () => this.onAdd.emit() 
    });}
  }

  addDeleteButton() {
  if (this.isDelete){
  this.items.push({ 
    label: 'Delete Selected', 
    icon: 'pi pi-trash',
    command: () => { 
      this.onDelete.emit(); // Solo emitir el evento, sin parámetros
    } });
  }
}
  
}
