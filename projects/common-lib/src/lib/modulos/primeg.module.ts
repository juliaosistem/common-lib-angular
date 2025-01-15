import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    AutoCompleteModule,
    CascadeSelectModule,
    CheckboxModule,
    EditorModule,
    MenuModule,
    TableModule,
   PaginatorModule,
   InputTextModule,
   PasswordModule,
   RippleModule,
    

  ],
  exports:[
    ButtonModule,
    AutoCompleteModule,
    CascadeSelectModule,
    CheckboxModule,
    EditorModule,
    MenuModule,
    TableModule,
   PaginatorModule,
   InputTextModule,
   PasswordModule,
   RippleModule,
    
    
  ]
})
export class PrimegModule { }
