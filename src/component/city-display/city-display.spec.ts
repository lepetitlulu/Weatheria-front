import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityDisplay } from './city-display';

describe('CityDisplay', () => {
  let component: CityDisplay;
  let fixture: ComponentFixture<CityDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
