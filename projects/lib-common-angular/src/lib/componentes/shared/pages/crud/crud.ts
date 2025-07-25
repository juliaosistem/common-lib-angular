// En crud.ts - Agregar las propiedades para el sistema dinámico
import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrimegModule } from '../../../../modulos/primeg.module';
import { Tabla1Component } from '../../molecules/tabla1/tabla1.component';
import { Grid1Component } from '../../molecules/grid1/grid1.component';
import { ToolBar1Component } from '../../molecules/tool-bar1/tool-bar1.component';

// ✅ Importar los tipos del sistema dinámico
import { FieldType } from '../../interfaces/dynamic-field.interface';

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
export class Crud {
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
    @Input() fieldSelectOptions: Record<string, string[]> = {}; // Opciones para

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    onViewChange(newView: 'table' | 'grid'): void {
        this.tableType = newView;
    }
}