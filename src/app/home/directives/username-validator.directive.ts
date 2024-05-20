import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';


export function usernameValidator(control: AbstractControl): ValidationErrors | null {
  const username = control.value;
  if (!username) {
    return { invalidUsername: "El usuario es obligatorio" };
  }

  if (username.length < 4 || username.length > 20) {
    return { invalidUsername: "El usuario debe tener entre 4 y 20 caracteres." };
  }
  const validChars = /^[a-zA-Z][a-zA-Z0-9._]*$/;

  if (!validChars.test(username)) {
    return { invalidUsername: "El usuario debe comenzar con una letra y solo se permiten letras, números, puntos y guiones bajos." };
  }
  const startsOrEndsWithSpecialChar = /^[._]|[._]$/;
  if (startsOrEndsWithSpecialChar.test(username)) {
    return { invalidUsername: "El usuario no debe comenzar ni terminar con un punto o guion bajo." };
  }
  const consecutiveSpecialChars = /[._]{2,}/;
  if (consecutiveSpecialChars.test(username)) {
    return { invalidUsername: "El usuario no debe contener puntos o guiones bajos consecutivos." };
  }
  if (/\s/.test(username)) {
    return { invalidUsername: "El usuario no debe contener espacios." };
  }
  const reservedWords = ["admin", "root", "support"];
  if (reservedWords.includes(username.toLowerCase())) {
    return { invalidUsername: "El usuario contiene palabras reservadas." };
  }
  return null;
}

@Directive({
  selector: '[usernameValidator]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: UsernameValidatorDirective, multi: true }]
})
export class UsernameValidatorDirective {

  validate(control: AbstractControl): ValidationErrors | null {
    return usernameValidator(control);
  }

}
