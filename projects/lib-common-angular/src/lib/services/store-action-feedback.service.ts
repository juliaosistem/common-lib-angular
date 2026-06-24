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
  constructor(private messageService: MessageService) {}

  execute(
    store: Store,
    action: unknown,
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
        });
        return of(false);
      }),
    );
  }

  private getResponse(store: Store, stateKey: string): PlantillaResponse<unknown> | undefined {
    return store.selectSnapshot((state: any) => state?.[stateKey]) as PlantillaResponse<unknown> | undefined;
  }

  private showToast(response: PlantillaResponse<unknown> | undefined, messages: FeedbackMessages): void {
    const isSuccess = this.isSuccessResponse(response);
    this.messageService.add({
      severity: isSuccess ? 'success' : 'error',
      summary: isSuccess ? 'Success' : 'Error',
      detail: response?.message || (isSuccess ? messages.success : messages.error),
    });
  }

  private isSuccessResponse(response?: PlantillaResponse<unknown>): boolean {
    if (!response) {
      return false;
    }

    if (typeof response.rta === 'boolean') {
      return response.rta;
    }

    const status = response.httpStatus ?? 0;
    return status >= 200 && status < 300;
  }
}