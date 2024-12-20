import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiServiceComponent } from './taxi-service.component';

describe('TaxiServiceComponent', () => {
  let component: TaxiServiceComponent;
  let fixture: ComponentFixture<TaxiServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxiServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
