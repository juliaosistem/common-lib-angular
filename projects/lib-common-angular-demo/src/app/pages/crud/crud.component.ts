import { Component,OnInit, ViewChild } from '@angular/core';
import { Crud, FieldType } from 'lib-common-angular';
import { Product, ProductService } from '../../core/services/product.service';
import { Table } from 'primeng/table';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/tablaDataSharedDTO';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-crud',
  imports: [Crud], 
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss'

})
export class CrudComponent implements  OnInit {

    productDialog: boolean = false;

    submitted: boolean = false;

// aqui tienes q implementar la logica para el crud 
// traerte los servicios de la libreria
// y el crud.ts solo debe entender lo generico
 @ViewChild('dt') dt!: Table;
 loaded :boolean = false;

 // ✅ Propiedad para controlar el tipo de vista
 tableType: 'table' | 'grid' = 'table';

 tablaDataSharedDTO: TablaDataSharedDTO<Menu, Product> = new TablaDataSharedDTO<Menu, Product>();
  
 constructor(
          private productService: ProductService,
          private messageService: MessageService,
          private confirmationService: ConfirmationService
      ) {}

  exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
/* 
        this.tablaDataSharedDTO.data.dataList = this.productService.getProducts();

        this.tablaDataSharedDTO.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.tablaDataSharedDTO.cols = [
            { id: 1, field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { id: 2, field: 'name', header: 'Name' },
            { id: 3, field: 'image', header: 'Image' },
            { id: 4, field: 'price', header: 'Price' },
            { id: 5, field: 'category', header: 'Category' },
            { id: 6, field: 'rating', header: 'Reviews' },
            { id: 7, field: 'status', header: 'Status' },
            { id: 8, field: 'edition', header: 'Edition' }
        ];

        this.tablaDataSharedDTO.exportColumns = this.tablaDataSharedDTO.cols.map((col) => ({ title: col.header, dataKey: col.field }));
     */this.loaded = false;
    }

    // ✅ Datos dinámicos de ejemplo
    data: Record<string, unknown>[] = [
        {
            id: '1',
            name: 'Laptop Gaming Asus',
            price: 1299.99,
            category: 'Gaming',
            available: true,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop&crop=center',
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
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop&crop=center',
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
            category: 'Gaming',
            available: true,
            image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop&crop=center',
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
        category: 'select',
        available: 'checkbox',
        image: 'img',
        description: 'text',
        rating: 'number',
        brand: 'select',
        warranty: 'checkbox',
        weight: 'number',
        color: 'select'
    };

    // ✅ Configuración de opciones para campos de tipo select
    fieldSelectOptions: Record<string, string[]> = {
        category: ['Electronics', 'Accessories', 'Gaming', 'Office', 'Software'],
        brand: ['Asus', 'Logitech', 'Corsair', 'Razer', 'HP', 'Dell', 'Apple'],
        color: ['Black', 'White', 'Silver', 'Red', 'Blue', 'RGB', 'Multi-color']
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

    // ✅ Campos a excluir de la vista
    excludeFields: string[] = ['id'];

    // ✅ Método para recibir cambios de datos del componente CRUD
    onDataChanged(updatedData: Record<string, unknown>[]) {
        console.log('Data changed:', updatedData);
        this.data = [...updatedData]; // Actualizar la data local
    }
}
