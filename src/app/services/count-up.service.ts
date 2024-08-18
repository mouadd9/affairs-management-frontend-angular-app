import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountUpService {
  private startAnimation = new Subject<void>();

  startAnimation$ = this.startAnimation.asObservable();

  triggerAnimation() {
    this.startAnimation.next();
  }
}