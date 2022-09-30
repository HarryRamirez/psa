import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderProyectosComponent} from './header-proyectos.component';

describe('HeaderProyectosComponent', () => {
  let component: HeaderProyectosComponent;
  let fixture: ComponentFixture<HeaderProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderProyectosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
