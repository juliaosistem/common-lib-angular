import { QueryParams } from 'juliaositembackenexpress/dist/utils/queryParams';

// eslint-disable-next-line max-lines-per-function
export function createGenericCrudActions<RQ>(entityName: string) {
  
  class All {
    static readonly type = `[${entityName}] ALL`;
    constructor(public payload: QueryParams, public filters?: Map<string, string>) {}
  }

  class Add {
    static readonly type = `[${entityName}] ADD`;
    constructor(public payload: RQ, public queryParams: QueryParams) {}
  }

  class Update {
    static readonly type = `[${entityName}] UPDATE`;
    constructor(public payload: RQ, public queryParams: QueryParams) {}
  }

  class Delete {
    static readonly type = `[${entityName}] DELETE`;
    constructor(public id: string, public queryParams: QueryParams) {}
  }

 

  return {
    All,
    Add,
    Update,
    Delete,
  };
}
