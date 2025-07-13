import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/TablaDataSharedDTO';


export class Tabla1StateModel<M = unknown, RES = unknown> {
  public tableData: TablaDataSharedDTO<M, RES>;

  constructor(init?: Partial<TablaDataSharedDTO<M, RES>>) {
    this.tableData = {
      isAdd: false,
      isEdit: false,
      isDelete: false,
      isWhatsapp: false,
      isExportExcel: false,
      isExportPdf: false,
      isImportExcel: false,
      isImportPdf: false,
      isPersonalizedButton: false,
      isCheck: false,
      itemsPersonalized: [],
      selectedItem:  null,
      data: null,
      statuses: [],
      exportColumns: [],
      cols: [],
      ...init
    };
  }
}


@State<Tabla1StateModel>({
  name: 'tabla1',
  defaults: new Tabla1StateModel()
})
@Injectable()
export class Tabla1State {
  // SELECTOR: Obtener todos los datos del estado
 @Selector()
  static getTableData(state: Tabla1StateModel) {
    return state.tableData;
  } 

  // SELECTOR: Obtener solo los datos principales (RES)
  @Selector()
  static getData(state: Tabla1StateModel) {
    return state.tableData.data;
  }

 

 

  // MÉTODO: Para obtener el estado completo (desde un componente/servicio)
  static getState(ctx: StateContext<Tabla1StateModel>) {
    return ctx.getState();
  }

  

  @Action(UpdateTableData)
  updateTableData({ getState, patchState }: StateContext<Tabla1StateModel>, { payload }: UpdateTableData) {
    const current = getState().tableData;
    patchState({
      tableData: { ...current, ...payload }
    });
  }

}
