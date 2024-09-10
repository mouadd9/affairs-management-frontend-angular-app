import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { affairCountResolver } from './affair-count.resolver';

describe('affairCountResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => affairCountResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
