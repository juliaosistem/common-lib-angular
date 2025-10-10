import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-prueba1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2>Prueba1 funciona</h2>
      <p>Componente básico de prueba renderizado correctamente.</p>
    </div>
  `,
  styles: [`
    .p-4 { padding: 1rem; }
    h2 { margin: 0 0 .5rem; }
  `]
})
export class Prueba1 {}
