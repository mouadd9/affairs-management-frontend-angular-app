import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { UserDTO } from '../model/user.model';
import { UserUpdateService } from '../services/user-update.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent implements OnInit {
  myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private userUpdateService: UserUpdateService
  ) {
    // we will inject user service here
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      // each form controle has a key value pair
      username: ['', Validators.required],
      email: ['', Validators.required],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      // here we will send this.myForm.value (json) to our user service and then expect a response
      const formData = this.myForm.value; // this formData contains the role of the user we want to create
      const userToAdd: UserDTO = {
        username: formData.username,
        email: formData.email,
        lastName: formData.lastName,
        firstName: formData.firstName,
        password: formData.password,
      }; // here we exclude the role field

      this.userService.createUser(userToAdd).subscribe({
        // first we create a user with no roles

        next: (createdUser) => {
          console.log('User created:', createdUser); // this is the user created

          // in case the user is created successfully we add the roles
          if (formData.role === 'ADMIN') {
            this.userService.addAdminRole(createdUser.id).subscribe({
              next: () => {
                console.log('Admin role added successfully');
                this.userUpdateService.updateChart(); // Trigger update after role is added
                this.myForm.reset();
                // Optionally, you can set default values for certain fields
                this.myForm.patchValue({
                  role: '' // Reset role to empty string or a default value
                });
              },
              error: (error) =>
                console.error('Error adding admin role:', error),
            });
          } else {
            this.userUpdateService.updateChart(); // Trigger update immediately if not adding admin role
          }
        },
        error: (error) => {
          console.error('Creation failed:', error);
        },
        complete: () => {
          console.log('Creation request completed.');
        },
      });

      // so here we will firstly create a user detached form any role
      // after getting a response CREATED , we will go ahead and add a role via an API call
    }
  }

  goBack() {
    this.userUpdateService.notify2();
  }
}
