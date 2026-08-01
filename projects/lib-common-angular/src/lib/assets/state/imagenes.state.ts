/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ImagenDTO, UploadImageRequestDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { QueryParams } from 'juliaositembackenexpress/dist/utils/queryParams';
import { tap } from 'rxjs';
import { GenericCrudHttpService } from '../../componentes/shared/services/generic-crud.service/generic-crud.service';
import { ImagenesService } from '../../services/imagenes.service';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';
import { GenericCrudState, LazyGenericCrudHttpService } from './state-generic/generic-crud.state';

const imagenesCrudActions = createGenericCrudActions<ImagenDTO>('imagenes');

class Upload {
  static readonly type = '[imagenes] UPLOAD';

  constructor(
    public request: UploadImageRequestDTO,
    public queryParams: QueryParams,
  ) {}
}

class ClearLast {
  static readonly type = '[imagenes] CLEAR_LAST';

  constructor() {}
}

export const ImagenesActions = {
  ...imagenesCrudActions,
  Upload,
  ClearLast,
};

@State<PlantillaResponse<ImagenDTO>>({
  name: 'imagenes',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class ImagenesState extends GenericCrudState<ImagenDTO, ImagenDTO> {
  constructor(private imagenesService: ImagenesService) {
    const service = new LazyGenericCrudHttpService<ImagenDTO>('baseUrlImagenes') as unknown as GenericCrudHttpService<ImagenDTO>;
    super(service, ImagenesActions as any);
  }

  /**
   * Retorna la última imagen subida con el endpoint personalizado.
   * @param state Estado de imágenes.
   * @returns ImagenDTO persistida o undefined.
   */
  @Selector()
  static getLastUploaded(state: PlantillaResponse<ImagenDTO>): ImagenDTO | undefined {
    return state.data;
  }

  /**
   * Ejecuta upload personalizado y guarda la respuesta completa en el estado.
   * @param ctx Contexto de estado NGXS.
   * @param action Acción con request + queryParams.
   */
  @Action(ImagenesActions.Upload)
  upload(
    ctx: StateContext<PlantillaResponse<ImagenDTO>>,
    action: InstanceType<typeof Upload>,
  ) {
    return this.imagenesService.upload(action.request, action.queryParams).pipe(
      tap((response) => ctx.setState(response)),
    );
  }

   @Action(ImagenesActions.Delete)
      Delete(ctx: StateContext<PlantillaResponse<ImagenDTO>>, action: any) {
       return this.delete(ctx, action);
      }

  /**
   * Limpia la última imagen subida para evitar reutilización accidental.
   * @param ctx Contexto de estado NGXS.
   */
  @Action(ImagenesActions.ClearLast)
  clearLast(ctx: StateContext<PlantillaResponse<ImagenDTO>>): void {
    const state = ctx.getState();
    ctx.setState({ ...state, data: undefined, message: '', rta: false });
  }
}
