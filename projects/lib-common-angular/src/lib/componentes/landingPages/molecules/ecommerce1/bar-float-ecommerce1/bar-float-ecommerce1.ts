import { Component } from '@angular/core';
import { ComponentesDTO } from '@juliaosistem/core-dtos';
import { PrimegModule } from '../../../../../modulos/primeg.module';

@Component({
  selector: 'lib-bar-float-ecommerce1',
  imports: [PrimegModule],
  templateUrl: './bar-float-ecommerce1.html',
  styleUrl: './bar-float-ecommerce1.scss'
})
export class BarFloatEcommerce1 {

  componente:ComponentesDTO = {
          id: 33,
          nombreComponente: 'lib-bar-float-ecommerce1',
          version: '1.0',
          descripcion: 'Componente para mostrar una barra flotante en la página de ecommerce1'
        }
}
