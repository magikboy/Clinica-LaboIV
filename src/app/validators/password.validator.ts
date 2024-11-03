import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function confirmPasswordValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        
      const clave = formGroup.get('password');
      const repiteClave = formGroup.get('rePassword');
      const respuestaError = { noMatch: 'La contraseña no coincide' };

      if (clave?.value !== repiteClave?.value) {
        formGroup.get('rePassword')?.setErrors(respuestaError);
        return respuestaError;

      } else {
        formGroup.get('rePassword')?.setErrors(null);
        return null;
      }
    };
}