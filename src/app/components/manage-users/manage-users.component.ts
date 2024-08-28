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
 



  private updateSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private ngZone: NgZone
  ) {
    // here we create a new instance of MatTableDataSource initilized with an empty array
    this.dataSource = new MatTableDataSource<UserDTO>([]);
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
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          // Handle error (e.g., show an error message to the user)
        }

      });   
  }

}
errorMessage: string = '';
successMessage: string = '';
isSaving: boolean = false;
private editedUserBackup: Partial<UserDTO> = {}; 

saveUser(user: UserDTO) : void {
  this.isSaving = true;
  user.isEditing = false;
  this.errorMessage = '';
  console.log('Saving user:', user);

  // rn we will store user an updateUser Service , we will give it our user , the service will extract the id of the user
  // the backend will search for that user and update it using the new data
  this.usersService.updateUser(user).subscribe({
    next: updatedUser => {
      console.log('User updated successfully:', updatedUser);
      Object.assign(user, updatedUser);
      this.editedUserBackup = {};
      this.successMessage = 'User updated successfully';
setTimeout(() => this.successMessage = '', 3000);
    },
    error: (error: Error) => {
      console.error('Error updating user:', error);
      this.cancelEdit(user);
      this.errorMessage = error.message;
    }
  }).add(() => {
    this.isSaving = false;
  });
  }


  
  // the type Partial<UserDTO> is the same as UserDTO but everything is optional 

  // so what will happen is , when we click the editUser button
  // we will first change the isEditing boolean to true , so that we will hide the current value
  // and show an form field that we will use to bind inputed data 
editUser(user: UserDTO): void {
  this.editedUserBackup = { ...user }; // When entering edit mode, we create a backup of the user data.
  user.isEditing = true;
  }

  cancelEdit(user: UserDTO) : void {
    Object.assign(user, this.editedUserBackup); // If the user cancels the edit, we restore the original values from the backup.
    user.isEditing = false; // We then exit edit mode and clear the backup.
    this.editedUserBackup = {};
  }

  // Method to filter users based on input
  filterUsers(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

 

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.updateSubscription.unsubscribe();
  }

  
}
