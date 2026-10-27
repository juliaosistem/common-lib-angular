import { ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { AuthResponseDTO, LoginDTO } from '@juliaosistem/core-dtos';
import { Observable, Subject, defer, finalize, switchMap, takeUntil, timeout } from 'rxjs';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { SectionHeaderFormsLoginEcomerce1 } from '../../../atoms/ecommerce1/section-header-forms-login-ecomerce1/section-header-forms-login-ecomerce1';
import { FormAuthEccomerce1 } from '../../../molecules/ecommerce1/form-auth-eccomerce1/form-auth-eccomerce1';
import { AuthService } from '../../../../../services/auth-service';
import { FacebookSdkService } from '../../../../../services/facebook-sdk.service';
import { AbstractLogger } from '../../../../../services/abstract-logger.service';

@Component({
  selector: 'lib-login-ecommerce1',
  standalone: true,
  imports: [CommonModule, ButtonModule, SectionHeaderFormsLoginEcomerce1, FormAuthEccomerce1, RouterModule],
  templateUrl: './login-ecommerce1.html',
  styleUrls: ['./login-ecommerce1.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginEcommerce1 implements OnDestroy {
  loading = false;
  errorMsg: string | null = null;
  private readonly destroy$ = new Subject<void>();
  private readonly auth = inject(AuthService);
  private readonly facebook = inject(FacebookSdkService);
  private readonly logger = inject(AbstractLogger);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** @param credentials Credenciales enviadas exclusivamente al micro de usuarios. */
  login(credentials: LoginDTO): void {
    this.authenticate(defer(() => this.auth.login(credentials)).pipe(timeout(15000)));
  }

  /** Obtiene el token del SDK y lo intercambia por la sesion de negocio. */
  loginFacebook(): void {
    this.authenticate(defer(() => this.facebook.login()).pipe(
      switchMap(token => this.auth.loginSocial('FACEBOOK', token).pipe(timeout(15000))),
    ));
  }

  /** @param request Flujo de autenticacion directa o social. */
  private authenticate(request: Observable<PlantillaResponse<AuthResponseDTO>>): void {
    if (this.loading) return;
    this.logger.logInfo('[ENTRADA] authenticate', 'LoginEcommerce1');
    this.loading = true;
    this.errorMsg = null;
    request.pipe(takeUntil(this.destroy$), finalize(() => {
      this.loading = false;
      this.cdr.markForCheck();
    })).subscribe({
      next: result => this.handleResult(result),
      error: (error: unknown) => {
        this.logger.logError(error, 'LoginEcommerce1.authenticate');
        this.errorMsg = error instanceof Error ? error.message : 'No fue posible iniciar sesión.';
      },
    });
  }

  /** @param result Respuesta del micro; rta=false puede incluir tokens validos. */
  private handleResult(result: PlantillaResponse<AuthResponseDTO>): void {
    const status = result.httpStatus ?? 200;
    if (status >= 200 && status < 300 && (result.data?.businessToken || result.data?.keycloakToken?.access_token)) {
      this.logger.logInfo('[SALIDA] authenticate exitoso', 'LoginEcommerce1');
      return;
    }
    this.errorMsg = result.message || 'Credenciales inválidas.';
    this.logger.logError(new Error(this.errorMsg), 'LoginEcommerce1.authenticate');
  }
}
