import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isNotLoggedInGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)
  
  const isLoggedIn = await authService.isLoggedIn(); 

  if (isLoggedIn)
  {
    router.navigateByUrl("/home");
    return false;
  }
  return true;
};
