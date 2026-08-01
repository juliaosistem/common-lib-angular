import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImagenDTO, UploadImageRequestDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { QueryParams } from 'juliaositembackenexpress/dist/utils/queryParams';
import { Observable } from 'rxjs';
import { LibConfigService } from '../config/lib-config.service';
import { JuliaoSystemCrudHttpService } from '../config/JuliaoSystemCrudHttpService';

/**
 * Utilitario de librería para uploads de imágenes en endpoints personalizados.
 */
@Injectable({ providedIn: 'root' })
export class ImagenesService extends JuliaoSystemCrudHttpService<ImagenDTO, ImagenDTO> {
  constructor(
    http: HttpClient,
    private configService: LibConfigService,
  ) {
    super(http);
    this.basePathUrl = this.resolveBasePathUrl();
  }

  /**
   * Sube una imagen al endpoint personalizado /upload.
   * @param request DTO con archivo y metadatos.
   * @param queryParams Headers de trazabilidad.
   * @returns Respuesta estándar con ImagenDTO.
   */
  upload(
    request: UploadImageRequestDTO,
    queryParams: QueryParams = {} as QueryParams,
  ): Observable<PlantillaResponse<ImagenDTO>> {
    const headers = this.buildHeaders(queryParams);
    return this.http.post<PlantillaResponse<ImagenDTO>>(
      `${this.basePathUrl}/upload`,
      this.toFormData(request),
      { headers },
    );
  }

  /**
   * Convierte UploadImageRequestDTO a FormData multipart.
   * @param request Datos de entrada del upload.
   * @returns FormData listo para enviar.
   */
  private toFormData(request: UploadImageRequestDTO): FormData {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('alt', request.alt);
    this.appendOptional(formData, 'idComponente', request.idComponente);
    this.appendOptional(formData, 'idDatosUsuario', request.idDatosUsuario);
    return formData;
  }

  /**
   * Agrega valores opcionales a un FormData cuando existen.
   * @param formData Objeto FormData en construcción.
   * @param key Nombre del campo.
   * @param value Valor opcional a serializar.
   */
  private appendOptional(formData: FormData, key: string, value: unknown): void {
    if (value === undefined || value === null || value === '') {
      return;
    }

    formData.append(key, String(value));
  }

  /**
   * Resuelve base URL de imágenes desde la configuración de la librería.
   * @returns URL base del recurso imágenes.
   */
  private resolveBasePathUrl(): string {
    const configured = String(this.configService.get('baseUrlImagenes') ?? '').trim();
    if (configured) {
      return configured.replace(/\/$/, '');
    }

    const business = String(this.configService.get('baseUrlBusiness') ?? '').trim();
    return `${business.replace(/\/$/, '')}/imagenes`;
  }


  
}
