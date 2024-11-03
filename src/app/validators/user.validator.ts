import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { from, map } from "rxjs";
import { UserService } from "../services/user.service";

export function emailTakenAsyncValidator(userService : UserService): AsyncValidatorFn  {
    return (control: AbstractControl) => {
      const email = control.value;
      const user$ = from(userService.obtenerUsuarioEmail(email))
      return user$.pipe(
        map(user => {
          if (user) {
            return { emailTaken: 'El email ya esta en uso' };
          } 
          return null;
        })
      );
    };
}

export function dniTakenAsyncValidator(userService : UserService): AsyncValidatorFn  {
    return (control: AbstractControl) => {
      const dni = control.value;
      const user$ = from(userService.obtenerUsuarioDni(dni))
      return user$.pipe(
        map(user => {
          if (user) {
            return { dniTaken: 'El DNI ya esta en uso' };
          } 
          return null;
        })
      );
    };
}