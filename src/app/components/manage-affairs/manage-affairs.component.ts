import { Component, HostListener, OnInit, ViewChild  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AffairsService } from '../../services/affairs.service';
import { AffairDTO } from '../../model/affair-dto.interface';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-manage-affairs',
  templateUrl: './manage-affairs.component.html',
  styleUrl: './manage-affairs.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManageAffairsComponent implements OnInit {
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  editForm: FormGroup | null = null;
  editingAffairId: any;

  constructor(
    private affairsService: AffairsService,
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY  || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollTopButton = scrollPosition > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // edit

  editAffair(affair: AffairDTO): void {
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
          //this.agencyService.changeState();
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
}
