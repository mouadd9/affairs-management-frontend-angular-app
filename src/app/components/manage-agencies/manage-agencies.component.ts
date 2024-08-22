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
import { Agency } from '../../model/agency.model';
import { AgenciesService } from '../../services/agencies.service';

@Component({
  selector: 'app-manage-agencies',
  templateUrl: './manage-agencies.component.html',
  styleUrl: './manage-agencies.component.css'
})



export class ManageAgenciesComponent implements OnInit, AfterViewInit {

 
  
  public agencies: Agency[] = [];
  public showAddAgencyForm: boolean = false;
  public dataSource: MatTableDataSource<Agency>;
displayedColumns: string[] = ['id', 'agencyCode', 'address', 'status', 'creationDate', 'delete', 'employees'];
   // ViewChild decorators for accessing DOM elements and Angular Material components
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
   @ViewChild('agencyFormOutlet') agencyFormOutlet!: ElementRef;
   @ViewChild('chart') chart!: ElementRef;



   public showEmpl: boolean = false;
   public employees: UserDTO[] = [];
   public employeeDataSource: MatTableDataSource<UserDTO>;
   public employeeDisplayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'username', 'roles', 'actions']; 
   @ViewChild('employeePaginator') employeePaginator!: MatPaginator;
   @ViewChild('employeeSort') employeeSort!: MatSort;
   @ViewChild('employees') employeeSection! : ElementRef;


   public currentAgencyCode!: string;
 
  private updateSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private agencyService: AgenciesService,
    private ngZone: NgZone,
    private usersService: UsersService 
  ) {
    // this is the data source that will be fed to our chart
    this.dataSource = new MatTableDataSource<Agency>([]);
    this.employeeDataSource = new MatTableDataSource<UserDTO>([]);
  }

  ngOnInit(): void {
    // here we will 
    this.route.data.subscribe({ // we subscribe to our route's observable that emits data
      next: data => {
      this.agencies = data['agencies']; // we choose the data emitted by our agencies resolver
      this.dataSource.data = this.agencies; // we pass it to our datasource
    }});

    this.setupSubscriptions();
    
  }

  ngAfterViewInit(): void {
    // Connect the MatTableDataSource with the paginator and sort components
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.employeeDataSource.paginator = this.employeePaginator;
    this.employeeDataSource.sort = this.employeeSort;
  }

   // Method to filter users based on input
   filterAgencies(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employeeDataSource.filter = filterValue.trim().toLowerCase();
  }
  
  // Private method to set up all subscriptions
  private setupSubscriptions(): void {
    this.updateSubscription.add(

      this.agencyService.changeAgenciesState$.subscribe({
        next: newAgencies => {
          this.agencies = newAgencies;
          this.dataSource.data = this.agencies;
        },
        error: (error) => console.error('Error deleting user:', error)
        
      })

    );

    this.updateSubscription.add(
      this.agencyService.closeAgencyForm$.subscribe(() => this.scrollThenNavigate())
    );
  } 
  
  private scrollThenNavigate(): void {
    if (this.chart && this.chart.nativeElement) {
      this.smoothScrollToElement(this.chart.nativeElement)
        .then(() => {
          this.ngZone.run(() => this.router.navigateByUrl('/admin/agencies'));
        })
        .catch((error) => {
          console.error('Error during scroll:', error);
          this.router.navigateByUrl('/admin/agencies');
        });
    } else {
      console.warn('Chart element not found, navigating immediately');
      this.router.navigateByUrl('/admin/agencies');
    }
  } 

 
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
      this.agencyFormOutlet.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } 


    // Method to delete a user
    deleteAgency(AgencyId: number): void {
      if (confirm('Are you sure you want to delete this agency?')) {
        this.agencyService.deleteAgency(AgencyId).subscribe({
          next: (response) => {
            console.log(response);
            console.log('Agency deleted successfully');
            // Handle successful deletion
            this.agencyService.changeState();
          },
          error: (err) => {
            if (err.message === 'The agency has users.') {
              // Handle CONFLICT error specifically
              console.warn('The agency cannot be deleted due to existing dependencies.');
              
            } else {
              // Handle other errors
              console.error('Error: ', err.message);
            }
          }
        });
        
      }
    }

  showEmployees(agencyID: number , agencyCode: string) {

    this.usersService.getUsersByAgency(agencyID).subscribe({
      next: (employees: UserDTO[]) => {
        console.log('Employees fetched:', employees);
        this.employees = employees;
        this.currentAgencyCode = agencyCode;
        this.employeeDataSource.data = this.employees;
        this.showEmpl = true;
        console.log('Employee data source:', this.employeeDataSource.data);

        setTimeout(() => {
          this.employeeSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
    // first we fetch for the employees of this agency 
    // then we populate the table then we show it 
    }


    
  // Method to delete a user
  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(userId).subscribe({
        next: () => {
          this.employeeDataSource.data = this.employees.filter(employee => employee.id != userId);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          // Handle error (e.g., show an error message to the user)
        }

      });
      
  }
  
}

goBack() {
 
    this.chart.nativeElement.scrollIntoView({ behavior: 'smooth' });
 
  setTimeout(()=> {
    this.showEmpl = false;
  }, 250)
}


ngOnDestroy(): void {
  // Unsubscribe from all subscriptions to prevent memory leaks
  this.updateSubscription.unsubscribe();
}


}


// first we will create an observable 
// when we subscribe to this observable we will update the chart 