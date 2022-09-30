import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormDatosBasicosComponent} from './form-datos-basicos.component';

describe('FormDatosBasicosComponent', () => {
  let component: FormDatosBasicosComponent;
  let fixture: ComponentFixture<FormDatosBasicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormDatosBasicosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDatosBasicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
