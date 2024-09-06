import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { affairsResolver } from './affairs.resolver';

describe('affairsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => affairsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
