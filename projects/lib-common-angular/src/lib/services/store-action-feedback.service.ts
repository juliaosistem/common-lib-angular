import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';

export interface FeedbackMessages {
  success: string;
  error: string;
}

@Injectable({ providedIn: 'root' })
export class StoreActionFeedbackService {
  private readonly toastLifeMs = 6000;

  constructor(private messageService: MessageService) {}

  execute(
    store: Store,
    action: object,
    stateKey: string,
    messages: FeedbackMessages,
  ): Observable<boolean> {
    return store.dispatch(action).pipe(
      map(() => this.getResponse(store, stateKey)),
      tap((response) => this.showToast(response, messages)),
      map((response) => this.isSuccessResponse(response)),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.message || messages.error,
          life: this.toastLifeMs,
        });
        return of(false);
      }),
    );
  }

  private getResponse(store: Store, stateKey: string): PlantillaResponse<unknown> | undefined {
    return store.selectSnapshot((state: Record<string, unknown>) => {
      const stateSlice = state?.[stateKey] as PlantillaResponse<unknown> | undefined;
      return stateSlice;
    });
  }

  private showToast(response: PlantillaResponse<unknown> | undefined, messages: FeedbackMessages): void {
    const isSuccess = this.isSuccessResponse(response);
    const responseMessage = this.resolveResponseMessage(response);
    this.messageService.add({
      severity: isSuccess ? 'success' : 'error',
      summary: isSuccess ? 'Success' : 'Error',
      detail: responseMessage || (isSuccess ? messages.success : messages.error),
      life: this.toastLifeMs,
    });
  }

  private resolveResponseMessage(response?: PlantillaResponse<unknown>): string {
    const rootMessage = response?.message;
    const dataMessage = (response?.data as { message?: string } | undefined)?.message;
    return (rootMessage || dataMessage || '').toString().trim();
  }

  private isSuccessResponse(response?: PlantillaResponse<unknown>): boolean {
    if (!response) {
      return false;
    }
    const status = response.httpStatus ?? 0;
    if (status >= 200 && status < 300) {
      return true;
    }

    return response.rta === true;
  }
}