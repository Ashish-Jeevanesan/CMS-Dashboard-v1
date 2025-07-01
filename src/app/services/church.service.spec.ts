import { TestBed } from '@angular/core/testing';

import { ChurchService } from './church.service';

describe('ChurchService', () => {
  let service: ChurchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChurchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
