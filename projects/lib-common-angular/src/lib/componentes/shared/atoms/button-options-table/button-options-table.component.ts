import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/tablaDataSharedDTO';

@Component({
  selector: 'lib-button-options-table',
  imports: [PrimegModule, FormsModule],
  templateUrl: './button-options-table.component.html',
  styleUrl: './button-options-table.component.scss',
})
export class ButtonOptionsTableComponent implements OnInit {

  @Input() isAdd: boolean = true; 
  @Input() isEdit: boolean = true;
  @Input() isDelete: boolean = true;
  @Input() isWhatsapp: boolean = true;
  @Input() isExportExcel: boolean = true;
  @Input() isExportPdf: boolean = true;
  @Input() isImportExcel: boolean = true;
  @Input() isImportPdf: boolean = true;
  @Input() selectedItem: unknown; // Producto seleccionado
  
  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<unknown>();
  @Output() onDelete = new EventEmitter<void>(); // Sin parámetros - solo señal de eliminar seleccionados
  @Output() onWhatsapp = new EventEmitter<unknown>();
  @Output() onExportPdf = new EventEmitter<unknown>();
  @Output() onExportExcel = new EventEmitter<unknown>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() tablaDataSharedDTO!: TablaDataSharedDTO<Menu, any>;
  
  items: MenuItem[]=[];

  ngOnInit() {

    this.addButtons()
   
  }

  addButtons() {
     this.addAddButton();
     this.addDeleteButton();
     this.addWhatsappButton();
     this.addButtonImportExcelOrPdf();
     this.addButtonExportExcelOrPdf();
  }


  addButtonExportExcelOrPdf(){
      if (this.isExportExcel || this.isExportPdf) {
    this.items.push({ separator: true });
    this.items.push({
      label: 'Export',
      icon: 'pi pi-download',
      items: [
        ...(this.isExportPdf ? [{ label: 'Export to PDF', icon: 'pi pi-file-pdf' }] : []),
        ...(this.isExportExcel ? [{ label: 'Export to Excel', icon: 'pi pi-file-excel' }] : [])
      ].filter(Boolean)
    });
  }}

  
  addButtonImportExcelOrPdf() {
    if (this.isImportExcel || this.isImportPdf) {
      this.items.push({ separator: true });
      this.items.push({
        label: 'Import',
        icon: 'pi pi-upload',
        items: [
          ...(this.isImportPdf ? [{ label: 'Import from PDF', icon: 'pi pi-file-pdf' }] : []),
          ...(this.isImportExcel ? [{ label: 'Import from Excel', icon: 'pi pi-file-excel' }] : [])
        ].filter(Boolean)
      });
    }
  }
  
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
  addWhatsappButton(){
    if (this.isWhatsapp) {
      this.items.push({  
        label: 'WhatsApp',  
        icon: 'pi pi-whatsapp',
        command: () => this.onWhatsapp.emit(this.selectedItem)
      });
    }
    }
}
