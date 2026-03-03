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
    const idBusiness = this.getIdBusinessFromSession();
    const idDatosUsuario = this.getIdDatosUsuarioFromSession();
    const usuario = this.getUsuarioFromSession();
    const ip = this.getIpFromSession();
    const dominio = this.getDominioFromSession();

    return {
      ip,
      dominio,
      usuario,
      idBusiness,
      idDatosUsuario,
      topic,
      proceso,
    };
  }

  public getIdBusinessFromSession(): string | number {
    // Busca primero en localStorage, luego en sessionStorage, luego en JWT (si existe)
    let idBusiness = localStorage.getItem('idBusiness') || sessionStorage.getItem('idBusiness');
    if (!idBusiness) {
      const jwt = this.getToken();
      if (jwt) {
        try {
          const payload = this.decodeJwt(jwt);
          idBusiness = payload?.idBusiness;
        } catch (error) {
          console.error('Error al decodificar JWT para obtener idBusiness:', error);
        }
      }
    }
    return idBusiness || '1';
  }

  public getIdDatosUsuarioFromSession(): string {
    // Busca primero en localStorage, luego en sessionStorage, luego en JWT (si existe)
    let idDatosUsuario = localStorage.getItem('idDatosUsuario') || sessionStorage.getItem('idDatosUsuario');
    if (!idDatosUsuario) {
      const jwt = this.getToken();
      if (jwt) {
        try {
          const payload = this.decodeJwt(jwt);
          idDatosUsuario = payload?.sub || payload?.idDatosUsuario;
        } catch (error) {
          console.error('Error al decodificar JWT para obtener idDatosUsuario:', error);
      }
      }
    }
    return idDatosUsuario || 'userX';
  }

  public getUsuarioFromSession(): string {
    // Busca primero en localStorage, luego en sessionStorage, luego en JWT (si existe)
    let usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (!usuario) {
      const jwt = this.getToken();
      if (jwt) {
        try {
          const payload = this.decodeJwt(jwt);
          usuario = payload?.usuario || payload?.email || payload?.username;
        } catch (error) {
          console.error('Error al decodificar JWT para obtener usuario:', error);
        }
      }
    }
    return usuario || 'admin';
  }

  public getIpFromSession(): string {
    return localStorage.getItem('ip') || sessionStorage.getItem('ip') || '127.0.0.1';
  }

  public getDominioFromSession(): string {
    return localStorage.getItem('dominio') || sessionStorage.getItem('dominio') || 'app';
  }

  private getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private decodeJwt(token: string): any {
    // Decodifica un JWT (sin validación de firma)
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch (error) {
      console.error('Error al decodificar JWT:', error);
      return null;
    }
  }
}
