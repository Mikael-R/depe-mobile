import { TestBed } from '@angular/core/testing';

import { LogicService } from './logic.service';

describe('LogicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogicService = TestBed.get(LogicService);
    expect(service).toBeTruthy();
  });
});
