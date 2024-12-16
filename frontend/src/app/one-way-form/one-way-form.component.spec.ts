import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneWayFormComponent } from './one-way-form.component';

describe('OneWayFormComponent', () => {
  let component: OneWayFormComponent;
  let fixture: ComponentFixture<OneWayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneWayFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OneWayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
