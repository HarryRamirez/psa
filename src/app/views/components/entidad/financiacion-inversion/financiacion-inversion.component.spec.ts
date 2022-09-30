import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FinanciacionInversionComponent } from "./financiacion-inversion.component";

describe("FinanciacionInversionComponent", () => {
  let component: FinanciacionInversionComponent;
  let fixture: ComponentFixture<FinanciacionInversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinanciacionInversionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanciacionInversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
