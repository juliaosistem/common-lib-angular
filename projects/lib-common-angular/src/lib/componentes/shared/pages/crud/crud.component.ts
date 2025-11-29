// En crud.ts - Agregar las propiedades para el sistema dinámico
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrimegModule } from '../../../../modulos/primeg.module';
import { Tabla1Component } from '../../molecules/tabla1/tabla1.component';
import { Grid1Component } from '../../molecules/grid1/grid1.component';
import { ToolBar1Component } from '../../molecules/tool-bar1/tool-bar1.component';

// ✅ Importar los tipos del sistema dinámico
import { FieldType, DynamicField } from '@juliaosistem/core-dtos';
import { DynamicFieldService } from '../../services/dynamic-field.service';
import { ExcelExportService } from '../../services/excel-export.service';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
    selector: 'lib-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        PrimegModule,
        ToolBar1Component,
        Tabla1Component,
        Grid1Component
    ],
    templateUrl: './crud.component.html',
    providers: [MessageService, ConfirmationService]
})
export class Crud implements OnInit {
    @Input() showDialog: boolean = false;
    @Input() submitted: boolean = false;
    @Input() loaded: boolean = false;
    @Input() tableType: 'table' | 'grid' = 'table';
    @Input() data: Record<string, unknown>[] = [];
    @Input() fieldTypeConfig: Record<string, FieldType> = {}; // Configuración de tipos de campo
    @Input() fieldLabels: Record<string, string> = {};        // Etiquetas personal
    @Input() fieldOrder: string[] = [];                       // Orden de columnas
    @Input() excludeFields: string[] = ['id'];                // Campos a excluir
@Input() fieldSelectOptions: Record<string, { label: string; value: string | number | boolean }[]> = {};

    // Propiedades del paginador
    @Input() rows: number = 10;                               // Filas por página
    @Input() paginator: boolean = true;                       // Habilitar paginador
    @Input() rowsPerPageOptions: number[] = [10, 20, 30];     // Opciones de filas por página
    @Input() showCurrentPageReport: boolean = true;           // Mostrar reporte de página

    // ✅ EVENTOS PARA COMUNICACIÓN CON EL PADRE
    @Output() dataChange = new EventEmitter<Record<string, unknown>[]>();
    @Output() editItemRequest = new EventEmitter<Record<string, unknown>>();
    @Output() newItemRequest = new EventEmitter<void>();
    @Output() itemSaved = new EventEmitter<Record<string, unknown>>();
    @Output() dialogCanceled = new EventEmitter<void>();
    @Input() displayFields: DynamicField[] = [];            
@Output() deleteItemRequest = new EventEmitter<Record<string, unknown>>();

    // ✅ Propiedades para el manejo del CRUD
    currentItem: Record<string, unknown> = {};
    selectedItems: Record<string, unknown>[] = [];
    fields: DynamicField[] = [];

    componente: ComponentesDTO = {
        id: 21,
        nombreComponente: 'lib-crud',
        version: '1.0'
    };

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private dynamicFieldService: DynamicFieldService,
        private excelExportService: ExcelExportService
    ) {}

    ngOnInit() {
        this.initFields();
    }
initFields() {
    // Inicializar campos dinámicos si no se han generado
    if (this.fields.length === 0) {
        this.fields = this.dynamicFieldService.generateFieldsFromData({
            data: this.data,
            fieldTypeConfig: this.fieldTypeConfig,
            fieldLabels: this.fieldLabels,
            fieldOrder: this.fieldOrder,
            excludeFields: this.excludeFields
        });
        this.displayFields = [...this.fields];
    }

    // 🔹 Filtrar displayFields según excludeFields siempre
    if (this.displayFields?.length) {
        this.displayFields = this.displayFields.filter(
            f => !this.excludeFields.includes(f.key)
        );
    }
}

    // ✅ Método para abrir el diálogo de edición
    editItem(item: Record<string, unknown>) {
        this.editItemRequest.emit(item);
    }

    // ✅ Método para crear un nuevo item
    openNew() {
        this.newItemRequest.emit();
    }

    // ✅ Manejar cuando se guarda un item desde el diálogo
    onItemSaved(savedItem: Record<string, unknown>) {
        this.currentItem = { ...savedItem };

        if (this.currentItem['id']) {
            this.updateExistingItem();
        } else {
            this.createNewItem();
        }
        this.finalizeItemSave();
        this.itemSaved.emit(this.currentItem);
    }

    // ✅ Manejar cuando se cancela el diálogo
    onDialogCanceled() {
        this.currentItem = {};
        this.dialogCanceled.emit();
    }

    // ✅ Eliminar item con confirmación
deleteItem(item: Record<string, unknown>) {
    const itemName = String(item['name'] || 'this item');
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + itemName + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.executeItemsDeletion([item], 1);
            this.deleteItemRequest.emit(item); // ✅ ahora sí llega al padre
        },
    });
}

    // ✅ Eliminar elementos seleccionados con confirmación
deleteSelectedItems() {
    if (!this.selectedItems || this.selectedItems.length === 0) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'No items selected',
            life: 3000,
        });
        return;
    }

    const selectedCount = this.selectedItems.length;
    const itemsToDelete = [...this.selectedItems]; // Copia para emitir
    this.confirmationService.confirm({
        message: `Are you sure you want to delete ${selectedCount} selected item${selectedCount > 1 ? 's' : ''}?`,
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.executeItemsDeletion(itemsToDelete, selectedCount);
            // Emitir al componente padre
            itemsToDelete.forEach(item => this.deleteItemRequest.emit(item));
        },
    });
}


    private executeItemsDeletion(itemsToDelete: Record<string, unknown>[], count: number) {
        const idsToDelete = itemsToDelete.map(item => item['id']);
        this.data = this.data.filter(item => !idsToDelete.includes(item['id']));
        this.selectedItems = [];
        this.dataChange.emit([...this.data]);
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `${count} item${count > 1 ? 's' : ''} deleted`,
            life: 3000,
        });
    }

    // ✅ Métodos privados para actualizar y crear items
    private updateExistingItem() {
        if (!this.currentItem['id']) return;
        
        const index = this.dynamicFieldService.findIndexById(this.data, String(this.currentItem['id']));
        if (index !== -1) {
            this.data[index] = { ...this.currentItem };

            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Item Updated',
                life: 3000,
            });
        }
    }

    private createNewItem() {
        this.currentItem['id'] = this.dynamicFieldService.generateId();
        this.data.push({ ...this.currentItem });

        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Item Created',
            life: 3000,
        });
    }

    // ✅ Método público para procesar el guardado desde el componente padre
    public processItemSave(savedItem: Record<string, unknown>) {
        this.currentItem = { ...savedItem };

        if (this.currentItem['id']) {
            this.updateExistingItem();
        } else {
            this.createNewItem();
        }
        this.finalizeItemSave();
    }

    // ✅ Método público para establecer el item actual desde el componente padre
    public setCurrentItem(item: Record<string, unknown>) {
        this.currentItem = { ...item };
    }

    private finalizeItemSave() {
        this.data = [...this.data];
        this.dataChange.emit([...this.data]); // ✅ Emitir cambios
        this.currentItem = {};
    }

    onViewChange(newView: 'table' | 'grid'): void {
        this.tableType = newView;
    }

    // ✅ Debug: Método para detectar cambios en selectedItems
    onSelectedItemsChange(newSelection: Record<string, unknown>[] | null) {
        this.selectedItems = newSelection || [];
    }

    // ✅ Método para exportar a Excel
    exportToExcel(): void {
        this.excelExportService.exportToExcel({
            data: this.data,
            fieldOrder: this.fieldOrder,
            fieldLabels: this.fieldLabels,
            excludeFields: this.excludeFields,
        });
    }
}