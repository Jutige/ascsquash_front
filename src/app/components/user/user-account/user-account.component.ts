import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ComparePassword} from '../../../Validators/confirm-password-validator';
import {CustomPasswordValidator} from '../../../Validators/custom-password-validator';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {UserService} from "../../../services/user-service";



@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit, OnDestroy {


  formAccount: FormGroup;
  // activation de la mise à jour du mot de passe
  updateAvailable: boolean;

  userId: string;
  nomJoueur: string;
  prenomJoueur: string;
  mailJoueur: string;
  telJoueur: string;
  userRolesForShow: string;
  userRoles: string;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  successMessage: string;
  availableMessage = false;
  type = 'success';

  constructor(private formBuilderUser: FormBuilder,
              private userService: UserService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    console.log('userId', this.userId);
    this.updateAvailable = false;
    this.initForm();
    this.initAlert();
    this.userRolesForShow = this.userRoles.replace(',',' ').replace(',',' ');
  }

  updatePassword() {
    this.userService.getUpdatePasswordSubject().subscribe(
        (response: any) => {
          console.log(response.status);
          if (response.status.toString() === '200') {
            this.type = 'success';
            this.changeSuccessMessage('Mise à jour effectuée');
          } else {
            this.type = 'danger';
            this.changeSuccessMessage('Erreur lors de la mise à jour du mot de passe: ' + response.error.message);
          }
        },
        (error) => {
          console.log('erreur back end ', error);
        }
    );
    this.userService.updatePasswordToServer(this.userId,
        this.formAccount.get('actualPassword').value,
        this.formAccount.get('newPassword').value);
  }

  initForm() {
    this.userId = localStorage.getItem('userId');
    this.prenomJoueur = localStorage.getItem('prenomUser');
    this.nomJoueur = localStorage.getItem('nomUser');
    this.mailJoueur = localStorage.getItem('mailUser');
    this.telJoueur = localStorage.getItem('telUser');
    this.userRoles = localStorage.getItem('userRoles');
//    this.formAccount = this.formBuilderUser.group(
    this.formAccount = new FormGroup(
      {
        userId: new FormControl (this.userId, Validators.required),
        prenomJoueur: new FormControl (this.prenomJoueur, Validators.required),
        nomJoueur: new FormControl (this.nomJoueur, Validators.required),
        mailJoueur: new FormControl (this.mailJoueur, Validators.required),
        telJoueur: new FormControl (this.telJoueur, Validators.required),
        /*
        prenomJoueur: [{value: this.prenomJoueur}, Validators.required],
        nomJoueur: [{value: this.nomJoueur}, Validators.required],
        mailJoueur: [{value: this.mailJoueur}, Validators.required],
        telJoueur: [{value: this.telJoueur}, Validators.required],

         */
        actualPassword: new FormControl ('', Validators.required),
        newPassword: new FormControl('', Validators.compose([
          Validators.required,
          // doit être compris entre 8 et 12 caractères (12 car pour limiter le risque d'injection de code)
          Validators.minLength(8),
          Validators.maxLength(12),
          // doit contenir un caractère numérique
          CustomPasswordValidator.patternValidator(/\d/, {isContainsNumber: true}),
          // doit contenir une lettre majuscule
          CustomPasswordValidator.patternValidator(/[A-Z]/, {isContainsUpperCase: true}),
          // doit contenir une lettre minuscule
          CustomPasswordValidator.patternValidator(/[a-z]/, {isContainsLowerCase: true}),
          // doit contenir un caractère spécial
          CustomPasswordValidator.patternValidator(/[ \\\[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\};\'\:\"\|\,\.\<\>\/\?°\~\£]/,
              {isContainsSpecialCharacter: true})
      ])),
      newPasswordConfirmed: new FormControl('')
        },
 /*       {
          ValidatorFn: ComparePassword('newPassword', 'newPasswordConfirmed')
        }*/
    );
  }

  /**
   * Active la possibilité de changer le mot de passe
   */
  activeChangePassword() {
    this.updateAvailable = true;
  }

  /**
   * Désactive la possibilité de changer le mot de passe
   */
  desactiveChangePassword() {
    this.updateAvailable = false;
  }

  /**
   * initialisation de la popup
   */
  initAlert() {
    this.successSubject.subscribe(message => this.successMessage = message);
    this.successSubject.pipe(
        debounceTime(2000)
    ).subscribe(() => {
      this.successMessage = '';
      this.availableMessage = false;
    });
  }

  /**
   * activation de la popup
   * @param message
   */
  changeSuccessMessage(message: string) {
    this.availableMessage = true;
    this.successSubject.next(message);
  }

  ngOnDestroy(): void {
  }
}
