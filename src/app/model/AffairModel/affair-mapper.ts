import { AffairDTO } from './affair-dto.interface'; // this is the raw json format of our AffairDTO
import {
  Affair,
  GeneralInfo,
  Beneficiaire,
  Financement,
  Logement,
  CoIndivisaire,
} from '../AffairModel';
// this function will convert AffairDTO to Affair(UI friendly version)
// and return an instance of Affair
export function mapAffairDTOToAffair(dto: AffairDTO): Affair {
  // interfaces are for type-checking at compile time
  // we dont create instances of interfaces
  // we use them to define the shape of objects
  /*
    interface Person {
       name: string;
       age: number;
    }

     // Correct usage
    const person: Person = {
       name: "John",
       age: 30
    };

    
  */

  // so here we declared an interface which is like defining a type for specific objects

  return {
    id: dto.id,
    generalInfo: {
        codeAgence: dto.codeAgence,
      typeFinancement: dto.typeFinancement,
      typeIntervention: dto.typeIntervention,
      cible: dto.cible
    },
    beneficiaire: {
        nom: dto.nomBeneficiaire,
      prenom: dto.prenomBeneficiaire,
      numeroCNIE: dto.numeroCNIEBeneficiaire,
      genre: dto.genreBeneficiaire,
      dateDeNaissance: dto.dateDeNaissanceBeneficiaire
    },
    financement: {
        numeroFinancementBanque: dto.numeroFinancementBanque,
      objetDuFinancement: dto.objetDuFinancement,
      montantDuFinancement: dto.montantDuFinancement,
      coutAcquisition: dto.coutAcquisition,
      tauxDeMarge: dto.tauxDeMarge,
      margeSurDiffere: dto.margeSurDiffere,
      apportDuBeneficiaire: dto.apportDuBeneficiaire,
      prixLogement: dto.prixLogement,
      duree: dto.duree
    },
    logement: {
        numeroTF: dto.numeroTF,
      natureDuTF: dto.natureDuTF,
      acquisitionIndivision: dto.acquisitionIndivision,
      adresseLogement: dto.adresseLogement,
      codeVille: dto.codeVille,
      superficie: dto.superficie,
      vendeurLogement: dto.vendeurLogement
    },
    coIndivisaire: dto.nomCoIndivisaire ? {
        nom: dto.nomCoIndivisaire,
        prenom: dto.prenomCoIndivisaire || '',
        numeroCNIE: dto.numeroCNIECoIndivisaire || '',
        genre: dto.genreCoIndivisaire || '',
        liaisonFamiliale: dto.liaisonFamilialeCoIndivisaire || ''
      } : undefined
  };
}
