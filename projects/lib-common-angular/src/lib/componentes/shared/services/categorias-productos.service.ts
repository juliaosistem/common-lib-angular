import { CategoriaDTO, TipoCategoriaDTO } from '@juliaosistem/core-dtos';
import { Injectable } from '@angular/core';
import { LibConfigService } from '../../../config/lib-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImagenDTO } from '@juliaosistem/core-dtos';
import { JuliaoSystemCrudHttpService } from '../../../config/JuliaoSystemCrudHttpService';

@Injectable({
  providedIn: 'root'
})
export class CategoriasProductosService extends JuliaoSystemCrudHttpService<CategoriaDTO,CategoriaDTO>{
  
  
  
  tipoCategorias: TipoCategoriaDTO[] = [{
    id: 1,
    nombreTipoCategoria: 'Castillos'
  },
  {
    id: 2,
    nombreTipoCategoria: 'Toboganes'
  },
  {
    id: 3,
    nombreTipoCategoria: 'Publicitarios'
  },
];

imagenCategoria1: ImagenDTO = {
  id: '1',
  url: 'https://placehold.co/600x600/F5C7A5/000?text=Castillos+Inflables',
  alt: 'Castillos inflables',
  idComponente: 20,
};

imagenCategoria2: ImagenDTO = {
  id: '1',
  url: 'https://placehold.co/600x600/FFFF33/000?text=Mini+Toboganes',
  alt: 'Mini Tobogánes inflables',
  idComponente: 20,
};

categoriaDTO1 : CategoriaDTO = {
  id: '1',
  nombreCategoria: 'Castillos',
  tipoCategoria: this.tipoCategorias[0],
  imagen: this.imagenCategoria1
};

categoriaDTO2 : CategoriaDTO = {
  id: '2',
  nombreCategoria: 'Toboganes',
  tipoCategoria: this.tipoCategorias[1],
  imagen: this.imagenCategoria2
};


categoriasMock: CategoriaDTO[] = [this.categoriaDTO1,this.categoriaDTO2];

       constructor(http: HttpClient, private configService: LibConfigService) {
        super(http);
        const baseUrl = this.configService.get<string>('baseUrlProducts') || 'http://localhost:8080';
        this.basePathUrl = `${baseUrl}/categoria-producto`;
        }

getCategoriasMock(): Observable<CategoriaDTO[]> {
    return new Observable<CategoriaDTO[]>(observer => {
        observer.next(this.categoriasMock);
        observer.complete();
    });
}

}