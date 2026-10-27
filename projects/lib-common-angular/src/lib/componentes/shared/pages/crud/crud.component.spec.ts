import { ConfirmationService, MessageService } from 'primeng/api';
import { Crud } from './crud.component';
import { DynamicFieldService } from '../../../../services/dynamic-field.service';
import { ExcelExportService } from '../../../../services/excel-export.service';

describe('Crud controlledDelete', () => {
  let component: Crud;
  let confirmation: jasmine.SpyObj<ConfirmationService>;
  let messages: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    confirmation = jasmine.createSpyObj<ConfirmationService>('ConfirmationService', ['confirm']);
    messages = jasmine.createSpyObj<MessageService>('MessageService', ['add']);
    component = new Crud(messages, confirmation,
      jasmine.createSpyObj<DynamicFieldService>('DynamicFieldService', ['generateFieldsFromData']),
      jasmine.createSpyObj<ExcelExportService>('ExcelExportService', ['exportToExcel']));
    component.data = [{ id: 'one', name: 'Producto' }, { id: 'two', name: 'Otro' }];
    component.selectedItems = [...component.data];
  });

  it('mantiene el comportamiento optimista existente por defecto', () => {
    const deleted = spyOn(component.deleteItemRequest, 'emit');
    component.deleteSelectedItems();
    confirmation.confirm.calls.mostRecent().args[0].accept?.();
    expect(component.data).toEqual([]);
    expect(deleted).toHaveBeenCalledTimes(2);
    expect(messages.add).toHaveBeenCalled();
  });

  it('emite una sola solicitud por lote sin borrar filas ni mostrar exito anticipado', () => {
    component.controlledDelete = true;
    const batch = spyOn(component.deleteItemsRequest, 'emit');
    const single = spyOn(component.deleteItemRequest, 'emit');
    component.deleteSelectedItems();
    confirmation.confirm.calls.mostRecent().args[0].accept?.();
    expect(batch).toHaveBeenCalledOnceWith(component.data);
    expect(single).not.toHaveBeenCalled();
    expect(component.data.length).toBe(2);
    expect(messages.add).not.toHaveBeenCalled();
  });

  it('respeta permisos de eliminacion en modo controlado', () => {
    component.controlledDelete = true;
    component.canDelete = false;
    component.deleteSelectedItems();
    expect(confirmation.confirm).not.toHaveBeenCalled();
    expect(component.data.length).toBe(2);
  });
});
