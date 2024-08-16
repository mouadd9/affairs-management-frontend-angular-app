import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router , ActivatedRoute} from '@angular/router';
import { UserDTO } from '../model/user.model';
import { UsersService } from '../services/users.service';
import { UserUpdateService } from '../services/user-update.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit, AfterViewInit {



  public users: UserDTO[] = []; // here we declare the users array

  public showAddUserForm: boolean = false;

  // this is a variable of type MatTableDataSource<any> meaning 
  // it will be used to configure data for a mat table
  public dataSource: MatTableDataSource<UserDTO>;
  // another way to do this is :
  // public dataSource: any;

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  // we take the paginator declared in our html
  @ViewChild(MatSort) sort! : MatSort;

  @ViewChild('userFormOutlet') userFormOutlet!: ElementRef; // Reference to the router outlet

  // we should declare the displayed column (an array of strings)
  public displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'username', 'roles', 'actions'];

  private updateSubscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private userUpdateService: UserUpdateService
  ){
    // here we create a new instance of MatTableDataSource initilized with an empty array 
    this.dataSource = new MatTableDataSource<UserDTO>([]);
  }

  ngOnInit(): void {
   
    this.loadUsers(); // this method will connect to the User service and load users to the data source
    this.updateSubscription = this.userUpdateService.update$.subscribe({
      next: () => this.loadUsers()
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();

    }
    
  }

  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (users: UserDTO[]) => {
        this.users = users; // so we store the users
        this.dataSource.data = this.users; // then we put them as our data source
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
    
  }


  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(userId).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(user => user.id !== userId);
          // Optionally, show a success message
        },
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }

  filterUsers(event: Event): void {
    let value: string = (event.target as HTMLInputElement).value;
    this.dataSource.filter= value;
    
  }

  navigateToAddUser(): void {
    // this.router.navigate(['/users/create']); 
    this.router.navigate(['create'], { relativeTo: this.route });
    this.scrollToForm();

  }

  scrollToForm(): void {
    setTimeout(() => {
      this.userFormOutlet.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 70); // Adding a slight delay to ensure the navigation has occurred
  }
   

}
