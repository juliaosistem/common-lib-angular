import { Component, Input, OnInit,  ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product, ProductService } from '../../../../../../../lib-common-angular-demo/src/app/core/services/product.service';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { Tabla1Component } from '../../molecules/tabla1/tabla1.component';
import { ToolBar1Component } from '../../molecules/tool-bar1/tool-bar1.component';
import { Menu } from 'primeng/menu';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/tablaDataSharedDTO';


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
    ],
     templateUrl: './crud.component.html',
     providers: [MessageService, ProductService, ConfirmationService]
})
   
export class Crud implements OnInit {
    productDialog: boolean = false;

    submitted: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input()  tablaDataSharedDTO: TablaDataSharedDTO<Menu, any> = new TablaDataSharedDTO<Menu, Product>();

    @ViewChild('dt') dt!: Table;

    

    public cargado :boolean = false;

    constructor(
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
       
            this.tablaDataSharedDTO.data.data=this.productService.getProducts();
            

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
                this.tablaDataSharedDTO.data.dataList =this.tablaDataSharedDTO.data.dataList
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((val:any) => !this.tablaDataSharedDTO.selectedItems.includes(val));
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
        let index = -1;
        for (let i = 0; i < this.tablaDataSharedDTO?.data.dataList.length; i++) {
            if (this.tablaDataSharedDTO?.data.dataList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
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
