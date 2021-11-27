import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import { faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import {UserService} from "./services/user-service";
import {DialogModalComponent} from "./components/share/dialog-modal/dialog-modal.component";
import {UserResult} from "./models/user-result.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // ,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent  implements OnInit{

  userResult: UserResult;
  currentUserType = 0;
  userSuscribe = new Subscription();
  faSignOutAlt = faSignOutAlt;
  faUser = faUser;
  userLink = 0;
  infoLink = 0;
  authentLink = 0;
  // options pour la fenêtre modale
  modalOptions: NgbModalOptions = {};

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private router: Router
              // ,
              // private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.verifyRefresh();
    console.log('CurrentType après verifyRefresh : ' + this.currentUserType);
  }

  /**
   * method for routing to other component and actualize the conditionnal items of the navbar
   * @param route
   */
  verifyRefresh(){
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');
    if (userId && token){
      console.log('already connected');
      console.log('userId ' + userId);
      console.log('token ' + token);
      this.getUser(userId);

    }else {
      console.log('new connection');
      console.log('valeur init, currentUserType: ', this.currentUserType);
      this.currentUserType = this.userService.getCurrentRole();
      this.chooseRoute();
    }
  }

  getUser(userId: string) {
    console.log ('AppComponent - getUser');
    this.userService.getUserGetRefreshSubject().subscribe(
      (response: any) => {

        console.log ('AppComponent - Get Réponse', response.body);
        this.userResult = response.body;
        this.updateUserRole(this.userResult.roles);
        this.currentUserType = this.userService.getCurrentRole();
        this.chooseRoute();

        //        this.router.navigate(['/users']);
        // console.log('response authent :', response);
        // console.log('valeur http status', response.status);
      },
      (error: any) => {
        console.log('AppComponent - error Get', error);
      }
    );
    this.userService.GetUserFromServerById(userId, 0);
  }

  chooseRoute(){

    this.userSuscribe = this.userService.userSubject.subscribe(
      user => {
        console.log('user reçu: ', user);
        this.currentUserType = user;
        if (this.currentUserType > 0) {
          this.routingTo('infos');
        }
        if (this.currentUserType === 0){
          this.routingTo('auth');
        }
        console.log('user reçu après routage: ', user);
      });
    if (!this.currentUserType) {
      this.currentUserType = 0;
      this.routingTo('auth');
    } else {
      if (this.currentUserType > 0) {
        this.routingTo('infos');
      }
    }
  }

  updateUserRole(roles: string[]) {
    console.log ('Auth - updateUserRole', roles);
    if ((roles.indexOf('ROLE_USER') > -1) || (roles.indexOf('Utilisateur') > -1)) {
      this.currentUserType = 1;
    }
    if ((roles.indexOf('ROLE_ADMIN') > -1) || (roles.indexOf('Administrateur') > -1)) {
      this.currentUserType = 2;
    }
    console.log('AppComponent - updateUserRole, role: ', this.currentUserType);
    this.userService.updateRole(this.currentUserType);
  }

  routingTo(route:string) {
    this.authentLink = 0;
    this.userLink = 0;
    this.infoLink = 0;
    switch (route) {
      case 'auth':
        this.authentLink = 1;
        break;
      case 'infos':
        this.infoLink = 1;
        break;
      case 'users':
        this.userLink = 1;
        break;
      case 'account':
        this.authentLink = 1;
        break;
      default:
        break;
    }

    this.router.navigate([route]);
  }

  /**
   * Lors d'une déconexion, on supprimer les variables de la localSotrage.
   * On positionne le rôle à 0 pour que le composant parent redirige vers la fenêtre de connexion
   */
  OnDisconnect() {
    const modalRef = this.openModal();
    modalRef.result.then(
      confirm => {
        console.log('retour modal', confirm);
        if (confirm.toString() === 'Confirm') {
          this.userService.updateRole(0);
          localStorage.clear();
        }
      }, dismiss => {
        console.log('retour modal', dismiss);
      }
    );
  }

  /**
   * Paramétrage de la fenêtre modale
   */
  openModal(): NgbModalRef {

    this.modalOptions.backdrop = 'static';
    this.modalOptions.keyboard = false;
    this.modalOptions.centered = true;
    const modalDiag = this.modalService.open(DialogModalComponent, this.modalOptions);
    modalDiag.componentInstance.message = 'Souhaitez-vous vous déconnecter de l\'application ?';
    modalDiag.componentInstance.title = 'Demande de déconnexion';
    return modalDiag;
  }
}


