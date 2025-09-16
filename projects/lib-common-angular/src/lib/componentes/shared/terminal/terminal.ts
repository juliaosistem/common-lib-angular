import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import Prism from 'prismjs';
// Importa los lenguajes que quieras usar
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';

@Component({
  selector: 'lib-terminal',
  imports: [],
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss'
})
export class Terminal implements AfterViewInit {
   @Input() code: string = '';
  @Input() language: string = 'typescript';
  @ViewChild('codeElement') codeElement!: ElementRef;

  ngAfterViewInit() {
    Prism.highlightElement(this.codeElement.nativeElement);
  }

  copyCode() {
    navigator.clipboard.writeText(this.code).then(() => {
      alert('✅ Código copiado al portapapeles');
    });
  }
}
