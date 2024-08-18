import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userCountsResolver } from './user-counts.resolver';

describe('userCountsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => userCountsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
