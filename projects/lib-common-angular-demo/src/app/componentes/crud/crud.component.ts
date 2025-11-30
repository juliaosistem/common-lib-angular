import { Component,OnInit, ViewChild } from '@angular/core';
import { Crud, CrudDialog1Component, ProductDialog1Component } from 'lib-common-angular';
import { FieldType } from '@juliaosistem/core-dtos';
import { Product } from '../../core/services/product.service';
import { Table } from 'primeng/table';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/tablaDataSharedDTO';

import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-crud',
  imports: [CrudDialog1Component, ProductDialog1Component,Crud], 
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss',
  standalone: true,
  providers: [] // Sin providers específicos por ahora

})
export class CrudComponent implements  OnInit {

    productDialog: boolean = false;
    submitted: boolean = false;
    showDialog: boolean = false;
    dialogCurrentItem: Record<string, unknown> = {};
    dialogDisplayFields: unknown[] = [];
dialogFieldSelectOptions: Record<string, { label: string; value: string }[]> = {};

// aqui tienes q implementar la logica para el crud 
// traerte los servicios de la libreria
// y el crud.ts solo debe entender lo generico
 @ViewChild('dt') dt!: Table;
 loaded :boolean = false;

 // ✅ Propiedad para controlar el tipo de vista
 tableType: 'table' | 'grid' = 'table';

 tablaDataSharedDTO: TablaDataSharedDTO<Menu, Product> = new TablaDataSharedDTO<Menu, Product>();
  
 constructor(
         
      ) {}

  exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
this.loaded = false;
    }

    // ✅ Datos dinámicos de ejemplo
    data: Record<string, unknown>[] = [
        {
            id: '1',
            name: 'Laptop Gaming Pro',
            description: 'High-performance gaming laptop with advanced graphics',
            inventoryStatus: 'INSTOCK',
            category: 'Electronics',
            price: 1299.99,
            quantity: 25,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
        },
        {
            id: '2',
            name: 'Wireless Headphones',
            description: 'Premium noise-canceling wireless headphones',
            inventoryStatus: 'LOWSTOCK',
            category: 'Electronics',
            price: 199.99,
            quantity: 8,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
        },
        {
            id: '3',
            name: 'Running Shoes',
            description: 'Comfortable running shoes for daily exercise',
            inventoryStatus: 'INSTOCK',
            category: 'Fitness',
            price: 89.99,
            quantity: 50,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
        },
        {
            id: '4',
            name: 'Cotton T-Shirt',
            description: 'Premium cotton t-shirt with modern fit',
            inventoryStatus: 'OUTOFSTOCK',
            category: 'Clothing',
            price: 29.99,
            quantity: 0,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'
        },
        {
            id: '5',
            name: 'Leather Wallet',
            description: 'Genuine leather wallet with multiple compartments',
            inventoryStatus: 'INSTOCK',
            category: 'Accessories',
            price: 49.99,
            quantity: 15,
            image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop'
        }
    ];

    // ✅ Configuración de tipos para cada campo
    fieldTypeConfig: Record<string, FieldType> = {
        name: 'text',
        description: 'text',
        inventoryStatus: 'select',
        category: 'select',
        price: 'number',
        quantity: 'number',
        image: 'img'
    };

    // ✅ Configuración de opciones para campos de tipo select
fieldSelectOptions: Record<string, { label: string; value: string }[]> = {
    inventoryStatus: [
        { label: 'INSTOCK', value: 'INSTOCK' },
        { label: 'LOWSTOCK', value: 'LOWSTOCK' },
        { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' }
    ],
    category: [
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Clothing', value: 'Clothing' },
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Fitness', value: 'Fitness' }
    ]
};

private mapSelectOptions(options: Record<string, string[]>): Record<string, { label: string; value: string }[]> {
  const mapped: Record<string, { label: string; value: string }[]> = {};
  Object.keys(options).forEach(key => {
    mapped[key] = options[key].map(opt => ({ label: opt, value: opt }));
  });
  return mapped;
}

    // ✅ Etiquetas personalizadas
    fieldLabels: Record<string, string> = {
        name: 'Name',
        description: 'Description',
        inventoryStatus: 'Inventory Status',
        category: 'Category',
        price: 'Price',
        quantity: 'Quantity',
        image: 'Image'
    };
    
   

    // ✅ Orden personalizado de columnas
    fieldOrder: string[] = [
        'name',
        'description',
        'image',
        'inventoryStatus',
        'category',
        'price',
        'quantity'
    ];

    // ✅ Campos a excluir de la vista
    excludeFields: string[] = ['id'];

    // ✅ Método para recibir cambios de datos del componente CRUD
    onDataChanged(updatedData: Record<string, unknown>[]) {
        this.data = [...updatedData]; // Actualizar la data local
    }

    // ✅ Métodos para manejar los eventos del dialog
  onEditItemRequest(item: Record<string, unknown>) {
    this.dialogCurrentItem = { ...item };
    this.dialogDisplayFields = this.createDisplayFields();
this.dialogFieldSelectOptions = this.fieldSelectOptions;
    this.showDialog = true;
}

    onNewItemRequest() {
    this.dialogCurrentItem = {};
    this.dialogDisplayFields = this.createDisplayFields();
this.dialogFieldSelectOptions = this.fieldSelectOptions;
    this.showDialog = true;
}

    onDialogSave(savedItem: Record<string, unknown>) {
        // Procesar el guardado localmente por ahora
        if (savedItem['id']) {
            // Actualizar item existente
            const index = this.data.findIndex(item => item['id'] === savedItem['id']);
            if (index !== -1) {
                this.data[index] = { ...savedItem };
            }
        } else {
            // Crear nuevo item
            savedItem['id'] = Date.now().toString(); // ID temporal
            this.data.push({ ...savedItem });
        }
        this.data = [...this.data]; // Trigger change detection
        this.showDialog = false;
    }

    onDialogCancel() {
        this.showDialog = false;
        this.dialogCurrentItem = {};
    }

    onDialogCanceled() {
        this.showDialog = false;
    }

    onItemSaved() {
        // Método llamado cuando el CRUD confirma que se guardó el item
        this.showDialog = false;
    }

    // ✅ Métodos para manejar el ProductDialog1Component
    onProductSave(product: unknown) {
        // Convertir el producto a Record<string, unknown> y procesarlo
        const productItem = product as Record<string, unknown>;
        this.onDialogSave(productItem);
    }

    onProductCancel() {
        this.onDialogCancel();
    }

    private createDisplayFields() {
        // Crear los campos de display basados en la configuración
        return this.fieldOrder.map(fieldKey => ({
            key: fieldKey,
            type: this.fieldTypeConfig[fieldKey] || 'text',
            label: this.fieldLabels[fieldKey] || fieldKey,
            value: '',
            required: false,
            visible: !this.excludeFields.includes(fieldKey)
        })).filter(field => field.visible);
    }
}
