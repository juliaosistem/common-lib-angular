import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, interval, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth-service';
import { LibConfigService } from '../config/lib-config.service';

/** Segundos de antelacion con los que se avisa al usuario antes de que expire la sesion. */
const DEFAULT_WARNING_SECONDS = 90;

/** Frecuencia de verificacion del estado de la sesion. */
const CHECK_INTERVAL_MS = 1000;

/**
 * Vigila la expiracion del token de sesion, emite el aviso previo para el modal
 * de extension y fuerza el cierre de sesion cuando el token vence.
 */
@Injectable({ providedIn: 'root' })
export class SessionExpiryService implements OnDestroy {
  private readonly secondsLeftSubject = new BehaviorSubject<number | null>(null);
  private readonly expiredSubject = new Subject<void>();
  private ticker?: Subscription;
  private refreshing = false;

  constructor(
    private readonly authService: AuthService,
    private readonly config: LibConfigService,
    private readonly zone: NgZone
  ) {}

  /** Segundos restantes cuando la sesion entra en ventana de aviso; null cuando no aplica. */
  get warningSecondsLeft$(): Observable<number | null> {
    return this.secondsLeftSubject.asObservable();
  }

  /** Emite cuando la sesion vencio y se limpio el almacenamiento local. */
  get expired$(): Observable<void> {
    return this.expiredSubject.asObservable();
  }

  /**
   * Inicia el monitoreo periodico de la sesion. Es idempotente.
   */
  start(): void {
    if (this.ticker) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.ticker = interval(CHECK_INTERVAL_MS).subscribe(() => this.zone.run(() => this.evaluate()));
    });
    this.evaluate();
  }

  /**
   * Detiene el monitoreo y limpia el estado de aviso.
   */
  stop(): void {
    this.ticker?.unsubscribe();
    this.ticker = undefined;
    this.secondsLeftSubject.next(null);
  }

  /**
   * Extiende la sesion llamando al refresh del backend y oculta el aviso al completarse.
   *
   * @returns observable que emite true cuando la renovacion fue exitosa
   */
  extendSession(): Observable<boolean> {
    if (this.refreshing) {
      return of(false);
    }
    this.refreshing = true;
    return this.authService.refreshSession().pipe(
      tap((renewed) => {
        if (renewed) {
          this.secondsLeftSubject.next(null);
        }
      }),
      map((renewed) => renewed),
      catchError(() => of(false)),
      tap({ finalize: () => (this.refreshing = false) })
    );
  }

  /**
   * Evalua el tiempo restante y decide si mostrar aviso o cerrar la sesion.
   */
  private evaluate(): void {
    const expiresAt = this.authService.getSessionExpiresAt();
    if (!this.authService.getIsLoggedInSnapshot() || !expiresAt) {
      this.secondsLeftSubject.next(null);
      return;
    }

    const secondsLeft = Math.floor((expiresAt - Date.now()) / 1000);
    if (secondsLeft <= 0) {
      this.handleExpiration();
      return;
    }

    this.secondsLeftSubject.next(secondsLeft <= this.warningThreshold() ? secondsLeft : null);
  }

  /**
   * Limpia la sesion local y notifica la expiracion a los consumidores.
   */
  private handleExpiration(): void {
    this.secondsLeftSubject.next(null);
    this.authService.clearLocalSession();
    this.expiredSubject.next();
  }

  /**
   * Resuelve el umbral de aviso configurable por aplicacion consumidora.
   *
   * @returns segundos de antelacion para mostrar el modal
   */
  private warningThreshold(): number {
    const configured = Number(this.config.get('sessionWarningSeconds'));
    return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_WARNING_SECONDS;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
