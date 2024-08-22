import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { agenciesResolver } from './agencies.resolver';

describe('agenciesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => agenciesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
