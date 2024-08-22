import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UserDTO } from '../../model/user.model';
import { AgenciesService } from '../../services/agencies.service';
import { Agency } from '../../model/agency.model';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent implements OnInit {
  myForm!: FormGroup;

  public activeAgencies: Agency[] = [];
  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private agencyService: AgenciesService
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
      agency: ['']
    });

    this.fetchActiveAgencies();

    this.myForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'AGENCY_EMPLOYEE') {
        this.myForm.get('agency')?.setValidators(Validators.required);
      } else {
        this.myForm.get('agency')?.clearValidators();
      }
      this.myForm.get('agency')?.updateValueAndValidity();
    });


  }
  
  

  fetchActiveAgencies(): void {
    this.agencyService.getAllAgencies().subscribe({
      next: data => {
        this.activeAgencies = data.filter(agency => agency.status === 'ACTIVE');
      },
      error: (error) => console.error('Error fetching agencies:', error)
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      // here we will send this.myForm.value (json) to our user service and then expect a response
      const formData = this.myForm.value; // this formData contains the role of the user we want to create
      console.log(formData);
      const userToAdd: UserDTO = {
        username: formData.username,
        email: formData.email,
        lastName: formData.lastName,
        firstName: formData.firstName,
        password: formData.password,
      }; // here we exclude the role field

      const agencyId = formData.agency;
      console.log(agencyId);

      this.userService.createUser(userToAdd).subscribe({
        // first we create a user with no roles

        next: (createdUser) => {
          console.log('User created:', createdUser); // this is the user created
          console.log(formData.role);
          console.log(createdUser.id)
          console.log(agencyId)

          // in case the user is created successfully we add the roles
          if (formData.role === 'ADMIN') {
            this.userService.addAdminRole(createdUser.id).subscribe({
              next: () => {
                console.log('Admin role added successfully');
                this.userService.changeState(); // so after we alter data we should update the chart
                // in user service we created a subject that emits data 
                // a subject is an observable but a more flexible observable , meaning we can control when will it emmit data by using .next 
                // so in our service we will have two main things : 
                // 1- a public subject that we can subscribe to 
                // 2- and a method that sends data to the subject to execute a change in state

                // in this specific use case we notify another component to refresh users
                this.myForm.reset();
                // Optionally, you can set default values for certain fields
                this.myForm.patchValue({
                  role: '' // Reset role to empty string or a default value
                });
              },
              error: (error) =>
                console.error('Error adding admin role:', error),
            });
          } else if (formData.role === 'AGENCY_EMPLOYEE'){
            this.userService.addEmployeeRole(createdUser.id, agencyId).subscribe({
              next: () => {
                console.log('Employee role added successfully');
                this.userService.changeState(); // Trigger update after role is added
                this.myForm.reset();
                // Optionally, you can set default values for certain fields
                this.myForm.patchValue({
                  role: '' // Reset role to empty string or a default value
                });
              },
              error: (error) =>
                console.error('Error adding admin role:', error),
            })


          }else {
            this.userService.changeState(); // Trigger update immediately if not adding admin role
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
    this.userService.closeForm();
  }
}
