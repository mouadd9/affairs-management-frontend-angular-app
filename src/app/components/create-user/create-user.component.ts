import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UserDTO } from '../../model/user.model';
import { AgenciesService } from '../../services/agencies.service';
import { Agency } from '../../model/agency.model';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  myForm!: FormGroup;
  public activeAgencies: Agency[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isCreatingUser: boolean = false;
  hidePassword = true; 

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private agencyService: AgenciesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchActiveAgencies();
    this.handleRoleChanges();
  }

  private initForm(): void {
    this.myForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')]],
      email: ['', [Validators.required, Validators.email]],
      lastName: ['',[ Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      firstName: ['',[ Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')]],
      role: ['', Validators.required],
      agency: ['']
    });
  }

  private handleRoleChanges(): void {
    this.myForm.get('role')?.valueChanges.subscribe(role => {
      const agencyControl = this.myForm.get('agency');
      if (role === 'AGENCY_EMPLOYEE') {
        agencyControl?.setValidators(Validators.required);
      } else {
        agencyControl?.clearValidators();
      }
      agencyControl?.updateValueAndValidity();
    });
  }

  fetchActiveAgencies(): void {
    this.agencyService.getAllAgencies().subscribe({
      next: data => {
        this.activeAgencies = data.filter(agency => agency.status === 'ACTIVE');
      },
      error: (error) => {
        console.error('Error fetching agencies:', error);
        this.showError('Failed to fetch agencies. Please try again.');
      }
    });
  }

  onSubmit(): void {
    
    if (this.myForm.valid) {
      this.isCreatingUser = true;
      const formData = this.myForm.value;
      const userToAdd: UserDTO = {
        username: formData.username,
        email: formData.email,
        lastName: formData.lastName,
        firstName: formData.firstName,
        password: formData.password,
      };

      this.userService.createUser(userToAdd).subscribe({
        next: (createdUser) => {
          if (formData.role === 'ADMIN') {
            this.addAdminRole(createdUser.id);
          } else if (formData.role === 'AGENCY_EMPLOYEE') {
            this.addEmployeeRole(createdUser.id, formData.agency);
          } else {
            this.handleSuccessfulCreation();
          }
        },
        error: (error) => {
          console.error('User creation failed:', error);
          this.showError(error.message || 'Failed to create user. Please try again.');
          // this.isCreatingUser = false;
        },
        complete: () => {
          this.isCreatingUser = false;
        }
      });
    } else {
      console.log( this.myForm.value);
      this.markAllFieldsAsTouched();
      this.showError('Please fill all required fields correctly');
    }
  }
  markAllFieldsAsTouched() {
    Object.keys(this.myForm.controls).forEach(key => {
      const control = this.myForm.get(key);
      control?.markAsTouched();
    });
  }
  private addAdminRole(userId?: number): void {
    this.userService.addAdminRole(userId).subscribe({
      next: () => this.handleSuccessfulCreation(),
      error: (error) => {
        console.error('Error adding admin role:', error);
        this.showError('Failed to add admin role. Please try again.');
        this.isCreatingUser = false;
      }
    });
  }

  private addEmployeeRole(userId?: number, agencyId?: number): void {
    this.userService.addEmployeeRole(userId, agencyId).subscribe({
      next: () => this.handleSuccessfulCreation(),
      error: (error) => {
        console.error('Error adding employee role:', error);
        this.showError('Failed to add employee role. Please try again.');
        this.isCreatingUser = false;
      }
    });
  }

  private handleSuccessfulCreation(): void {
    this.userService.changeState();
    this.showSuccess('User created successfully');
    
    this.myForm.reset();
    this.myForm.patchValue({ role: '' });
    this.isCreatingUser = false;
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();  // Prevent the form from submitting
    this.hidePassword = !this.hidePassword;
  }

  showError(message: string) {
    this.successMessage = '';
    this.errorMessage = message;
    
    setTimeout(() => this.errorMessage = '', 7000);
  }

  showSuccess(message: string) {
    this.errorMessage = '';
    this.successMessage = message;
    
    setTimeout(() => this.successMessage = '', 7000);
  }

 

  goBack() {
    this.userService.closeForm();
  }
}