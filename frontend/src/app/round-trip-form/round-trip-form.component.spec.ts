import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTripFormComponent } from './round-trip-form.component';

describe('RoundTripFormComponent', () => {
  let component: RoundTripFormComponent;
  let fixture: ComponentFixture<RoundTripFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundTripFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoundTripFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
