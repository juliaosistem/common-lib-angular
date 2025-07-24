// En crud.ts - Agregar las propiedades para el sistema dinámico
import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Menu } from 'primeng/menu';

import { PrimegModule } from '../../../../modulos/primeg.module';
import { Tabla1Component } from '../../molecules/tabla1/tabla1.component';
import { Grid1Component } from '../../molecules/grid1/grid1.component';
import { ToolBar1Component } from '../../molecules/tool-bar1/tool-bar1.component';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/tablaDataSharedDTO';
import { Product } from '../../services/product.service';

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
    @Input() productDialog: boolean = false;
    @Input() submitted: boolean = false;
    @Input() tablaDataSharedDTO: TablaDataSharedDTO<Menu, Product> = new TablaDataSharedDTO<Menu, Product>();
    @Input() cargado: boolean = false;
    @Input() tableType: 'table' | 'grid' = 'table';

    // ✅ Datos dinámicos de ejemplo
    misDatos: Record<string, unknown>[] = [
        {
            id: '1',
            name: 'Laptop Gaming Asus',
            price: 1299.99,
            category: 'Electronics',
            available: true,
            image: 'laptop.jpg',
            description: 'Powerful gaming laptop with RTX 4060',
            rating: 4.5,
            brand: 'Asus',
            warranty: true,
            weight: 2.3,
            color: 'Black'
        },
        {
            id: '2',
            name: 'Mouse Logitech G502',
            price: 79.99,
            category: 'Accessories',
            available: false,
            image: 'mouse.jpg',
            description: 'High precision gaming mouse',
            rating: 4.8,
            brand: 'Logitech',
            warranty: true,
            weight: 0.12,
            color: 'Black'
        },
        {
            id: '3',
            name: 'Mechanical Keyboard',
            price: 159.99,
            category: 'Accessories',
            available: true,
            image: 'keyboard.jpg',
            description: 'RGB mechanical keyboard with cherry switches',
            rating: 4.3,
            brand: 'Corsair',
            warranty: false,
            weight: 1.2,
            color: 'RGB'
        }
    ];

    // ✅ Configuración de tipos para cada campo
    fieldTypeConfig: Record<string, FieldType> = {
        name: 'text',
        price: 'number',
        category: 'text',
        available: 'checkbox',
        image: 'img',
        description: 'text',
        rating: 'number',
        brand: 'text',
        warranty: 'checkbox',
        weight: 'number',
        color: 'text'
    };

    // ✅ Etiquetas personalizadas
    fieldLabels: Record<string, string> = {
        name: 'Product Name',
        price: 'Price ($)',
        category: 'Category',
        available: 'In Stock',
        image: 'Product Image',
        description: 'Description',
        rating: 'Rating (⭐)',
        brand: 'Brand',
        warranty: 'Has Warranty',
        weight: 'Weight (kg)',
        color: 'Color'
    };

    // ✅ Orden personalizado de columnas
    fieldOrder: string[] = [
        'name',
        'description',
        'image', 
        'price',
        'brand',
        'category',
        'available',
        'warranty',
        'rating',
        'weight',
        'color',
        
    ];

    // Título de la tabla
    tableTitle: string = 'Product List';

    // ✅ Campos a excluir de la vista
    excludeFields: string[] = ['id'];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    onViewChange(newView: 'table' | 'grid'): void {
        this.tableType = newView;
    }
}