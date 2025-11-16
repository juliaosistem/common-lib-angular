import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ecommerce1 ,ProductosActions,CategoriasActions} from 'lib-common-angular';
import { Observable, Subscription } from 'rxjs';
import { ProductoDTO,CategoriaDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/src/utils/PlantillaResponse';
import { Store } from '@ngxs/store';


@Component({
  selector: 'app-login',
  imports: [Ecommerce1],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit, OnDestroy  {

  // Observables de state (nueva sintaxis sin @Select deprecado)
  productos$!: Observable<PlantillaResponse<ProductoDTO>>;
  categorias$!: Observable<PlantillaResponse<CategoriaDTO>>;

  // Datos para pasar a los componentes
  productos: ProductoDTO[] = [];
  categorias: CategoriaDTO[] = [];
  isLogin: boolean = false;
  loading: boolean = true;

  private subscriptions = new Subscription();

  constructor(private store: Store) { 
    // Inicializar observables usando store.select con string path (nueva forma recomendada)
    
  }

  ngOnInit() {
    this.setupSubscriptions();
    this.loadMockData();
    this.productos$ = this.store.select(state => state.productos);
    this.categorias$ = this.store.select(state => state.categoriasProductos);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private setupSubscriptions() {
    // Suscribirse a cambios en productos
    this.subscriptions.add(
      this.productos$.subscribe(response => {
        if (response?.rta && response.dataList) {
          this.productos = response.dataList;
          this.checkLoadingComplete();
        }
      })
    );

    // Suscribirse a cambios en categorías
    this.subscriptions.add(
      this.categorias$.subscribe(response => {
        if (response?.rta && response.dataList) {
          this.categorias = response.dataList;
          this.checkLoadingComplete();
        }
      })
    );
  }

  private loadMockData() {
    // Despachar acciones para cargar datos mock
    this.store.dispatch(new ProductosActions.LoadMock());
    this.store.dispatch(new CategoriasActions.LoadMock());
  }

  private checkLoadingComplete() {
    // El loading se completa cuando ambos arrays tienen datos
    if (this.productos.length > 0 && this.categorias.length > 0) {
      this.loading = false;
    }
  }

  // Método para simular login
  onLogin() {
    this.isLogin = !this.isLogin;
  }

}
