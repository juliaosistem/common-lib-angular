import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SectionHeaderFormsLoginEcomerce1 } from '../../../atoms/ecommerce1/section-header-forms-login-ecomerce1/section-header-forms-login-ecomerce1';
import { FormAuthEccomerce1 } from '../../../molecules/ecommerce1/form-auth-eccomerce1/form-auth-eccomerce1';
import { Router, RouterModule } from '@angular/router';
import { LoginDTO } from '@juliaosistem/core-dtos';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../../services/auth-service';

@Component({
  selector: 'lib-login-ecommerce1',
  standalone: true,
  imports: [CommonModule, ButtonModule, SectionHeaderFormsLoginEcomerce1, FormAuthEccomerce1, RouterModule],
  templateUrl: './login-ecommerce1.html',
  styleUrls: ['./login-ecommerce1.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginEcommerce1 implements OnInit, OnDestroy {
  loading = false;
  errorMsg: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(login: LoginDTO): void {
    this.loading = true;
    this.errorMsg = null;
    this.authService
      .login(login)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: { success: boolean; errorMsg?: string }) => {
          this.loading = false;
          if (!result.success) {
            this.errorMsg = result.errorMsg ?? 'Credenciales inválidas';
          }
        },
        error: (err: { errorMsg?: string }) => {
          this.loading = false;
          this.errorMsg = err?.errorMsg || 'Error de autenticación';
        },
      });
  }
}
