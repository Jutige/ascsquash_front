import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserResult} from "../../models/user-result.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {debounceTime, Subject, Subscription} from "rxjs";
import {UserService} from "../../services/user-service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {userMsg} from "../../models/user-msg";
import {TechnicalService} from "../../services/technical.service";


const routeAuthent = environment.urlServer + '/authenticate';
@Component({
  selector: 'app-authent',
  templateUrl: './authent.component.html',
  styleUrls: ['./authent.component.scss']
})
export class AuthentComponent implements OnInit, OnDestroy {

  currentUserType = 0;

  authentForm: FormGroup;
  userId: string;
  userResult: UserResult;
  roles = '';
  username = '';
  password = '';
  isAutorized = false;

  // variables pour l'affichage d'une popup
  errorSubject = new Subject<string>();
  errorMessage: string;
  availableMessage = false;
  private errorSubscription: Subscription;
  private errorGetSubscription: Subscription;

  constructor(private userService: UserService,
              private httpClient: HttpClient,
              private formBuilder: FormBuilder,
              private technicalService: TechnicalService) { }

  ngOnDestroy(): void {
    if (this.errorSubject){this.errorSubject.unsubscribe(); }
    if (this.errorGetSubscription){this.errorGetSubscription.unsubscribe(); }
  }

  ngOnInit(): void {
    this.verifyDisconnect();
    this.currentUserType = this.userService.getCurrentRole();


    this.authentForm = this.formBuilder.group(
      {username : ['', [Validators.required]], password : ['', [Validators.required]]}
    );
    this.authentForm.valueChanges.subscribe(form => this.checkConnectionAuthorized(form));
    this.errorGetSubscription = this.technicalService.getErrorSubject.subscribe(
      (response: any) => {

        this.emitAlertAndRouting('impossible de récupérer les données utilisateurs');
      }
    );
  }

  /**
   * Mise à jour du rôle de l'utilisateur.
   * Cette mise à jour permet au component principal de mettre à jour la vue
   * @param roles
   */
  updateUserRole(roles: string[]) {
    console.log ('Auth - updateUserRole', roles);
    if ((roles.indexOf('ROLE_USER') > -1) || (roles.indexOf('Utilisateur') > -1)) {
      this.currentUserType = 1;
    }
    if ((roles.indexOf('ROLE_ADMIN') > -1) || (roles.indexOf('Administrateur') > -1)) {
      this.currentUserType = 2;
    }
    // console.log('updateUserRole, role: ', this.currentUserType);
    this.userService.updateRole(this.currentUserType);
  }

  /**
   * Authentification de l'utilisateur et récupération du token
   */
  userConnect() {
    console.log ('Auth - UserConnect');
    if (this.authentForm !=null ) {
      let credential = {
        username : this.authentForm.get('username').value,
        password : this.authentForm.get('password').value
        // username : '000000',
        // password : '000000'
      };

      // this.authentForm.get('username').value
      this.userId = this.authentForm.get('username').value;

      this.httpClient.post<{token: string}>(routeAuthent, credential, {observe: 'response'})
        .subscribe(
          (response: any) => {
//        console.log('retour userConnect back-end Ok : ', response.body);
//        console.log('token return', response.body.token);
            localStorage.setItem('token', response.body.token);
            this.getUser(this.userId);
          },
          (error) => {
            if (error.status === 401){
              this.emitAlertAndRouting('utilisateur ou mot de passe incorrect');
            }else {
              if (error.status === 0){
                this.emitAlertAndRouting('connexion refusée par le serveur');
              }else
              {
                this.emitAlertAndRouting('erreur lors de l\'authentification, code erreur: ' + error.status);
              }
            }

            console.log('retour userConnect back-end Ok : ', error);
          }
        );
    }

  }

  /**
   * Récupération des données associées à l'utilisateur connecté
   * @param userId
   */
  getUser(userId: string) {
    console.log ('Auth - getUser');
    this.userService.getGetSubject().subscribe(
      (response: any) => {

        console.log ('Auth - Get Réponse', response.body);
        this.userResult = response.body;
        this.updateUserRole(this.userResult.roles);
        this.updateLocalStorage();
//          this.router.navigate(['/profils']);
        // console.log('response authent :', response);
        // console.log('valeur http status', response.status);
      },
      (error: any) => {
        this.emitAlertAndRouting('impossible de récupérer les données utilisateurs');
        console.log('Auth - error Get', error);
      }
    );
    this.userService.GetUserFromServerById(userId);
  }

  /**
   * Mise à jour des données stockés en local storage
   */
  updateLocalStorage() {
    console.log('User Result local storage', this.userResult);
    if (this.userResult === null || this.userResult === undefined){
      localStorage.setItem('userId', '000000');
      localStorage.setItem('nomUser', 'Nom inconnu');
      localStorage.setItem('prenomUser', 'Prenom inconnu');
      localStorage.setItem('RolesUser', '');
    } else {
      localStorage.setItem('userId', this.userResult.mailJoueur);
      localStorage.setItem('nomUser', this.userResult.nomJoueur);
      localStorage.setItem('prenomUser', this.userResult.prenomJoueur);
      // console.log('user Result', this.userResult);
      if (this.userResult !== null || this.userResult !== undefined) {
        this.roles = this.userService.getRole(this.userResult).roles.toString();
      }

      localStorage.setItem('userRoles', this.roles);
    }

  }

  reset() {
    this.authentForm.controls['username'].setValue('');
    this.authentForm.controls['password'].setValue('');
  }

  checkConnectionAuthorized(form: any) {
    if (this.authentForm.valid) {
      this.isAutorized = true;
    }else {
      this.isAutorized = false;
    }
  }

  /**
   * Emission d'un message de type popup en cas de problème de connexion
   * @param message
   */
  emitAlertAndRouting(message: string) {
    this.errorMessage = message;
    this.availableMessage = true;
    this.errorSubscription = this.errorSubject.pipe(debounceTime(5000)).subscribe(
      () => {
        this.errorMessage = '';
        this.availableMessage = false;
      }
    );
    this.errorSubject.next("value");
  }

  verifyDisconnect() {
    if (localStorage.getItem('token')) {
      this.emitAlertAndRouting('Vous avez déconnecté de l\'application, veuillez vous reconnecter');
      localStorage.clear();
    }
  }

}
