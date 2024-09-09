import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAffairComponent } from './create-affair.component';

describe('CreateAffairComponent', () => {
  let component: CreateAffairComponent;
  let fixture: ComponentFixture<CreateAffairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAffairComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAffairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
