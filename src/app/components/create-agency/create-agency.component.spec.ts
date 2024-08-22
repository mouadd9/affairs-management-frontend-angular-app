import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgencyComponent } from './create-agency.component';

describe('CreateAgencyComponent', () => {
  let component: CreateAgencyComponent;
  let fixture: ComponentFixture<CreateAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAgencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
