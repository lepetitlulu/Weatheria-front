import { TestBed } from '@angular/core/testing';

import { DataMeteo } from './data-meteo';

describe('Test', () => {
  let service: DataMeteo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataMeteo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
