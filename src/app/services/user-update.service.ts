import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserUpdateService {
  private updateSourceSubject = new Subject<void>();
  private closeCreateUserSection = new Subject<void>();

  update2$ = this.closeCreateUserSection.asObservable();

  update$ = this.updateSourceSubject.asObservable(); // other parts of the app will subscribe to this only which limits their capacity to emit values using .next()

  updateChart() {
    this.updateSourceSubject.next();
  }

  notify2(){
    this.closeCreateUserSection.next();
  }

}
