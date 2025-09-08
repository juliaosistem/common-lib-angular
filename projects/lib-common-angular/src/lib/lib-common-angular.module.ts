import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibConfigModule } from './config/lib-config.module';

@NgModule({
  imports: [
    CommonModule,
    LibConfigModule
  ],
  exports: [
    LibConfigModule
  ]
})
export class LibCommonAngularModule { }