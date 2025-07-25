// En crud.ts - Agregar las propiedades para el sistema dinámico
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrimegModule } from '../../../../modulos/primeg.module';
import { Tabla1Component } from '../../molecules/tabla1/tabla1.component';
import { Grid1Component } from '../../molecules/grid1/grid1.component';
import { ToolBar1Component } from '../../molecules/tool-bar1/tool-bar1.component';
import { CrudDialog1Component } from '../../molecules/crud-dialog1/crud-dialog1.component';

// ✅ Importar los tipos del sistema dinámico
import { FieldType, DynamicField } from '../../interfaces/dynamic-field.interface';
import { DynamicFieldService } from '../../services/dynamic-field.service';

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
        Grid1Component,
        CrudDialog1Component
    ],
    templateUrl: './crud.component.html',
    providers: [MessageService, ConfirmationService]
})
export class Crud implements OnInit {
    @Input() showDialog: boolean = false;
    @Input() submitted: boolean = false;
    @Input() loaded: boolean = false;
    @Input() tableType: 'table' | 'grid' = 'table';
    @Input() tableTitle: string = 'Table Title'; 
    @Input() data: Record<string, unknown>[] = [];
    @Input() fieldTypeConfig: Record<string, FieldType> = {}; // Configuración de tipos de campo
    @Input() fieldLabels: Record<string, string> = {};        // Etiquetas personal
    @Input() fieldOrder: string[] = [];                       // Orden de columnas
    @Input() excludeFields: string[] = ['id'];                // Campos a excluir
    @Input() fieldSelectOptions: Record<string, string[]> = {}; // Opciones para campos select

    // ✅ Propiedades para el manejo del CRUD
    itemDialog: boolean = false;
    currentItem: Record<string, unknown> = {};
    selectedItems: Record<string, unknown>[] = [];
    fields: DynamicField[] = [];
    displayFields: DynamicField[] = [];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private dynamicFieldService: DynamicFieldService
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
    }

    // ✅ Método para abrir el diálogo de edición
    editItem(item: Record<string, unknown>) {
        this.currentItem = { ...item };
        this.itemDialog = true;
    }

    // ✅ Método para crear un nuevo item
    openNew() {
        this.currentItem = {};
        this.itemDialog = true;
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
    }

    // ✅ Manejar cuando se cancela el diálogo
    onDialogCanceled() {
        this.itemDialog = false;
        this.currentItem = {};
    }

    // ✅ Eliminar item con confirmación
    deleteItem(item: Record<string, unknown>) {
        const itemName = String(item['name'] || 'this item');
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + itemName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.data = this.data.filter((val) => val['id'] !== item['id']);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Item Deleted',
                    life: 3000,
                });
            },
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

    private finalizeItemSave() {
        this.data = [...this.data];
        this.itemDialog = false;
        this.currentItem = {};
    }

    onViewChange(newView: 'table' | 'grid'): void {
        this.tableType = newView;
    }
}