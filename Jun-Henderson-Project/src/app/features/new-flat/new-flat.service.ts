import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Flat } from './new-flat.model';

@Injectable({
  providedIn: 'root'
})
export class NewFlatService {
  
  createFlat(flat: Flat): Observable<Flat> {
    console.log('[NewFlatService] creating  Flat (stub):', flat);
    const id = 
    (globalThis.crypto?.randomUUID() ?? String(Date.now()));
    return of ({
      ...flat,
      id }).pipe(delay(500));
    }
}
