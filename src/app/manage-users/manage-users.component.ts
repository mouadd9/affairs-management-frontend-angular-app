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
import { UserDTO } from '../model/user.model';
import { UsersService } from '../services/users.service';
import { UserUpdateService } from '../services/user-update.service';
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
    private userUpdateService: UserUpdateService,
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.updateSubscription.unsubscribe();
  }

  // Private method to set up all subscriptions
  private setupSubscriptions(): void {
    this.updateSubscription.add(
      this.userUpdateService.update$.subscribe(() => this.loadUsers())
    );
    this.updateSubscription.add(
      this.userUpdateService.update2$.subscribe(() => this.scrollThenNavigate())
    );
  }

  // Method to load users from the service
  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (users: UserDTO[]) => {
        this.users = users; // we store the users
        this.dataSource.data = this.users; // then we put them as our data source
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  // Method to delete a user
  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(userId).subscribe({
        next: () => {

          this.userUpdateService.updateChart();
          
        },
        error: (error) => console.error('Error deleting user:', error),
      });
    }
  }

  // Method to filter users based on input
  filterUsers(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Method to scroll to the user form
  scrollToForm(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
    setTimeout(() => {
      this.userFormOutlet.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
}
