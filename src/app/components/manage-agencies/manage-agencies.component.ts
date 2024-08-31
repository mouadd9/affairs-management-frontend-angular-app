import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-manage-agencies',
  templateUrl: './manage-agencies.component.html',
  styleUrl: './manage-agencies.component.css',
})
export class ManageAgenciesComponent implements OnInit, AfterViewInit {
  public agencies: Agency[] = [];
  public showAddAgencyForm: boolean = false;
  public dataSource: MatTableDataSource<Agency>;
  displayedColumns: string[] = [
    'id',
    'agencyCode',
    'address',
    'status',
    'creationDate',
    'actions',
  ];
  // ViewChild decorators for accessing DOM elements and Angular Material components
  @ViewChild('agencyPaginator') agencyPaginator!: MatPaginator;
  @ViewChild('agencySort') agencySort!: MatSort;
  @ViewChild('agencyFormOutlet') agencyFormOutlet!: ElementRef;
  @ViewChild('chart') chart!: ElementRef;

  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sorts!: QueryList<MatSort>;

  private employeePaginatorInitialized = false;
  private employeeSortInitialized = false;

  public showEmpl: boolean = false;
  public employees: UserDTO[] = [];
  public employeeDataSource: MatTableDataSource<UserDTO>;
  public employeeDisplayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'username',
    'roles',
    'actions',
  ];

  @ViewChild('employees') employeeSection!: ElementRef;

  public currentAgencyCode!: string;

  private updateSubscription: Subscription = new Subscription();


  editUserForm: FormGroup | null = null;
  editingUserId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private agencyService: AgenciesService,
    private ngZone: NgZone,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    // this is the data source that will be fed to our chart
    this.dataSource = new MatTableDataSource<Agency>([]);
    this.employeeDataSource = new MatTableDataSource<UserDTO>([]);
  }

  ngOnInit(): void {
    // here we will
    this.route.data.subscribe({
      // we subscribe to our route's observable that emits data
      next: (data) => {
        this.agencies = data['agencies']; // we choose the data emitted by our agencies resolver
        this.dataSource.data = this.agencies; // we pass it to our datasource
      },
    });

    this.setupSubscriptions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.agencyPaginator;
    this.dataSource.sort = this.agencySort;
  }

  ngAfterViewChecked() {
    if (
      this.showEmpl &&
      !this.employeePaginatorInitialized &&
      this.paginators.length > 1
    ) {
      this.employeeDataSource.paginator = this.paginators.toArray()[1];
      this.employeePaginatorInitialized = true;
      this.cdr.detectChanges();
    }
    if (
      this.showEmpl &&
      !this.employeeSortInitialized &&
      this.sorts.length > 1
    ) {
      this.employeeDataSource.sort = this.sorts.toArray()[1];
      this.employeeSortInitialized = true;
      this.cdr.detectChanges();
    }
  }

  // Method to filter users based on input
  filterAgencies(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Private method to set up all subscriptions
  private setupSubscriptions(): void {
    this.updateSubscription.add(
      this.agencyService.changeAgenciesState$.subscribe({
        next: (newAgencies) => {
          this.agencies = newAgencies;
          this.dataSource.data = this.agencies;
        },
        error: (error) => console.error('Error deleting user:', error),
      })
    );

    this.updateSubscription.add(
      this.agencyService.closeAgencyForm$.subscribe(() =>
        this.scrollThenNavigate()
      )
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
      this.agencyFormOutlet.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }, 100);
  }

  // we will add three buttons
  // one to edit an agency
  // one to cancel editing an agency
  // one to save change

  // we have two modes (display and edit)
  // display mode : <ng-container *ngIf="user.id !== editingUserId"> {{element.property}} </ng-container>
  // edit mode : <mat-form-field *ngIf="user.id === editingUserId"> </mat-form-field>

  // we initiate editing mode using editUser()
  // editUser()
  // - takes the id of the current element (row) and stores it in a variable called editingUserId
  errorMessage: string = '';
  successMessage: string = '';
  deletionMessage: string = '';
  errorMessage2: string = '';
  successMessage2: string = '';
  deletionMessage2: string = '';

  
  isSaving: boolean = false;
  isDeleting: boolean = false;
  editingAgencyId: any; // this variable will be used to determine which row will be in editing mode
  // for example if we clicked on editAgency we will redeem the id of the exact row we operated on
  // and using our html , we will check for each row if the id of our agency is equal to the one we stored
  // when we stumble upon the row that has the same id thiw line will come in handy :
  // - *ngIf="user.id !== editingUserId" ng-container will be hidden
  // - *ngIf="user.id === editingUserId" if a row's element's id === the one submitted whene we clicked on edit button
  // then we show something else

  // when we press edit we will not just hide buttons and show them
  // but edit will allow us to create a form group
  // here we should note that in classic cases we used to create the form group upon the creation of the component
  // now for each row we should create a form group
  // so by clicking edit , we create a formgroup, we put validators
  // then by clicking save we submit the validated form

  // we should create a method that will safely get a specific form control from the form group
  getFormControl(fieldName: string): FormControl {
    // what's interesting is that this method will serve its purpose only when we press edit to edit a certain row
    // when we press edit, a form group will be created then form controls will be assigned to the rendered inputs
    // [formControl] binds the input directly to the FormControl returned by getFormControl
    return (
      (this.editForm?.get(fieldName) as FormControl) || new FormControl('')
    );
  }

  /*
    When editUser is called, it creates a FormGroup with initial values from the user object.
In the template, getFormControl('firstName') retrieves the 'firstName' FormControl from this FormGroup.
Angular's [formControl] directive sets up two-way binding:

It sets the input's value to the FormControl's value.
It updates the FormControl's value when the input changes.


This binding persists as long as the row is in edit mode. */
  editForm: FormGroup | null = null;

  editAgency(agency: Agency): void {
    this.editingAgencyId = agency.id; // this will trigger the changes
    this.editForm = this.fb.group({
      // here we will put form controls in other words the inputs we are submitting
      // agencyCode (unique/required)
      // address (required)
      // status (suspended or actif)
      agencyCode: [agency.agencyCode, Validators.required],
      address: [agency.address, Validators.required],
      status: [agency.status, Validators.required],
    });
  }

  cancelEdit(): void {
    this.editingAgencyId = null;
    this.editForm = null;
  }



  saveChanges(agency: Agency): void {
    if (this.editForm && this.editForm?.valid) {
      this.isSaving = true;
      // we update Optimisticaly
      // so we create a new agency with the new fields from the form
      // then we replace the old one by it
      const updatedAgency: Agency = {
        ...agency,
        ...this.editForm.value,
      };

      // then we will go ahead and call the API responsible for updating the agency
      console.log('this agency will be sent to the backend to be registered');
      console.log(updatedAgency);
      console.log(
        ' we will either get an error saying that the agencyCode is taken or we will get a success message saying that agency has been registered '
      );

      this.agencyService
        .updateAgency(updatedAgency)
        .subscribe({
          next: (response) => {
            // now we replace the old agency with the new one
            Object.assign(agency, response);
            this.successMessage = 'Agency updated successfully';
            setTimeout(() => (this.successMessage = ''), 3000);
            this.cancelEdit();
          },

          error: (error: Error) => {
            this.errorMessage = error.message;
            setTimeout(() => (this.errorMessage = ''), 3000);
          },
        })
        .add(() => {
          this.isSaving = false;
        });
    } else {
      // in case we press the save button while the form is not valid
      this.errorMessage = 'Please fill all required fields correctly';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  // Method to delete a user
  deleteAgency(AgencyId: number): void {
    if (confirm('Are you sure you want to delete this agency?')) {
      this.isDeleting = true;
      this.agencyService
        .deleteAgency(AgencyId)
        .subscribe({
          next: (response) => {
            console.log(response);
            console.log('Agency deleted successfully');
            // Handle successful deletion
            this.agencyService.changeState();
            this.deletionMessage = 'agency deleted successfully';
            setTimeout(() => (this.deletionMessage = ''), 2000);
          },
          error: (error: Error) => {
            this.errorMessage = error.message;
            setTimeout(() => (this.errorMessage = ''), 3000);
          },
        })
        .add(() => {
          this.isDeleting = false;
        });
    }
  }

  showEmployees(agencyID: number, agencyCode: string) {
    this.usersService.getUsersByAgency(agencyID).subscribe({
      next: (employees: UserDTO[]) => {
        console.log('Employees fetched:', employees);
        this.employees = employees;
        this.currentAgencyCode = agencyCode;
        this.employeeDataSource.data = this.employees;

        this.showEmpl = true;

        this.employeePaginatorInitialized = false;
        this.employeeSortInitialized = false;

        this.cdr.detectChanges();

        console.log('Employee data source:', this.employeeDataSource.data);

        setTimeout(() => {
          this.employeeSection.nativeElement.scrollIntoView({
            behavior: 'smooth',
          });
        }, 100);
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      },
    });
    // first we fetch for the employees of this agency
    // then we populate the table then we show it
  }


 

  isDeletingUser: boolean = false;

  // Method to delete a user
  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isDeletingUser = true;
      this.usersService.deleteUser(userId).subscribe({
        next: () => {
          this.employeeDataSource.data = this.employees.filter(
            (employee) => employee.id != userId
          );

          this.deletionMessage2 = 'User deleted successfully';
          setTimeout(() => this.deletionMessage2 = '', 2000);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          // Handle error (e.g., show an error message to the user)
        },
      }).add(()=> {
        this.isDeletingUser = false;
      }); ;
    }
  }



  isSavingUser: boolean = false;

saveUser(user: UserDTO) : void {
   // First, update the form with the current user data
   if (this.editUserForm && this.editUserForm.valid) {
   

    this.isSavingUser = true;
    console.log("this is the live form")
    console.log(this.editUserForm.value);
    const updatedUser: UserDTO = {
      ...user,
      ...this.editUserForm.value
    };
    console.log(updatedUser);

    this.usersService.updateUser(updatedUser).subscribe({
      next: response => {
        Object.assign(user, response);
        this.successMessage2 = 'User updated successfully';
        setTimeout(() => this.successMessage2 = '', 3000);
        this.cancelEdit();
      },
      error: (error: Error) => {
        
        this.errorMessage2 = error.message;
        setTimeout(() => this.errorMessage2 = '', 3000);
  
  
      }
    }).add(() => {
      this.isSavingUser = false;
    });



   } else {
    this.errorMessage2 = 'Please fill all required fields correctly';
    setTimeout(() => this.errorMessage2 = '', 3000);
  }
    

    

    // Create an updated user object with the form values
   
  
  }

  editUser(user: UserDTO): void {

    // Added: Set form values when entering edit mode
    this.editingUserId = user.id;
     this.editUserForm = this.fb.group({
       firstName: [user.firstName, Validators.required],
       lastName: [user.lastName, Validators.required],
       email: [user.email, [Validators.required, Validators.email]],
       username: [user.username, Validators.required]
     });
     console.log("this is the created form group");
     console.log(this.editUserForm.value);
 
    
   }


   cancelUserEdit() : void {
    this.editingUserId = null;
    this.editUserForm = null;
    }
 
   getUserFormControl(fieldName: string): FormControl {
     return this.editUserForm?.get(fieldName) as FormControl || new FormControl('');
   }



  goBack() {
    this.chart.nativeElement.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      this.showEmpl = false;
    }, 250);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.updateSubscription.unsubscribe();
  }
}

// first we will create an observable
// when we subscribe to this observable we will update the chart





