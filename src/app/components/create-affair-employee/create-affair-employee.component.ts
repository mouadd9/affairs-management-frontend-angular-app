import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AffairsService } from '../../services/affairs.service';
import { AffairDTO } from '../../model/affair-dto.interface';
import { AgenciesService } from '../../services/agencies.service';
import { Agency } from '../../model/agency.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-affair-employee',
  templateUrl: './create-affair-employee.component.html',
  styleUrl: './create-affair-employee.component.css'
})
export class CreateAffairEmployeeComponent implements OnInit {
  affairForm!: FormGroup; // here we declare the form group

  currentStep = 1;
  totalSteps = 5;

  errorMessage: string = '';
  successMessage: string = '';

  public activeAgencies: Agency[] = [];


  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private affairsService: AffairsService,
    private agencyService: AgenciesService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.initForm();

  }

  //this function will create a form group using a form builder

  initForm() {
    this.affairForm = this.fb.group({
      // Step 1: General Information
      codeAgence: [this.auth.employee?.agencyCode, Validators.required],
      typeFinancement: ['', Validators.required],
      typeIntervention: ['', Validators.required],
      cible: ['', Validators.required],

      // Step 2: Beneficiary Information
      nomBeneficiaire: ['', Validators.required],
      prenomBeneficiaire: ['', Validators.required],
      numeroCNIEBeneficiaire: ['', Validators.required],
      genreBeneficiaire: ['', Validators.required],
      dateDeNaissanceBeneficiaire: ['', Validators.required],

      // Step 3: Financing Details
      numeroFinancementBanque: ['', Validators.required],
      objetDuFinancement: ['', Validators.required],
      montantDuFinancement: [null, [Validators.required, Validators.min(0)]],
      coutAcquisition: [null, [Validators.required, Validators.min(0)]],
      tauxDeMarge: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      margeSurDiffere: [false, Validators.required],
      apportDuBeneficiaire: [null, [Validators.required, Validators.min(0)]],
      prixLogement: [null, [Validators.required, Validators.min(0)]],
      duree: [null, [Validators.required, Validators.min(1)]],

      // Step 4: Housing Information
      numeroTF: ['', Validators.required],
      natureDuTF: ['', Validators.required],
      acquisitionIndivision: [false, Validators.required],
      adresseLogement: ['', Validators.required],
      codeVille: ['', Validators.required],
      superficie: [null, [Validators.required, Validators.min(1)]],
      vendeurLogement: ['', Validators.required],

      // Step 5: Co-owner Information (optional)
      nomCoIndivisaire: [''],
      prenomCoIndivisaire: [''],
      numeroCNIECoIndivisaire: [''],
      genreCoIndivisaire: [''],
      liaisonFamilialeCoIndivisaire: [''],
    });
  }

  // we will add a function that will do the following :
  // - checks if the current form is valid
  // - if there are still parts to fill (the step we are in)
  // - if not it will show an error

  nextStep() {
    // is current step valid checks the validity of specific inputs based on where we are in steps
    if (this.isCurrentStepValid()) {
      // if the some specific inputs (based on steps) are valid we go further
      if (this.currentStep < this.totalSteps) {
        // if the current step is less then the final one we will ad a step to change show new inputs
        this.currentStep++;
      }
    } else { // if the current step is not valid meaning the form is nor validated 
      this.markCurrentStepAsTouched();
      this.showError(
        'Please fill all required fields correctly before proceeding.'
      );
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // This function checks whether all the fields in the current step of the form are valid
  isCurrentStepValid(): boolean {
    // we need to get the name of the controls we want to check
    // an array of field names that belong to the current step
    // so we should call a function that has for each step an array of fields
    const currentStepFields = this.getFieldsForStep(this.currentStep); // so we pass the current step then we get an array of fields
    // after extracting the array we iterate over its element and check if all controls are validated
    return currentStepFields.every((field) => {
      // we iterate over fields
      const control = this.affairForm.get(field); // for each field we get the control from the Form
      /**
       * Only after checking all fields (or finding one invalid field), does every() produce its final result, which is then returned by isCurrentStepValid().

So, in essence:

If all fields are valid, every() returns true, so isCurrentStepValid() returns true.
If any field is invalid, every() returns false, so isCurrentStepValid() returns false.
       */

      return control? control.valid: true;
      // if conrol.valid === true in all controls we return true else we return false (this return is done by .every()) every means that every element should be true so we can return true
    });
  }

  /** 
   every():

Tests whether all elements in the array pass the test implemented by the provided function.
Returns a Boolean value.
Stops iterating as soon as it finds an element that doesn't pass the test (returns false for that element).
Used when you need to check if all elements meet a certain condition.
  */


markCurrentStepAsTouched() {
  const currentStepFields = this.getFieldsForStep(this.currentStep);
  currentStepFields.forEach(field => {
    const control = this.affairForm.get(field);
    if (control) {
      control.markAsTouched();
      /*
      Purpose:
      This function is used to mark all form controls in the current step as "touched".
      In Angular forms, marking a control as touched typically triggers the display of validation errors
      if the field is invalid. */
    }
  });
}



submitForm() {
  if (this.affairForm.valid) {
    this.isSubmitting = true;
    console.log(this.affairForm.value);
    const newAffair: AffairDTO = this.affairForm.value;
    console.log(newAffair);
    this.affairsService.createAffair(newAffair).subscribe({
      next: (createdAffair) => {
        console.log("created affair:");
        console.log(createdAffair);
        this.affairsService.changeState2();
        this.affairForm.reset();
        this.showSuccess('Affair created successfully');
      },
      error: (error) => {
        console.error('Error creating affair', error);
        this.showError( error.message || 'Failed to create affair. Please try again.');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  } else {
    this.markAllFieldsAsTouched();
    this.showError('Please fill all required fields correctly before submitting.');
  }
}


markAllFieldsAsTouched() {
  Object.keys(this.affairForm.controls).forEach(key => {
    const control = this.affairForm.get(key);
    control?.markAsTouched();
  });
}

  getFieldsForStep(step: number): string[] {
    switch (step) {
      case 1:
        return ['codeAgence', 'typeFinancement', 'typeIntervention', 'cible'];
      case 2:
        return [
          'nomBeneficiaire',
          'prenomBeneficiaire',
          'numeroCNIEBeneficiaire',
          'genreBeneficiaire',
          'dateDeNaissanceBeneficiaire',
        ];
      case 3:
        return [
          'numeroFinancementBanque',
          'objetDuFinancement',
          'montantDuFinancement',
          'coutAcquisition',
          'tauxDeMarge',
          'margeSurDiffere',
          'apportDuBeneficiaire',
          'prixLogement',
          'duree',
        ];
      case 4:
        return [
          'numeroTF',
          'natureDuTF',
          'acquisitionIndivision',
          'adresseLogement',
          'codeVille',
          'superficie',
          'vendeurLogement',
        ];
      case 5:
        return [
          'nomCoIndivisaire',
          'prenomCoIndivisaire',
          'numeroCNIECoIndivisaire',
          'genreCoIndivisaire',
          'liaisonFamilialeCoIndivisaire',
        ];
      default:
        return [];
    }
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

  goBack() {
    this.affairsService.closeForm();
  }
}
