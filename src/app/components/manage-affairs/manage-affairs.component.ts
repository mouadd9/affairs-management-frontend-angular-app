import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AffairsService } from '../../services/affairs.service';
import { Affair, GeneralInfo, Beneficiaire, Financement, Logement, CoIndivisaire } from '../../model/AffairModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-affairs',
  templateUrl: './manage-affairs.component.html',
  styleUrl: './manage-affairs.component.css'
})
export class ManageAffairsComponent implements OnInit {
  affairs: Affair[] = []; // this will hold affairs fetched by the resolvers
  generalInfoDataSource: MatTableDataSource<GeneralInfo>;
  beneficiaireDataSource: MatTableDataSource<Beneficiaire>;
  financementDataSource: MatTableDataSource<Financement>;
  logementDataSource: MatTableDataSource<Logement>;
  coIndivisaireDataSource: MatTableDataSource<CoIndivisaire>;

  generalInfoColumns: string[] = ['codeAgence', 'typeFinancement', 'typeIntervention', 'cible'];
  beneficiaireColumns: string[] = ['nom', 'prenom', 'numeroCNIE', 'genre', 'dateDeNaissance'];
  financementColumns: string[] = ['numeroFinancementBanque', 'objetDuFinancement', 'montantDuFinancement', 'coutAcquisition', 'tauxDeMarge', 'margeSurDiffere', 'apportDuBeneficiaire', 'prixLogement', 'duree'];
  logementColumns: string[] = ['numeroTF', 'natureDuTF', 'acquisitionIndivision', 'adresseLogement', 'codeVille', 'superficie', 'vendeurLogement'];
  coIndivisaireColumns: string[] = ['nom', 'prenom', 'numeroCNIE', 'genre', 'liaisonFamiliale'];

  constructor(private affairsService: AffairsService, private route: ActivatedRoute) {
    this.generalInfoDataSource = new MatTableDataSource<GeneralInfo>([]);
    this.beneficiaireDataSource = new MatTableDataSource<Beneficiaire>([]);
    this.financementDataSource = new MatTableDataSource<Financement>([]);
    this.logementDataSource = new MatTableDataSource<Logement>([]);
    this.coIndivisaireDataSource = new MatTableDataSource<CoIndivisaire>([]);
  }

  ngOnInit() {
   
    this.route.data.subscribe({
      next: (data) => {
        this.affairs = data['affairs']; // Get affairs from the resolver
        this.initializeDataSources(); // Populate tables
      },
      error: error => console.error('Error fetching affairs:', error)
    });
    
  }

  initializeDataSources(){
    // here we will set up the datasource for all the tables
    this.generalInfoDataSource.data = this.affairs.map(a => a.generalInfo);
    this.beneficiaireDataSource.data = this.affairs.map(a => a.beneficiaire);
    this.financementDataSource.data = this.affairs.map(a => a.financement);
    this.logementDataSource.data = this.affairs.map(a => a.logement);
    this.coIndivisaireDataSource.data = this.affairs.filter(a => a.coIndivisaire).map(a => a.coIndivisaire!);

  }

}
