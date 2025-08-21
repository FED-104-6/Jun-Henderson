import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFlat } from './view-flat';

describe('ViewFlat', () => {
  let component: ViewFlat;
  let fixture: ComponentFixture<ViewFlat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFlat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFlat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
