import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-paginator-pg',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet, PaginatorModule, PrimegModule],
  templateUrl: './paginator-pg.html',
})
export class PaginatorPgComponent {


     componente: ComponentesDTO = {
        id: 36,
        nombreComponente: 'lib-paginator-pg',
        version: '1.0',
        descripcion: 'Componente paginador personalizado echo en primeng'
      };
    
  // datos para paginación
  @Input() data: unknown[] = [];
  // número total de registros por página
  @Input() rows = 10;

  // opciones de filas por página
  @Input() rowsPerPageOptions: number[] = [10, 20, 50];

  // habilitar/deshabilitar paginador
  @Input() showCurrentPageReport = true;

    // plantilla para el reporte de página
  @Input() currentPageReportTemplate = 'Mostrando {first} a {last} de {totalRecords} ítems';

  // Template para renderizar los ítems (se recibe desde el padre)
  @Input() itemTemplate!: TemplateRef<unknown>;

  first = 0;

  onPage(event: { first?: number; rows?: number; page?: number; pageCount?: number }) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
  }
}
