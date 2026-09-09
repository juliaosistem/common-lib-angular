import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'lib-crud-feedback-toast1',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './crud-feedback-toast1.component.html',
  providers: [MessageService],
})
export class CrudFeedbackToast1Component {
  constructor(private readonly service: MessageService) {}

  showSuccess(detail: string = 'Operación exitosa'): void {
    this.service.add({
      severity: 'success',
      summary: 'Success',
      detail,
    });
  }

  showError(detail: string = 'Ocurrió un error'): void {
    this.service.add({
      severity: 'error',
      summary: 'Error',
      detail,
    });
  }
}