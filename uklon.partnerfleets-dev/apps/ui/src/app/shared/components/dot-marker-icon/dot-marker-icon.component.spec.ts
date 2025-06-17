import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotMarkerIconComponent } from './dot-marker-icon.component';

describe('DotMarkerIconComponent', () => {
  let component: DotMarkerIconComponent;
  let fixture: ComponentFixture<DotMarkerIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotMarkerIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DotMarkerIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
