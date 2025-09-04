import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-section-header-forms-login-ecomerce1',
  imports: [],
  templateUrl: './section-header-forms-login-ecomerce1.html',
  styleUrl: './section-header-forms-login-ecomerce1.scss'
})
export class SectionHeaderFormsLoginEcomerce1 {

  @Input() titulo: string = '';
  @Input() subtitulo: string ='';
}
