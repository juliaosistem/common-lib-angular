import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { AuthService } from '../../../../services/auth-service';
import { SessionExpiryService } from '../../../../services/session-expiry.service';

/**
 * Modal que avisa al usuario antes de que expire su sesion y permite extenderla
 * invocando el refresh del backend, o cerrar sesion de inmediato.
 */
@Component({
  selector: 'lib-session-expiry-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, ButtonModule, ProgressBarModule],
  template: `
    <p-dialog
      [visible]="secondsLeft !== null"
      [modal]="true"
      [closable]="false"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '26rem' }"
      header="Tu sesión está por expirar">
      <div class="flex flex-column gap-3">
        <p class="m-0 text-sm">
          Por seguridad cerraremos tu sesión en
          <strong>{{ secondsLeft }}</strong> segundos.
          ¿Deseas continuar trabajando?
        </p>
        <p-progressBar [value]="progress" [showValue]="false" styleClass="h-1rem"></p-progressBar>
        @if (errorMessage) {
          <small class="text-red-500">{{ errorMessage }}</small>
        }
      </div>
      <ng-template #footer>
        <p-button label="Cerrar sesión" severity="secondary" [text]="true" (onClick)="onLogout()"></p-button>
        <p-button label="Seguir conectado" [loading]="extending" (onClick)="onExtend()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class SessionExpiryDialogComponent implements OnInit, OnDestroy {
  secondsLeft: number | null = null;
  extending = false;
  errorMessage = '';

  private readonly destroy$ = new Subject<void>();
  private initialSeconds = 1;

  constructor(
    private readonly sessionExpiry: SessionExpiryService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  /** Porcentaje restante de la ventana de aviso, usado por la barra de progreso. */
  get progress(): number {
    if (this.secondsLeft === null) {
      return 0;
    }
    return Math.max(0, Math.round((this.secondsLeft / this.initialSeconds) * 100));
  }

  ngOnInit(): void {
    this.sessionExpiry.start();
    this.sessionExpiry.warningSecondsLeft$
      .pipe(takeUntil(this.destroy$))
      .subscribe((seconds) => this.applyWarning(seconds));

    this.sessionExpiry.expired$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.redirectToLogin());
  }

  /**
   * Solicita la extension de la sesion al backend y actualiza el estado del modal.
   */
  onExtend(): void {
    this.extending = true;
    this.errorMessage = '';
    this.sessionExpiry.extendSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe((renewed) => {
        this.extending = false;
        this.errorMessage = renewed ? '' : 'No fue posible extender la sesión. Vuelve a iniciar sesión.';
        this.cdr.markForCheck();
      });
  }

  /**
   * Cierra la sesion de forma explicita desde el modal.
   */
  onLogout(): void {
    this.secondsLeft = null;
    this.authService.logout().pipe(takeUntil(this.destroy$)).subscribe();
  }

  /**
   * Actualiza el contador visible conservando el total inicial de la ventana de aviso.
   *
   * @param seconds segundos restantes emitidos por el servicio de expiracion
   */
  private applyWarning(seconds: number | null): void {
    if (seconds !== null && this.secondsLeft === null) {
      this.initialSeconds = seconds;
    }
    this.secondsLeft = seconds;
    this.cdr.markForCheck();
  }

  /**
   * Redirige al login cuando la sesion expiro sin ser renovada.
   */
  private redirectToLogin(): void {
    this.secondsLeft = null;
    this.cdr.markForCheck();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.sessionExpiry.stop();
  }
}
