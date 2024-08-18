import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CountUpService } from '../services/count-up.service';

@Directive({
  selector: '[appCountUp]'
})
export class CountUpDirective implements OnInit {
  @Input('appCountUp') targetNumber: number = 0;
  @Input() duration: number = 2000; // Duration in milliseconds

  private subscription: Subscription;

  private startNumber: number = 0;
  private initialStepTime: number = 0; // Start with a longer interval

  constructor(private el: ElementRef, 
    private countUpService : CountUpService
  ) {

    this.subscription =  new Subscription;
  }

  ngOnInit() {
    this.subscription = this.countUpService.startAnimation$.subscribe(() => {
      this.animateCount();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private animateCount() {
    const steps = 100; // Fixed number of steps
    const increment = (this.targetNumber - this.startNumber) / steps;
    let currentStep = 0;
  
    const easeOutQuad = (t: number) => t * (2 - t);
  
    const updateNumber = () => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = easeOutQuad(progress);
      const currentNumber = this.startNumber + (this.targetNumber - this.startNumber) * easedProgress;
  
      this.el.nativeElement.textContent = Math.round(currentNumber).toLocaleString();
  
      if (currentStep < steps) {
        // Calculate the next interval, slowing down over time
        const remainingTime = (1 - progress) * this.duration;
        const nextInterval = remainingTime / (steps - currentStep);
        setTimeout(updateNumber, nextInterval);
      } else {
        this.el.nativeElement.textContent = this.targetNumber.toLocaleString();
      }
    };
  
    updateNumber();
  }
}