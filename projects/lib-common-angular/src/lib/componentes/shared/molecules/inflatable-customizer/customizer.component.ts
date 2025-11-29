import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PrimegModule } from '../../../../modulos/primeg.module';

// MODELOS
export interface Inflatable {
  id: number;
  name: string;
  parts: number; // cantidad de partes para colorear
  basePrice: number;
}

export interface Accessory {
  id: string;
  name: string;
  price: number;
  requiresText?: boolean;
  customText?: string;
}

export interface Project {
  id: number;
  product: Inflatable;
  partColors: { [key: number]: string }; // índice de parte -> color
  accessories: Accessory[];
  totalPrice: number;
}

@Component({
  selector: 'lib-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimegModule, ButtonModule, CheckboxModule],
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.scss']
})
export class CustomizerComponent {
  @Input() project!: Project;
  @Output() save = new EventEmitter<Project>();

  selectedColor!: string;
  selectedPart!: number;



  ///datos de pruebas
  COLORS = [
    { name: 'Rojo Fuego', hex: '#EF4444' },
    { name: 'Azul Cielo', hex: '#3B82F6' },
    { name: 'Verde Lima', hex: '#84CC16' },
    { name: 'Amarillo Sol', hex: '#EAB308' },
    { name: 'Morado Real', hex: '#A855F7' },
    { name: 'Naranja Vivo', hex: '#F97316' },
    { name: 'Rosa Chicle', hex: '#EC4899' },
    { name: 'Negro Clásico', hex: '#1F2937' },
  ];

  ///datos de pruebas

  ACCESSORIES: Accessory[] = [
    { id: 'malla_puerta', name: 'Malla en puerta', price: 50000 },
    { id: 'mallas_laterales', name: 'Mallas laterales', price: 120000 },
    { id: 'colchon_anterior', name: 'Colchón anterior', price: 350000 },
    { id: 'cremallera_adicional', name: 'Cremallera adicional', price: 45000 },
    { id: 'otro', name: 'Otros (Especificar)', price: 0, requiresText: true }
  ];

  selectPart(index: number) {
    this.selectedPart = index;
    this.selectedColor = this.project.partColors[index] || '';
  }

  applyColor() {
    if (this.selectedPart != null && this.selectedColor) {
      this.project.partColors[this.selectedPart] = this.selectedColor;
      this.updatePrice();
    }
  }

  toggleAccessory(acc: Accessory) {
    const exists = this.project.accessories.find(a => a.id === acc.id);
    if (exists) {
      this.project.accessories = this.project.accessories.filter(a => a.id !== acc.id);
    } else {
      this.project.accessories.push({ ...acc });
    }
    this.updatePrice();
  }

  isAccessorySelected(acc: Accessory) {
    return !!this.project.accessories.find(a => a.id === acc.id);
  }

  updatePrice() {
    const accTotal = this.project.accessories.reduce((sum, a) => sum + a.price, 0);
    this.project.totalPrice = this.project.product.basePrice + accTotal;
  }

  saveProject() {
    this.save.emit(this.project);
  }
}
