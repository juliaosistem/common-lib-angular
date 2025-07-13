export class Tabla1Action<T = unknown> {
  constructor(public payload?: T) {}
}

export class LoadTabla1Data<T = unknown> extends Tabla1Action<T> {
  static readonly type = '[Tabla1] Load Data';
  constructor(public override payload: T) {
    super(payload);
  }
}

export class AddTabla1Item<T = unknown> extends Tabla1Action<T> {
  static readonly type = '[Tabla1] Add Item';
  constructor(public override payload: T) {
    super(payload);
  }
}

export class UpdateTabla1Item<T = unknown> extends Tabla1Action<{id: string, changes: Partial<T>}> {
  static readonly type = '[Tabla1] Update Item';
  constructor(public override payload: {id: string, changes: Partial<T>}) {
    super(payload);
  }
}

export class DeleteTabla1Item extends Tabla1Action<string> {
  static readonly type = '[Tabla1] Delete Item';
  constructor(public override payload: string) {
    super(payload);
  }
}

export class GetTabla1State extends Tabla1Action {
  static readonly type = '[Tabla1] Get State';
}

export class UpdateTableData<T = unknown> extends Tabla1Action<T> {
  static readonly type = '[Tabla1] Update Table Data';
  constructor(public override payload: T) {
    super(payload);
  }
}

export class SetTableLoading extends Tabla1Action<boolean> {
  static readonly type = '[Tabla1] Set Loading';
  constructor(public override payload: boolean) {
    super(payload);
  }
}

export class SetSelectedItems<T = unknown> extends Tabla1Action<T[]> {
  static readonly type = '[Tabla1] Set Selected Items';
  constructor(public override payload: T[]) {
    super(payload);
  }
}