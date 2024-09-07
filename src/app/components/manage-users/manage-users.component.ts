import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDTO } from '../../model/user.model';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';
import { NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
})
export class ManageUsersComponent implements OnInit, AfterViewInit {

 

  public users: UserDTO[] = [];
  public showAddUserForm: boolean = false;
  public dataSource: MatTableDataSource<UserDTO>;
  public displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'username', 'roles', 'actions'];

   // ViewChild decorators for accessing DOM elements and Angular Material components
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
   @ViewChild('userFormOutlet') userFormOutlet!: ElementRef;
   @ViewChild('chart') chart!: ElementRef;
 

   errorMessage: string = '';
successMessage: string = '';
isSaving: boolean = false;


  

  private updateSubscription: Subscription = new Subscription();
  editForm: FormGroup | null = null;
  editingUserId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private ngZone: NgZone,
    private fb: FormBuilder
  ) {
    // here we create a new instance of MatTableDataSource initilized with an empty array
    this.dataSource = new MatTableDataSource<UserDTO>([]);
    // Added: Initialize the editForm
    
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
      this.users = data['users'];
      this.dataSource.data = this.users;
    }});
    
    this.setupSubscriptions();
  }

  ngAfterViewInit(): void {
    // Connect the MatTableDataSource with the paginator and sort components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Private method to set up all subscriptions
  private setupSubscriptions(): void {
    this.updateSubscription.add(
      // if we send a signal to the observable "update$" the following will happen
      // - we will repopulate our data source with the new users 
      // - so that when the user clicks save a new user will add up in the table without rebooting the entire component
      // instead of nesting subscription we just used the .pipe() and some operators "l"
      this.usersService.changeUsersState$.subscribe({ // now we subscribe to the new observable
        next: (newUsers: UserDTO[]) => {
          this.users = newUsers;
          this.dataSource.data = this.users;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      })
    )
    this.updateSubscription.add(
      this.usersService.closeUserForm$.subscribe(() => this.scrollThenNavigate())
    );
  }

  // Method to scroll to top and then navigate
  private scrollThenNavigate(): void {
    if (this.chart && this.chart.nativeElement) {
      this.smoothScrollToElement(this.chart.nativeElement)
        .then(() => {
          this.ngZone.run(() => this.router.navigateByUrl('/admin/users'));
        })
        .catch((error) => {
          console.error('Error during scroll:', error);
          this.router.navigateByUrl('/admin/users');
        });
    } else {
      console.warn('Chart element not found, navigating immediately');
      this.router.navigateByUrl('/admin/users');
    }
  }

  // Helper method to perform smooth scrolling
  private smoothScrollToElement(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(resolve, 700);
    });
  }


   // Method to scroll to the user form
   scrollToForm(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
    setTimeout(() => {
      this.userFormOutlet.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

 
  // Method to delete a user
  deleteUser(userId: number): void {

    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(userId).subscribe({
        next: () => {
          this.usersService.changeState();
          this.showSuccess('User deleted successfully');

        },
        error: (error) => {
          console.error('Error deleting user:', error);
          // Handle error (e.g., show an error message to the user)
          this.showError('Unexpected error deleting user.');
        }

      });
  }

}


saveUser(user: UserDTO) : void {
   // First, update the form with the current user data
   if (this.editForm && this.editForm.valid) {
   

    this.isSaving = true;
    console.log("this is the live form")
    console.log(this.editForm.value);
    const updatedUser: UserDTO = {
      ...user,
      ...this.editForm.value
    };
    console.log(updatedUser);

    this.usersService.updateUser(updatedUser).subscribe({
      next: response => {
        Object.assign(user, response);
        this.showSuccess('User updated successfully');
        this.cancelEdit();
      },
      error: (error: Error) => {
        this.showError(error.message);  
      }
    }).add(() => {
      this.isSaving = false;
    });
   } else {
    this.showError('Please fill all required fields correctly');
  }

  }


  
  //  the type Partial<UserDTO> is the same as UserDTO but everything is optional 

  // so what will happen is , when we click the editUser button
  // we will first change the isEditing boolean to true , so that we will hide the current value
  // and show an form field that we will use to bind inputed data 
editUser(user: UserDTO): void {
   // Added: Set form values when entering edit mode
   this.editingUserId = user.id;
    this.editForm = this.fb.group({
      username: [user.username, [Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')]],
      email: [user.email, [Validators.required, Validators.email]],
      lastName: [user.lastName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      firstName: [user.firstName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]]
    });   
  }

  getFormControl(fieldName: string): FormControl {
    return (
      (this.editForm?.get(fieldName) as FormControl) || new FormControl('')
    );
  }

  cancelEdit() : void {
    this.editingUserId = null;
    this.editForm = null;
    }

  // Method to filter users based on input
  filterUsers(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

 

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.updateSubscription.unsubscribe();
  }

  
}
