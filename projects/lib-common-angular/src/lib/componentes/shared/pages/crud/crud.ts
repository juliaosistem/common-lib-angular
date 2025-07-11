import { Component, OnInit,  ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product, ProductService } from '../../../../core/product.service';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { Tabla1Component } from '../../molecules/tabla1/tabla1.component';
import { ToolBar1Component } from '../../molecules/tool-bar1/tool-bar1.component';

interface Column {
    id: number;
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

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

    products : Product[]=[];

    product!: Product;

    selectedProducts: Product[] =[];

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    public cargado :boolean = false;

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
       
            this.products=this.productService.getProducts();
            

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { id: 1, field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { id: 2, field: 'name', header: 'Name' },
            { id: 3, field: 'image', header: 'Image' },
            { id: 4, field: 'price', header: 'Price' },
            { id: 5, field: 'category', header: 'Category' },
            { id: 6, field: 'rating', header: 'Reviews' },
            { id: 7, field: 'status', header: 'Status' },
            { id: 8, field: 'edition', header: 'Edition' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    this.cargado = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products =this.products
              .filter((val) => !this.selectedProducts?.includes(val));
                this.selectedProducts = [];
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
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
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


    saveProduct() {
        this.submitted = true;
        let _products = this.products;
        if (this.product.name?.trim()) {
            if (this.product.id) {
                _products[this.findIndexById(this.product.id)] = this.product;
                this.products =([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                this.products=([..._products, this.product]);
            }

            this.productDialog = false;
            this.product = {};
        }
    }
}
