import {Joueur} from "./joueur.model";

export class UserCreate  {

  constructor(
    public idAsc: string,
    public nomJoueur: string,
    public prenomJoueur: string,
    public mailJoueur: string,
    public numeroTelJoueur: string,
    public idUser: string,
    public roles: string[]
  ) {

  }
}
