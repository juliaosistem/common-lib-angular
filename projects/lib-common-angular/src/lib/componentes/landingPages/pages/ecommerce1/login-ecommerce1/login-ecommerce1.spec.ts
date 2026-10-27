import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { LoginEcommerce1 } from './login-ecommerce1';
import { AuthService } from '../../../../../services/auth-service';
import { FacebookSdkService } from '../../../../../services/facebook-sdk.service';
import { AbstractLogger } from '../../../../../services/abstract-logger.service';
import { AuthResponseDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';

describe('LoginEcommerce1', () => {
  let component: LoginEcommerce1;
  const auth = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'loginSocial']);
  const facebook = jasmine.createSpyObj<FacebookSdkService>('FacebookSdkService', ['login']);
  const data: AuthResponseDTO = {
    businessToken: 'domain-token',
    keycloakToken: {
      access_token: 'keycloak-token', refresh_token: 'refresh-token', token_type: 'Bearer',
      expires_in: 300, refresh_expires_in: 1800, not_before_policy: 0, session_state: 'test', scope: 'openid',
    },
  };

  beforeEach(() => {
    auth.login.calls.reset();
    auth.loginSocial.calls.reset();
    facebook.login.calls.reset();
    TestBed.configureTestingModule({
      imports: [LoginEcommerce1],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: FacebookSdkService, useValue: facebook },
        { provide: AbstractLogger, useValue: jasmine.createSpyObj('Logger', ['logInfo', 'logError']) },
      ],
    }).overrideComponent(LoginEcommerce1, { set: { template: '', imports: [] } });
    component = TestBed.createComponent(LoginEcommerce1).componentInstance;
  });

  it('acepta businessToken aunque el envoltorio heredado devuelva rta=false', () => {
    auth.login.and.returnValue(of({ rta: false, httpStatus: 200, data }));
    component.login({ email: 'usuario@example.test', password: 'test-password' });
    expect(component.errorMsg).toBeNull();
    expect(component.loading).toBeFalse();
  });

  it('intercambia el token de Facebook usando el mismo AuthService que fn-admin', () => {
    facebook.login.and.returnValue(of('sdk-token'));
    auth.loginSocial.and.returnValue(of({ rta: true, data }));
    component.loginFacebook();
    expect(auth.loginSocial).toHaveBeenCalledOnceWith('FACEBOOK', 'sdk-token');
    expect(component.errorMsg).toBeNull();
  });

  it('muestra cancelacion o configuracion ausente sin llamar al micro social', () => {
    facebook.login.and.returnValue(throwError(() => new Error('Facebook no está configurado')));
    component.loginFacebook();
    expect(component.errorMsg).toBe('Facebook no está configurado');
    expect(auth.loginSocial).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('impide envios duplicados mientras hay una autenticacion pendiente', () => {
    auth.login.and.returnValue(new Subject<PlantillaResponse<AuthResponseDTO>>());
    component.login({ email: 'usuario@example.test', password: 'test-password' });
    component.login({ email: 'usuario@example.test', password: 'test-password' });
    expect(auth.login).toHaveBeenCalledTimes(1);
    component.ngOnDestroy();
    expect(component.loading).toBeFalse();
  });

  it('muestra el rechazo de credenciales sin reportar exito', () => {
    auth.login.and.returnValue(of({ rta: false, httpStatus: 401, message: 'Credenciales inválidas' }));
    component.login({ email: 'usuario@example.test', password: 'incorrect' });
    expect(component.errorMsg).toBe('Credenciales inválidas');
  });

  it('no considera exito un estado de error aunque contenga tokens', () => {
    auth.login.and.returnValue(of({ rta: true, httpStatus: 500, message: 'Error de autenticación', data }));
    component.login({ email: 'usuario@example.test', password: 'test-password' });
    expect(component.errorMsg).toBe('Error de autenticación');
  });
});
