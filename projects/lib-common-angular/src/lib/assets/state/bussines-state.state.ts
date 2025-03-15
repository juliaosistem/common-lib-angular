import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { BussinesStateAction } from './bussines-state.actions';

export class BussinesStateStateModel {
  public items: string[]=[];
}

const defaults = {
  items: []
};

@State<BussinesStateStateModel>({
  name: 'bussinesState',
  defaults
})
@Injectable()
export class BussinesStateState {
  @Action(BussinesStateAction)
  add({ getState, setState }: StateContext<BussinesStateStateModel>, { payload }: BussinesStateAction) {
    const state = getState();
    setState({ items: [ ...state.items, payload ] });
  }
}
