import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MetaDataService {
  constructor() {}

  /**
   * Devuelve los metadatos completos para cualquier operación.
   * @param topic nombre del topic o ruta del topic kafka
   * @param proceso Operación: 'listar' | 'guardar' | 'eliminar'
   */
  get(topic: string, proceso: 'listar' | 'guardar' | 'eliminar' = 'listar') {
    // Aquí puedes reemplazar con lógica real para obtener ID del negocio y usuario
    const idBusiness = this.getIdBusinessFromSession();
    const idDatosUsuario = this.getIdDatosUsuarioFromSession();

    return {
      ip: '127.0.0.1', // opcional: luego dinámico
      dominio: 'app',
      usuario: 'admin',
      idBusiness,
      idDatosUsuario,
      topic,
      proceso,
    };
  }

  public getIdBusinessFromSession(): string | number {
    // lógica real: por ejemplo desde localStorage o servicio de sesión
    return '1'; // ejemplo 1 bussiness de momento hasta que se aplique lógica real
  }

  public getIdDatosUsuarioFromSession(): string {
    // lógica real: por ejemplo desde token JWT o servicio de sesión
    return 'userX';
  }
}
