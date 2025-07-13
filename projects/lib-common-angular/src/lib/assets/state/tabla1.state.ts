import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/TablaDataSharedDTO';
import { 
  UpdateTableData, 
  LoadTabla1Data, 
  AddTabla1Item, 
  UpdateTabla1Item, 
  DeleteTabla1Item,
  SetTableLoading,
  SetSelectedItems
} from './tabla1.actions';


export class Tabla1StateModel<M = unknown, RES = unknown> {
  public tableData: TablaDataSharedDTO<M, RES>;
  public loading: boolean;

  constructor(init?: Partial<TablaDataSharedDTO<M, RES>>) {
    this.loading = false;
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
      selectedItems: [],
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

  // SELECTOR: Obtener el estado de carga
  @Selector()
  static getLoading(state: Tabla1StateModel) {
    return state.loading;
  }

  // SELECTOR: Obtener items seleccionados
  @Selector()
  static getSelectedItems(state: Tabla1StateModel) {
    return state.tableData.selectedItems;
  }

  // MÉTODO: Para obtener el estado completo (desde un componente/servicio)
  static getState(ctx: StateContext<Tabla1StateModel>) {
    return ctx.getState();
  }

  @Action(LoadTabla1Data)
  loadTableData({ patchState }: StateContext<Tabla1StateModel>, { payload }: LoadTabla1Data) {
    patchState({
      tableData: {
        ...new Tabla1StateModel().tableData,
        data: payload
      }
    });
  }

  @Action(AddTabla1Item)
  addItem({ getState, patchState }: StateContext<Tabla1StateModel>, { payload }: AddTabla1Item) {
    const state = getState();
    const currentData = state.tableData.data?.dataList || [];
    
    patchState({
      tableData: {
        ...state.tableData,
        data: {
          ...state.tableData.data,
          dataList: [...currentData, payload]
        }
      }
    });
  }

  @Action(UpdateTabla1Item)
  updateItem({ getState, patchState }: StateContext<Tabla1StateModel>, { payload }: UpdateTabla1Item) {
    const state = getState();
    const currentData = state.tableData.data?.dataList || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData = currentData.map((item: any) => 
      item.id === payload.id ? { ...item, ...payload.changes } : item
    );
    
    patchState({
      tableData: {
        ...state.tableData,
        data: {
          ...state.tableData.data,
          dataList: updatedData
        }
      }
    });
  }

  @Action(DeleteTabla1Item)
  deleteItem({ getState, patchState }: StateContext<Tabla1StateModel>, { payload }: DeleteTabla1Item) {
    const state = getState();
    const currentData = state.tableData.data?.dataList || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredData = currentData.filter((item: any) => item.id !== payload);
    
    patchState({
      tableData: {
        ...state.tableData,
        data: {
          ...state.tableData.data,
          dataList: filteredData
        }
      }
    });
  }

  @Action(SetSelectedItems)
  setSelectedItems({ getState, patchState }: StateContext<Tabla1StateModel>, { payload }: SetSelectedItems) {
    const state = getState();
    patchState({
      tableData: {
        ...state.tableData,
        selectedItems: payload
      }
    });
  }

  @Action(SetTableLoading)
  setLoading({ patchState }: StateContext<Tabla1StateModel>, { payload }: SetTableLoading) {
    patchState({
      loading: payload
    });
  }

  @Action(UpdateTableData)
  updateTableData({ getState, patchState }: StateContext<Tabla1StateModel>, { payload }: UpdateTableData) {
    const current = getState().tableData;
    patchState({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tableData: { ...current, ...(payload as any) }
    });
  }

}
