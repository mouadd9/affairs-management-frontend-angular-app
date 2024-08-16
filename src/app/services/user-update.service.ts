import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserUpdateService {
  private updateSourceSubject = new Subject<void>();

  update$ = this.updateSourceSubject.asObservable(); // other parts of the app will subscribe to this only which limits their capacity to emit values using .next()

  notify() {
    this.updateSourceSubject.next();
  }

}
