import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoriaDTO, ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-section-filters-categories-productos',
  imports: [CommonModule],
  templateUrl: './section-filters-categories-productos.html',
  styleUrl: './section-filters-categories-productos.scss'
})
export class SectionFiltersCategoriesProductos {

  // Metadata del componente    
    componente: ComponentesDTO = {
      id: 29,
      nombreComponente: 'lib-section-filters-categories-productos',
      version: '1.0',
      descripcion: 'Componente para mostrar filtros de categorias y productos'
    }

    // Categorias a mostrar
    @Input() categorias: CategoriaDTO[] = [];
    @Input() titleComponent: string = "Todos Las Categorias";

    @Output() categorySelected: EventEmitter<string> = new EventEmitter<string>();

    selectedCategory = 'all';

    selectCategory(category: string): void {
      this.selectedCategory = category;
      this.categorySelected.emit(category);
    }

}
