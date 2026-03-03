import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoginDTO } from '@juliaosistem/core-dtos';
import { Login, AddUser } from '../assets/state/usuarios.actions';
import { UsuariosState } from '../assets/state/usuarios.state';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponseDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private store: Store, private router: Router) {}

  /**
   * Realiza el login y maneja toda la lógica de validación y navegación.
   * Devuelve un observable con { success: boolean, errorMsg?: string }
   */
  // eslint-disable-next-line max-lines-per-function
  login(login: LoginDTO): Observable<{ success: boolean; errorMsg?: string }> {
    return this.store.dispatch(new Login(login)).pipe(
      map(() => {
        const authResponse = this.store.selectSnapshot<PlantillaResponse<AuthResponseDTO>>(UsuariosState.Login);
        if (
          authResponse &&
          authResponse.data &&
          authResponse.data.keycloakToken &&
          authResponse.data.keycloakToken.access_token
        ) {
          this.router.navigate(['/home']);
          return { success: true };
        } else {
          return {
            success: false,
            errorMsg: authResponse && authResponse.message ? authResponse.message : 'Credenciales inválidas',
          };
        }
      }),
      catchError((err) => {
        return throwError(() => ({
          success: false,
          errorMsg: err?.error?.message || 'Error de autenticación',
        }));
      })
    );
  }

  register(registerUser: any): Observable<any> {
    const queryParams = {
      ip: '127.0.0.1',
      dominio: 'app',
      usuario: 'admin',
      topic: 'usuarios',
      proceso: 'guardar'
    };
    return this.store.dispatch(new AddUser(registerUser, queryParams)).pipe(
      map(() => this.store.selectSnapshot(UsuariosState.getUsuarios))
    );
  }
}
