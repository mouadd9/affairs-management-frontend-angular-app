

import { Component, ElementRef, HostListener, OnInit, ViewChild  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AffairsService } from '../../services/affairs.service';
import { AffairDTO } from '../../model/affair-dto.interface';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-manage-affairs-employee',
  templateUrl: './manage-affairs-employee.component.html',
  styleUrl: './manage-affairs-employee.component.css'
})

export class ManageAffairsEmployeeComponent implements OnInit {
  affairs: AffairDTO[] = []; // this will hold affairs fetched by the resolvers
  dataSource: MatTableDataSource<AffairDTO>;

  displayedColumns: string[] = [
    'codeAgence',
    'typeFinancement',
    'typeIntervention',
    'cible',
    'actions'
  ];

  expandedColumns: string[] = [
    'codeAgence',
    'typeFinancement',
    'typeIntervention',
    'cible',
    'nomBeneficiaire',
    'prenomBeneficiaire',
    'numeroCNIEBeneficiaire',
    'genreBeneficiaire',
    'dateDeNaissanceBeneficiaire',
    'numeroFinancementBanque',
    'objetDuFinancement',
    'montantDuFinancement',
    'coutAcquisition',
    'tauxDeMarge',
    'margeSurDiffere',
    'apportDuBeneficiaire',
    'prixLogement',
    'duree',
    'numeroTF', 'natureDuTF', 'acquisitionIndivision', 'adresseLogement',
  'codeVille', 'superficie', 'vendeurLogement',
  'nomCoIndivisaire', 'prenomCoIndivisaire', 'numeroCNIECoIndivisaire',
  'genreCoIndivisaire', 'liaisonFamilialeCoIndivisaire',
    'actions'
  ];

  

  groupHeaders: string[] = ['generalInfo'];

  errorMessage: string = '';
  successMessage: string = '';
  isSaving: boolean = false;
  showDetailedView: boolean = false;
  showScrollTopButton: boolean = false;

  private updateSubscription: Subscription = new Subscription();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('affairFormOutlet') affairFormOutlet!: ElementRef;
  @ViewChild('chart') chart!: ElementRef;

  editForm: FormGroup | null = null;
  editingAffairId: any;
  ngZone: any;

  constructor(
    private affairsService: AffairsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<AffairDTO>([]);
  }

  ngOnInit() {
    this.route.data.subscribe({
      next: (data) => {
        this.affairs = data['affairs']; // Get affairs from the resolver
        this.initializeDataSources(); // Populate tables
      },
      error: (error) => console.error('Error fetching affairs:', error),
    });
    
    this.setupSubscriptions();
  }

  initializeDataSources() {
    this.dataSource.data = this.affairs;
    console.log('data fetched from the server: ');
    console.log(this.dataSource.data);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  private setupSubscriptions(): void {
    this.updateSubscription.add(
      // if we send a signal to the observable "update$" the following will happen
      // - we will repopulate our data source with the new users 
      // - so that when the user clicks save a new user will add up in the table without rebooting the entire component
      // instead of nesting subscription we just used the .pipe() and some operators "l"
      this.affairsService.changeAffairsState2$.subscribe({ // now we subscribe to the new observable
        next: (newAffairs: AffairDTO[]) => {
          this.affairs = newAffairs;
          this.dataSource.data = this.affairs;
        },
        error: (error) => {
          console.error('Error fetching affairs:', error);
        },
      })
    )
    this.updateSubscription.add(
      this.affairsService.closeAffairForm$.subscribe(() => this.scrollThenNavigate())
    );
  }

  // Method to scroll to top and then navigate
  private scrollThenNavigate(): void {
    if (this.chart && this.chart.nativeElement) {
      this.smoothScrollToElement(this.chart.nativeElement)
        .then(() => {
          this.ngZone.run(() => this.router.navigateByUrl('/agencyEmployee/affairs'));
        })
        .catch((error) => {
          console.error('Error during scroll:', error);
          this.router.navigateByUrl('/agencyEmployee/affairs');
        });
    } else {
      console.warn('Chart element not found, navigating immediately');
      this.router.navigateByUrl('/agencyEmployee/affairs');
    }
  }

  // Helper method to perform smooth scrolling
  private smoothScrollToElement(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(resolve, 700);
    });
  }



  isTransitioning: boolean = false;

  toggleDetailedView() {
    this.isTransitioning = true;
    this.showDetailedView = !this.showDetailedView;
    if (this.showDetailedView) {
      this.groupHeaders= ['generalInfo', 'beneficiaireInfo', 'financementInfo', 'logementInfo' , 'CoindivisaireInfo'];

      this.displayedColumns = this.expandedColumns;
    } else {
      this.groupHeaders = ['generalInfo'];
      this.displayedColumns =  [
        'codeAgence',
        'typeFinancement',
        'typeIntervention',
        'cible',
        'actions'
      ]; 
      

    }

    setTimeout(() => {
      this.isTransitioning = false;
    }, 300);
  }

  // edit

  editAffair(affair: AffairDTO): void {
    if(!this.showDetailedView){this.toggleDetailedView();}
    
    this.editingAffairId = affair.id;
    this.editForm = this.fb.group({
      typeFinancement: [affair.typeFinancement, Validators.required],
      typeIntervention: [affair.typeIntervention, [Validators.required]],
      cible: [affair.cible, Validators.required],
      nomBeneficiaire: [affair.nomBeneficiaire, Validators.required],
      prenomBeneficiaire: [affair.prenomBeneficiaire, Validators.required],
      numeroCNIEBeneficiaire: [
        affair.numeroCNIEBeneficiaire,
        Validators.required,
      ],
      genreBeneficiaire: [affair.genreBeneficiaire, Validators.required],
      dateDeNaissanceBeneficiaire: [
        new Date(affair.dateDeNaissanceBeneficiaire),
        Validators.required,
      ],
      numeroFinancementBanque: [affair.numeroFinancementBanque, Validators.required],
      objetDuFinancement: [affair.objetDuFinancement, Validators.required],
      montantDuFinancement: [affair.montantDuFinancement, [Validators.required, Validators.min(0)]],
      coutAcquisition: [affair.coutAcquisition, [Validators.required, Validators.min(0)]],
      tauxDeMarge: [affair.tauxDeMarge, [Validators.required, Validators.min(0), Validators.max(100)]],
      margeSurDiffere: [affair.margeSurDiffere, Validators.required],
      apportDuBeneficiaire: [affair.apportDuBeneficiaire, [Validators.required, Validators.min(0)]],
      prixLogement: [affair.prixLogement, [Validators.required, Validators.min(0)]],
      duree: [affair.duree, [Validators.required, Validators.min(1)]],
      numeroTF: [affair.numeroTF, Validators.required],
    natureDuTF: [affair.natureDuTF, Validators.required],
    acquisitionIndivision: [affair.acquisitionIndivision, Validators.required],
    adresseLogement: [affair.adresseLogement, Validators.required],
    codeVille: [affair.codeVille, Validators.required],
    superficie: [affair.superficie, [Validators.required, Validators.min(1)]],
    vendeurLogement: [affair.vendeurLogement, Validators.required],
    nomCoIndivisaire: [affair.nomCoIndivisaire || ''],
    prenomCoIndivisaire: [affair.prenomCoIndivisaire || ''],
    numeroCNIECoIndivisaire: [affair.numeroCNIECoIndivisaire || ''],
    genreCoIndivisaire: [affair.genreCoIndivisaire || ''],
    liaisonFamilialeCoIndivisaire: [affair.liaisonFamilialeCoIndivisaire || ''],
      // here we will add other fields
    });
  }

  cancelEdit(): void {
    this.editingAffairId = null;
    this.editForm = null;
    this.toggleDetailedView();
  }

  saveChanges(affair: AffairDTO): void {
    if (this.editForm && this.editForm?.valid) {
      this.isSaving = true;
      const updatedAffair: AffairDTO = { ...affair, ...this.editForm.value }; // 1

      // new affair
      console.log('new affair after update: ');
      console.log(updatedAffair);

      this.affairsService // 2
        .updateAffair(updatedAffair)
        .subscribe({
          next: (response) => {
            Object.assign(affair, response); // 3
            this.showSuccess('Affair updated successfully');
            this.cancelEdit();
          },
          error: (error: Error) => {
            this.showError(error.message);
          },
        })
        .add(() => {
          this.isSaving = false;
      
        });
    } else {
      this.showError('Please fill all required fields correctly');
    }
  }

  // Method to delete an affair
  deleteAffair(AffairId: number): void {
    if (confirm('Are you sure you want to delete this agency?')) {
      this.affairsService.deleteAffair(AffairId).subscribe({
        next: (response) => {
          this.affairsService.changeState();
          this.showSuccess('agency deleted successfully');
        },
        error: (error: Error) => {
          this.showError(error.message);
        },
      });
    }
  }

  getFormControl(fieldName: string): FormControl {
    return (
      (this.editForm?.get(fieldName) as FormControl) || new FormControl('')
    );
  }
  // save
  // cancel
  // then we go and finish the fields

  // Method to filter users based on input
  filterAffairs(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showError(message: string) {
    this.successMessage = '';
    this.errorMessage = message;

    setTimeout(() => (this.errorMessage = ''), 7000);
  }

  showSuccess(message: string) {
    this.errorMessage = '';
    this.successMessage = message;

    setTimeout(() => (this.successMessage = ''), 7000);
  }


    // Method to scroll to the agency creation form (naviguation -> scrollIntoView)
    scrollToForm(): void {
      this.router.navigate(['create'], { relativeTo: this.route });
      setTimeout(() => {
        this.affairFormOutlet.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
      }, 100);
    }

    
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.updateSubscription.unsubscribe();
  }
}
