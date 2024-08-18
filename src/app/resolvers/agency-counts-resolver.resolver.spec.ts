import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { agencyCountsResolverResolver } from './agency-counts-resolver.resolver';

describe('agencyCountsResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => agencyCountsResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
