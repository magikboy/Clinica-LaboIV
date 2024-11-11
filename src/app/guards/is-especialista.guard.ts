import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IEspecialista } from '../interfaces/user.interface';

export const isEspecialistaGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)
  
  const isLoggedIn = await authService.isLoggedIn(); 

  if (isLoggedIn)
  {
    if(authService.userFire?.emailVerified)
    {
      const user = authService.currentUserSignal()!;
      if(user.role == 'especialista')
      {
        const castedUser = user as IEspecialista;
        if (castedUser.estaHabilitado)
          return true;
        else {
          router.navigateByUrl('/not-enabled');
          return false;
        }
      }
      return false;
    }
    router.navigateByUrl('/verify-email');
    return false;
  }

  return false;
};
