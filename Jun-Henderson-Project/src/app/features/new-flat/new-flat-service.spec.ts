import { TestBed } from '@angular/core/testing';

import { NewFlatService } from './new-flat-service';

describe('NewFlatService', () => {
  let service: NewFlatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewFlatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
