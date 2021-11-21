import {Joueur} from "./joueur.model";

export class UserResult extends Joueur {
  roles: string[];
  lastDateConnexion: string;
  constructor(
     idAsc: string,
     nomJoueur: string,
     prenomJoueur: string,
     mailJoueur: string,
     numeroTelJoueur: string,
     roles: string[],
     lastDateConnexion: string
  ) {
    super(idAsc,
      nomJoueur,
      prenomJoueur,
      mailJoueur,
      numeroTelJoueur);
    this.roles = roles;
    this.lastDateConnexion = lastDateConnexion;
  }
}
