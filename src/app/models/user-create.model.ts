import {Joueur} from "./joueur.model";

export class UserCreate extends Joueur {
  roles: string[],
  idUser: string
  constructor(
    idAsc: string,
    nomJoueur: string,
    prenomJoueur: string,
    mailJoueur: string,
    numeroTelJoueur: string,
    idUser: string,
    roles: string[]
  ) {
    super(idAsc,
      nomJoueur,
      prenomJoueur,
      mailJoueur,
      numeroTelJoueur);
    this.idUser = idUser;
    this.roles = roles;
  }
}
