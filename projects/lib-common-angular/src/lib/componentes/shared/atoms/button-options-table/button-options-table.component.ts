import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';

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
  @Input() selectedItem: any; // Producto seleccionado
  
  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onWhatsapp = new EventEmitter<any>();
  @Output() onExportPdf = new EventEmitter<any>();
  @Output() onExportExcel = new EventEmitter<any>();
  
  items: MenuItem[] | undefined;

  ngOnInit() {

    this.items = [];
    this.isAdd && this.items.push({ 
      label: 'Add', 
      icon: 'pi pi-plus',
      command: () => this.onAdd.emit() 
    });
    this.isEdit && this.items.push({ 
      label: 'Edit', 
      icon: 'pi pi-pencil',
      command: () => this.onEdit.emit() 
    });
    this.isDelete && this.items.push({ 
      label: 'Delete', 
      icon: 'pi pi-trash',
      command: () => this.onDelete.emit(this.selectedItem) 
    });
    this.isWhatsapp && this.items.push({ label: 'WhatsApp', icon: 'pi pi-whatsapp' });
    (this.isExportExcel || this.isExportPdf) && this.items.push({ separator: true });
    (this.isExportExcel || this.isExportPdf) && this.items.push({
      label: 'Export',
      icon: 'pi pi-download',
      items: [
        ...(this.isExportPdf ? [{ label: 'Export to PDF', icon: 'pi pi-file-pdf' }] : []),
        ...(this.isExportExcel ? [{ label: 'Export to Excel', icon: 'pi pi-file-excel' }] : [])
      ].filter(Boolean)
    });
  }
}
