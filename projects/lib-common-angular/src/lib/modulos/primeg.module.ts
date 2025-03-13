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
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


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
   ToastModule,
   ToolbarModule,
   RatingModule,
   TextareaModule,
   SelectModule,
   RadioButtonModule,
   InputNumberModule,
   DialogModule,
   TagModule,
   InputIconModule,
   IconFieldModule,
   ConfirmDialogModule

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
   ToastModule,
   ToolbarModule,
   RatingModule,
   TextareaModule,
   SelectModule,
   RadioButtonModule,
   InputNumberModule,
   DialogModule,
   TagModule,
   InputIconModule,
   IconFieldModule,
   ConfirmDialogModule
  ]
})
export class PrimegModule { }
