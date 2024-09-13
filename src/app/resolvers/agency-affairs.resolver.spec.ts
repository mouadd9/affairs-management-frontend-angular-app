import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { agencyAffairsResolver } from './agency-affairs.resolver';

describe('agencyAffairsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => agencyAffairsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
