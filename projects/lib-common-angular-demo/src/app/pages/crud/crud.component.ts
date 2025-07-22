import { Component,OnInit, ViewChild } from '@angular/core';
import { Crud } from 'lib-common-angular';
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
 cargado :boolean = false;

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
    this.cargado = false;
    }

    // ✅ Método para cambiar entre tabla y grid
    toggleViewType(): void {
        this.tableType = this.tableType === 'table' ? 'grid' : 'table';
    }

    // ✅ Método para establecer el tipo de vista específico
    setViewType(type: 'table' | 'grid'): void {
        this.tableType = type;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.tablaDataSharedDTO.data = {};
        this.submitted = false;
        this.productDialog = true;
    }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    editProduct(product: any) {
        this.tablaDataSharedDTO.data.data = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tablaDataSharedDTO.data.dataList = this.tablaDataSharedDTO.data.dataList?.filter((val: Product) => !this.tablaDataSharedDTO.selectedItems.includes(val));
                this.tablaDataSharedDTO.selectedItems = [];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        return (
        this.tablaDataSharedDTO?.data.dataList?.findIndex(
            (item) => item.id === id,
        ) ?? -1
        );
    }

    createId(): string {
        let id = '';
        const chars:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    // esto Toca implementarlo genericamente con estados se hace el dispacth de la accion

    // saveProduct() {
    //     this.submitted = true;
    //     let _products = this.this.tablaDataSharedDTO?.data.dataList;
    //     if (this.this.tablaDataSharedDTO?.data.name?.trim()) {
    //         if (this.product.id) {
    //             _products[this.findIndexById(this.product.id)] = this.product;
    //             this.products =([..._products]);
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Product Updated',
    //                 life: 3000
    //             });
    //         } else {
    //             this.product.id = this.createId();
    //             this.product.image = 'product-placeholder.svg';
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Product Created',
    //                 life: 3000
    //             });
    //             this.products=([..._products, this.product]);
    //         }

    //         this.productDialog = false;
    //         this.product = {};
    //     }
    // }
      
}
