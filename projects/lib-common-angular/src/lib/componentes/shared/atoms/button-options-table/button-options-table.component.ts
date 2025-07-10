import { Component, OnInit, Input } from '@angular/core';
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
  
  items: MenuItem[] | undefined;

  ngOnInit() {

    this.items = [];
    this.isAdd && this.items.push({ label: 'Add', icon: 'pi pi-plus' });
    this.isEdit && this.items.push({ label: 'Edit', icon: 'pi pi-pencil' });
    this.isDelete && this.items.push({ label: 'Delete', icon: 'pi pi-trash' });
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
