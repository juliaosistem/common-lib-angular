import { Injectable } from '@angular/core';
import { decodeBusinessToken, getSessionToken } from '../../utils/business-token.util';

@Injectable({ providedIn: 'root' })
export class MetaDataService {
  constructor() {}

  /**
   * Devuelve los metadatos completos para cualquier operación.
   * @param topic nombre del topic o ruta del topic kafka
   * @param proceso Operación: 'listar' | 'guardar' | 'eliminar'
   */
  get(topic: string, proceso: 'listar' | 'guardar' | 'eliminar' = 'listar') {
    const idbusiness = this.getIdBusinessFromSession();
    const idDatosUsuario = this.getIdDatosUsuarioFromSession();
    const usuario = this.getUsuarioFromSession();
    const ip = this.getIpFromSession();
    const dominio = this.getDominioFromSession();

    return {
      ip,
      dominio,
      usuario,
      idbusiness,
      idDatosUsuario,
      topic,
      proceso,
    };
  }

  public getIdBusinessFromSession(): string | number {
    // Busca primero en localStorage, luego en sessionStorage, luego en JWT (si existe)
    let idbusiness: string | number | null = localStorage.getItem('idbusiness') || sessionStorage.getItem('idbusiness');
    if (!idbusiness) {
      const payload = this.getSessionPayload();
      idbusiness = (payload?.['idBusiness'] as string | number | undefined) || null;
    }
    return idbusiness || '1';
  }

  public getIdDatosUsuarioFromSession(): string {
    // Busca primero en localStorage, luego en sessionStorage, luego en JWT (si existe)
    let idDatosUsuario = localStorage.getItem('idDatosUsuario') || sessionStorage.getItem('idDatosUsuario');
    if (!idDatosUsuario) {
      const payload = this.getSessionPayload();
      idDatosUsuario = (payload?.sub as string | undefined) || (payload?.id as string | undefined) || (payload?.['idDatosUsuario'] as string | undefined) || null;
    }
    return idDatosUsuario || 'userX';
  }

  public getUsuarioFromSession(): string {
    // Busca primero en localStorage, luego en sessionStorage, luego en JWT (si existe)
    let usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (!usuario) {
      const payload = this.getSessionPayload();
      usuario = (payload?.usuario as string | undefined) || (payload?.email as string | undefined) || (payload?.username as string | undefined) || null;
    }
    return usuario || 'admin';
  }

  public getIpFromSession(): string {
    return localStorage.getItem('ip') || sessionStorage.getItem('ip') || '127.0.0.1';
  }

  public getDominioFromSession(): string {
    return localStorage.getItem('dominio') || sessionStorage.getItem('dominio') || 'app';
  }

  private getSessionPayload() {
    const token = getSessionToken();
    return decodeBusinessToken(token);
  }
}
