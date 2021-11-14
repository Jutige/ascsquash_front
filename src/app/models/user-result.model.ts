import {Joueur} from "./joueur.model";

export class UserResult extends Joueur {
  roles: string[];
  lastDateConnexion: string;
  constructor(
     nomJoueur: string,
     prenomJoueur: string,
     mailJoueur: string,
     telJoueur: string,
     roles: string[],
     lastDateConnexion: string
  ) {
    super(nomJoueur,
      prenomJoueur,
      mailJoueur,
      telJoueur);
    this.roles = roles;
    this.lastDateConnexion = lastDateConnexion;
  }
}
