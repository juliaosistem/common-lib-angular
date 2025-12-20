import {
  Component,
  Input,
  Type,
  ViewChild,
  ViewContainerRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DocProp {
  name: string;
  type?: string;
  description?: string;
}

@Component({
  selector: 'lib-crud-doc',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="doc-container">

      <!-- Header -->
      <header>
        <h2> {{ title }}</h2>
        <p>{{ description }}</p>
      </header>

      <!-- Inputs -->
      <section *ngIf="inputsDocs?.length">
        <h3>Inputs</h3>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Propiedad</th>
              <th>Tipo</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let input of inputsDocs">
              <td><code>{{ input.name }}</code></td>
              <td><code>{{ input.type || 'any' }}</code></td>
              <td>{{ input.description }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Outputs -->
      <section *ngIf="outputsDocs?.length">
        <h3>Outputs</h3>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Tipo</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let output of outputsDocs">
              <td><code>{{ output.name }}</code></td>
              <td><code>{{ output.type }}</code></td>
              <td>{{ output.description }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Ejemplo de uso -->
      <section *ngIf="exampleCode">
        <h3>Ejemplo de uso</h3>
        <pre><code>{{ exampleCode }}</code></pre>
      </section>

      <!-- Demo interactiva -->
      <section>
        <h3>Demo interactiva</h3>
        <ng-template #demoContainer></ng-template>
      </section>

    </div>
  `,
  styles: [`
    .doc-container { padding: 20px; background: #fafafa; border-radius: 8px; border: 1px solid #ddd; font-family: sans-serif; }
    h2, h3 { margin-top: 16px; margin-bottom: 8px; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
    .doc-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .doc-table th, .doc-table td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
    .doc-table th { background: #f1f1f1; }
    pre { background: #272822; color: #f8f8f2; padding: 12px; border-radius: 6px; overflow-x: auto; }
  `]
})
export class CrudDocComponent implements AfterViewInit {
  /** Componente que se mostrará en el demo interactivo */
  @Input({ required: true }) component!: Type<any>;

  /** Información de la documentación */
  @Input() title = '';
  @Input() description = '';
  @Input() exampleCode = '';
  @Input() inputsDocs: DocProp[] = [];
  @Input() outputsDocs: DocProp[] = [];

  /** Inputs y outputs para el demo dinámico */
  @Input() demoInputs: Record<string, any> = {};
  @Input() demoOutputs: Record<string, (value?: any) => void> = {};

  @ViewChild('demoContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  ngAfterViewInit(): void {
    if (!this.component) return;

    const cmpRef = this.container.createComponent(this.component);

    // Asignar inputs dinámicos
    Object.entries(this.demoInputs).forEach(([key, value]) => {
      cmpRef.setInput(key, value);
    });

    // Suscribirse a outputs dinámicos
    Object.entries(this.demoOutputs).forEach(([key, handler]) => {
      const emitter = (cmpRef.instance as any)[key];
      if (emitter?.subscribe) emitter.subscribe(handler);
    });
  }
}
