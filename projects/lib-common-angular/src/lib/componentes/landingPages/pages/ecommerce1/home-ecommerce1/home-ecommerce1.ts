import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { HeroSectionEcommerce1 } from "../../../molecules/ecommerce1/hero-section-ecommerce1/hero-section-ecommerce1";
import { SectionFiltersCategoriesProductos } from "../../../../shared/molecules/section-filters-categories-productos/section-filters-categories-productos";
import { CategoriaDTO, ComponentesDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { CardProductos1Component } from "../../../../../../public-api";
import { SectionImagesInstagramEcommerce1 } from '../../../molecules/ecommerce1/section-images-instagram-ecommerce1/section-images-instagram-ecommerce1';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';

@Component({
  selector: 'lib-home-ecommerce1',
  imports: [
    HeroSectionEcommerce1, SectionFiltersCategoriesProductos, 
   CardProductos1Component, SectionImagesInstagramEcommerce1
          ],
  templateUrl: './home-ecommerce1.html',
  styleUrl: './home-ecommerce1.scss'
})
export class HomeEcommerce1 implements OnInit, OnDestroy {

  // Metadata del componente    
  componente: ComponentesDTO = {
    id: 28,
    nombreComponente: 'lib-home-ecommerce1',
    version: '1.0',
    descripcion: 'Componente para mostrar home de ecommerce1'
  }

  // Observables de state
  productos$!: Observable<PlantillaResponse<ProductoDTO>>;
  categorias$!: Observable<PlantillaResponse<CategoriaDTO>>;

  // El usuario inicio sesion o no
  @Input() isLogin: boolean = false;

  // Productos y categorías locales
  Products: ProductoDTO[] = [];
  Categorias: CategoriaDTO[] = [];

  private subscriptions = new Subscription();

  constructor(private store: Store) {
    // Inicializar observables usando store.select
    this.productos$ = this.store.select(state => state.productos);
    this.categorias$ = this.store.select(state => state.categoriasProductos);
  }

  ngOnInit() {
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private setupSubscriptions() {
    // Suscribirse a los cambios en el state
    this.subscriptions.add(
      this.productos$.subscribe(response => {
        if (response?.rta && response.dataList) {
          this.Products = response.dataList;
        }
      })
    );

    this.subscriptions.add(
      this.categorias$.subscribe(response => {
        if (response?.rta && response.dataList) {
          this.Categorias = response.dataList;
        }
      })
    );
  }
}
