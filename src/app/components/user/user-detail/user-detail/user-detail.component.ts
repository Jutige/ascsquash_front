import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {UserService} from "../../../../services/user-service";
import {userMsg} from "../../../../models/user-msg";
import {debounceTime, Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserResult} from "../../../../models/user-result.model";
import {HttpResponse} from "@angular/common/http";
import {NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DialogModalComponent} from "../../../share/dialog-modal/dialog-modal.component";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  // idUser = idAsc en entrée
  idUser: string = '';

  // user associé à l'index
  userResult: UserResult;
  dateLastConnexion: Date;
  userForm: FormGroup;
  role: string = 'restreint';

  linkMail: string;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  successMessage: string = '';
  availableMessage:boolean = false;
  typeMessage = 'success';

  currentUserType = 0;

  private successSubscription: Subscription;
  private userDeleteSubscription: Subscription;

  // options pour la fenêtre modale
  modalOptions: NgbModalOptions = {};

  constructor(private routeUser: ActivatedRoute,
              private userService: UserService,
              private formBuilderUser: FormBuilder,
              private modalService: NgbModal,
              private router: Router) { }

  ngOnInit(): void {

    this.currentUserType = this.userService.getCurrentRole();
    //   récupération de l'id sélectionnée
    this.routeUser.paramMap.subscribe((params: ParamMap) => {
        this.idUser = this.idUser +params.get('idUser');
        console.log('idUser : ', this.idUser);
      }
    );

    this.getUser(this.idUser);
  }

  getUser(userId: string) {
    this.userService.getUserGetDetailSubject().subscribe(
      (response: any) => {
        console.log('user récupéré ', response.body);
        this.userResult = response.body;
        this.dateLastConnexion = new Date(this.userResult.lastDateConnexion);
        this.linkMail = 'mailto:' + this.userResult.mailJoueur + '&subject=ASC Squash';
        if (this.userResult.roles[0] === 'ROLE_USER'){
          this.role = 'Utilisateur';
        }
        if (this.userResult.roles[0] === 'ROLE_ADMIN'){
          this.role = 'Administrateur';
        }
      },
      (error) => {
        console.log('Erreur getUser : ', error);
        const errorMessage = 'impossible de récupérer infos utilisateur '+userId;
        this.emitAlertAndRouting(errorMessage, new userMsg(false,errorMessage));
      });
    this.userService.GetUserFromServerById(userId, 2);
  }

  deleteUser() {
    this.userDeleteSubscription = this.userService.userDeleteSubject.subscribe(
      (response: any) => {
        // update server done : display confirm box then routing
        this.emitAlertAndRouting('Suppression effectuée', response);
      }
    );

    const modalRef = this.openModal();
    modalRef.result.then(
      (confirm: any) => {
        console.log('retour modal', confirm);
        if (confirm.toString() === 'Confirm') {
          this.userService.deleteUserToServer(this.userResult);

        }
      }, (dismiss: any) => {
        console.log('retour modal', dismiss);
      }
    );
  }
  updateUser() {
    console.log('clic sur update');
  }


  emitAlertAndRouting(message: string, response: userMsg) {

    if (response.success) {
      this.successMessage = message;
      this.typeMessage = 'success';
      this.availableMessage = true;
      this.successSubscription = this.successSubject.pipe(debounceTime(2000)).subscribe(
        () => {
          this.successMessage = '';
          this.availableMessage = false;
          this.router.navigate(['/users']);
        }
      );
      this.successSubject.next('');
    } else {
      this.successMessage = response.msg;
      this.typeMessage = 'danger';
      this.availableMessage = true;
    }
  }
  openModal(): NgbModalRef {

    this.modalOptions.backdrop = 'static';
    this.modalOptions.keyboard = false;
    this.modalOptions.centered = true;
    const modalDiag = this.modalService.open(DialogModalComponent, this.modalOptions);
    modalDiag.componentInstance.message = 'Confirmez-vous la suppression de l\'id ' + this.userResult.idAsc + '?';
    modalDiag.componentInstance.title = 'Demande de suppression';
    return modalDiag;
  }

}
