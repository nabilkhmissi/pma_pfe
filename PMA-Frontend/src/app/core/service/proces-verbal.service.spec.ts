import { TestBed } from '@angular/core/testing';

import { ProcesVerbalService } from './proces-verbal.service';

describe('ProcesVerbalService', () => {
  let service: ProcesVerbalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesVerbalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
