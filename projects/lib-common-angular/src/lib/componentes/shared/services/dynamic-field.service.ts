import { Injectable } from '@angular/core';
import { DynamicField } from '../interfaces/dynamic-field.interface';
import { FieldType } from '@juliaosistem/core-dtos';
export interface GenerateFieldsConfig {
  data: Record<string, unknown>[];
  fieldTypeConfig?: Record<string, FieldType>;
  fieldLabels?: Record<string, string>;
  fieldOrder?: string[];
  excludeFields?: string[];
  getValueFn?: (item: any, key: string) => any; // permite getter personalizado

}

export interface CreateFieldConfig {
  key: string;
  index: number;
  data: Record<string, unknown>[];
  fieldTypeConfig: Record<string, FieldType>;
  fieldLabels: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicFieldService {

  /**
   * Genera campos dinámicos basados en los datos de entrada
   */
  generateFieldsFromData(config: GenerateFieldsConfig): DynamicField[] {
    const {
      data,
      fieldTypeConfig = {},
      fieldLabels = {},
      fieldOrder = [],
      excludeFields = ['id']
    } = config;

    if (!data || data.length === 0) return [];

    // Obtener todas las claves únicas de los objetos
    const allKeys = this.getAllUniqueKeys(data, excludeFields);
    
    // Filtrar campos excluidos y determinar orden
    const orderedKeys = this.getOrderedKeys(allKeys, fieldOrder);

    // Generar campos dinámicos
    return orderedKeys.map((key, index) => 
      this.createDynamicField({
        key,
        index,
        data,
        fieldTypeConfig,
        fieldLabels
      })
    );
    
  }

  /**
   * Obtiene todas las claves únicas de los datos, excluyendo campos especificados
   */
  private getAllUniqueKeys(data: Record<string, unknown>[], excludeFields: string[]): string[] {
    const allKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys).filter(key => !excludeFields.includes(key));
  }

  /**
   * Ordena las claves según el orden especificado o alfabéticamente
   */
  private getOrderedKeys(availableKeys: string[], fieldOrder: string[]): string[] {
    return fieldOrder.length > 0 
      ? fieldOrder.filter(key => availableKeys.includes(key))
      : availableKeys.sort();
  }

  /**
   * Crea un campo dinámico individual
   */
  private createDynamicField(config: CreateFieldConfig): DynamicField {
    const { key, index, data, fieldTypeConfig, fieldLabels } = config;
    const fieldType = fieldTypeConfig[key] || this.detectFieldType(data, key);
    const label = fieldLabels[key] || this.formatLabel(key);

    return {
      key,
      label,
      type: fieldType,
      value: null, // Se asignará dinámicamente por cada fila
      order: index
    };
  }

  /**
   * Auto-detecta el tipo de campo basado en los datos
   */
  detectFieldType(data: Record<string, unknown>[], key: string): FieldType {
    const sampleValue = data.find(item => item[key] !== null && item[key] !== undefined)?.[key];
    
    if (sampleValue === undefined || sampleValue === null) {
      return 'text';
    }

    if (typeof sampleValue === 'boolean') {
      return 'checkbox';
    }

    if (typeof sampleValue === 'number') {
      return 'number';
    }

    if (typeof sampleValue === 'string') {
      // Detectar si es una URL de imagen
      if (sampleValue.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return 'img';
      }
      
      // Por defecto, text
      return 'text';
    }

    return 'text';
  }

  /**
   * Formatea una etiqueta desde el nombre del campo
   */
  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // Separar camelCase
      .replace(/[_-]/g, ' ') // Reemplazar guiones y guiones bajos
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitalizar palabras
      .trim();
  }

  /**
   * Formatea el valor de un campo dinámico para mostrar
   */
  formatDynamicFieldValue(field: DynamicField, value: unknown): string {
    if (value == null) return '-';
    return String(value);
  }

  /**
   * Obtiene la URL de imagen para un campo
   */
  getImageUrl(field: DynamicField, value: unknown): string {
    if (!value) return '/assets/images/placeholder.png';
    
    const strValue = String(value);
    
    // Si ya es una URL completa (http/https), devolverla
    if (strValue.startsWith('http://') || strValue.startsWith('https://')) {
      return strValue;
    }
    
    // Si es una ruta local que empieza con /, devolverla (assets, etc.)
    if (strValue.startsWith('/')) {
      return strValue;
    }
    
    // Si es un blob URL (archivo subido), devolverlo
    if (strValue.startsWith('blob:')) {
      return strValue;
    }
    
    // Si es solo nombre de archivo, asumir que está en assets/images
    if (strValue.includes('.')) {
      return `/assets/images/${strValue}`;
    }
    
    // Fallback: devolver valor como está
    return strValue;
  }

  /**
   * Obtiene el texto alternativo para una imagen
   */
  getImageAltText(field: DynamicField, item: Record<string, unknown>): string {
    return String(item['name'] || 'Image');
  }

  /**
   * Genera un ID único para nuevos elementos
   */
  generateId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  /**
   * Busca el índice de un elemento por ID
   */
  findIndexById(data: Record<string, unknown>[], id: string): number {
    return data.findIndex((item) => item['id'] === id);
  }
}
