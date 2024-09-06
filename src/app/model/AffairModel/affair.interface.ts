import { Beneficiaire } from "./beneficiaire.interface";
import { CoIndivisaire } from "./co-indivisaire.interface";
import { Financement } from "./financement.interface";
import { GeneralInfo } from "./general-info.interface";
import { Logement } from "./logement.interface";



export interface Affair { // we break Affair to interfaces so well have an object with objects within it
    id: number;
    // objects for specific types
    generalInfo: GeneralInfo;
    beneficiaire: Beneficiaire;
    financement: Financement;
    logement: Logement;
    coIndivisaire?: CoIndivisaire;
  }