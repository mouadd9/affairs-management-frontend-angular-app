import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { UserDTO } from '../model/user.model';  // Adjust the path as needed
import { UsersService } from '../services/users.service'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})

export class UsersResolver implements Resolve<UserDTO[]> {
  constructor(private usersService: UsersService) {}
  resolve(): Observable<UserDTO[]> {
    return this.usersService.getAllUsers();
  }

}
