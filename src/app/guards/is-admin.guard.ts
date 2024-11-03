import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAdminGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)
  
  const isLoggedIn = await authService.isLoggedIn(); 

  if (isLoggedIn)
  {
    if(authService.userFire?.emailVerified)
    {
      const user = authService.currentUserSignal()!;
      if(user.role == 'admin')
      {
        return true;
      }
      return false;
    }
    router.navigateByUrl('/verify-email');
    return false;
  }

  return false;
};
