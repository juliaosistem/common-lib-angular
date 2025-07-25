// Tipos de campo soportados (minimalista)
export type FieldType = 'img' | 'checkbox' | 'number' | 'text' | 'select';

// Interfaz para definir un campo dinámico
export interface DynamicField {
  key: string;           // Clave del campo en el objeto
  type: FieldType;       // Tipo de renderizado
  label: string;         // Etiqueta para mostrar
  value: unknown;        // Valor del campo
  order?: number;        // Orden de visualización
}

// Clase principal para entidad dinámica
export class DynamicEntity {
  id?: string;
  name?: string;
  fields: DynamicField[] = [];
  
  constructor(data?: Partial<DynamicEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  // Agregar un campo
  addField(field: DynamicField): void {
    this.fields.push(field);
  }

  // Obtener campo por clave
  getField(key: string): DynamicField | undefined {
    return this.fields.find(field => field.key === key);
  }

  // Obtener valor de un campo
  getFieldValue<T = unknown>(key: string): T | undefined {
    const field = this.getField(key);
    return field?.value as T;
  }

  // Establecer valor de un campo
  setFieldValue(key: string, value: unknown): void {
    const field = this.getField(key);
    if (field) {
      field.value = value;
    }
  }

  // Obtener campos ordenados
  getOrderedFields(): DynamicField[] {
    return this.fields.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // Convertir a objeto plano para APIs
  toPlainObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    if (this.id) obj['id'] = this.id;
    if (this.name) obj['name'] = this.name;
    
    this.fields.forEach(field => {
      obj[field.key] = field.value;
    });
    
    return obj;
  }

  // Crear desde objeto plano
  static fromPlainObject(data: Record<string, unknown>, fieldDefinitions: Omit<DynamicField, 'value'>[]): DynamicEntity {
    const entity = new DynamicEntity({
      id: data['id'] as string,
      name: data['name'] as string
    });

    fieldDefinitions.forEach(def => {
      entity.addField({
        ...def,
        value: data[def.key]
      });
    });

    return entity;
  }

  // Método auxiliar simplificado para crear definiciones básicas
  static createBasicFieldDefinitions(): Omit<DynamicField, 'value'>[] {
    return [
      { key: 'name', type: 'text', label: 'Name', order: 1 },
      { key: 'category', type: 'text', label: 'Category', order: 2 },
      { key: 'price', type: 'number', label: 'Price', order: 3 },
      { key: 'image', type: 'img', label: 'Image', order: 4 },
    ];
  }
}
