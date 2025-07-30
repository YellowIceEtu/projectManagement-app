import { TestBed } from '@angular/core/testing';

import { ConfirmServiceService } from './confirm-service.service';

describe('ConfirmServiceService', () => {
  let service: ConfirmServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
