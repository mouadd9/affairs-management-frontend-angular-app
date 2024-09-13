import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAffairEmployeeComponent } from './create-affair-employee.component';

describe('CreateAffairEmployeeComponent', () => {
  let component: CreateAffairEmployeeComponent;
  let fixture: ComponentFixture<CreateAffairEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAffairEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAffairEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
