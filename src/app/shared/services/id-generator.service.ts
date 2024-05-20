import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdGeneratorService {
  constructor() {}

  generateRandomID(length: number): string {
    const charactersPool =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersPoolLength = charactersPool.length;
    let generatedId = '';
    for (let i = 0; i < length; i++) {
      generatedId += charactersPool.charAt(
        Math.floor(Math.random() * charactersPoolLength)
      );
    }
    return generatedId;
  }
}
