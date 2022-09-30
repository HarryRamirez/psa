import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IncentivosAcuerdosComponent } from "./incentivos-acuerdos.component";

describe("IncentivosAcuerdosComponent", () => {
  let component: IncentivosAcuerdosComponent;
  let fixture: ComponentFixture<IncentivosAcuerdosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncentivosAcuerdosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivosAcuerdosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
