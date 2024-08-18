import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { UsersResolver } from './users.resolver';

describe('usersResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => usersResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
