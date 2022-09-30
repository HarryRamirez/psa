import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPSAComponent } from './register-psa.component';

describe('RegisterPSAComponent', () => {
  let component: RegisterPSAComponent;
  let fixture: ComponentFixture<RegisterPSAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterPSAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPSAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
