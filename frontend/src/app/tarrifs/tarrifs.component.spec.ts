import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarrifsComponent } from './tarrifs.component';

describe('TarrifsComponent', () => {
  let component: TarrifsComponent;
  let fixture: ComponentFixture<TarrifsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarrifsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarrifsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
