export interface MenuDTO{
      id:string,
      icon?: string,
      url: string,
      itemName: string,
      subItemName: string
      nameRol:string[],
      
  }
  
  export interface MenuActive{
      
      rolActive:string,
      menuModel:MenuDTO[];
  }