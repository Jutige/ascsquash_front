import { Component, OnInit } from '@angular/core';
import {debounceTime, Subject, Subscription} from "rxjs";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {UserService} from "../../../services/user-service";
import {userMsg} from "../../../models/user-msg";
import {UserResult} from "../../../models/user-result.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserCreate} from "../../../models/user-create.model";

@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.scss']
})
export class UserModifyComponent implements OnInit {

  // idUser = idAsc en entrée
  idUser: string = '';
  private getUserSubscription: Subscription;
  private  userUpdateSouscription: Subscription;

  // user associé à l'index
  userResult: UserResult;
  role = '';

  formModify: FormGroup;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  private successSubscription = new Subscription();
  successMessage: string = '';
  availableMessage:boolean = false;
  typeMessage = 'success';

  currentUserType = 0;

  roles = [{name : 'Restreint', value : '', checked : false},
    {name : 'Utilisateur', value : 'ROLE_USER', checked : true},
    {name : 'Administrateur', value: 'ROLE_ADMIN', checked : false}];

  constructor(private routeUser: ActivatedRoute,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    console.log('hello World !');
    this.currentUserType = this.userService.getCurrentRole();
    //   récupération de l'id sélectionnée
    this.getUserSubscription = this.routeUser.paramMap.subscribe((params: ParamMap) => {
        this.idUser = this.idUser +params.get('idUser');
        console.log('idUser : ', this.idUser);
      this.initForm();
      }
    );
    this.getUser(this.idUser);
    this.initForm();
  }

  initForm() {
    this.formModify = new FormGroup(
      {
        userId: new FormControl('id ASC', Validators.required),
        prenomJoueur: new FormControl('prenom', Validators.required),
        nomJoueur: new FormControl('nom', Validators.required),
        mailJoueur: new FormControl('mail', Validators.required),
        telJoueur: new FormControl(''),
        role: new FormControl(this.role, Validators.required)
      });
  }

  getUser(userId: string) {
    this.userService.userGetSubjectModify.subscribe(
      (response: any) => {
        console.log('user récupéré ', response.body);
        this.userResult = response.body;

        if (this.userResult.roles[0] === 'ROLE_USER'){
          this.role = 'ROLE_USER';
        }
        if (this.userResult.roles[0] === 'ROLE_ADMIN'){
          this.role = 'ROLE_ADMIN';
        }
        this.formModify.get('userId')?.setValue(this.userResult.idAsc);
        this.formModify.get('nomJoueur')?.setValue(this.userResult.nomJoueur);
        this.formModify.get('prenomJoueur')?.setValue(this.userResult.prenomJoueur);
        this.formModify.get('mailJoueur')?.setValue(this.userResult.mailJoueur);
        this.formModify.get('telJoueur')?.setValue(this.userResult.numeroTelJoueur);
        this.formModify.get('role')?.setValue(this.role);
      },
      (error) => {
        console.log('Erreur getUser : ', error);
        const errorMessage = 'impossible de récupérer infos utilisateur '+userId;
        this.emitAlertAndRouting(errorMessage, new userMsg(false,errorMessage));
      });
    this.userService.GetUserFromServerById(userId, 3);
  }

  modifyUser() {

    console.log('Modification demandée');
    this.userUpdateSouscription = this.userService.userUpdateSubject.subscribe(
      (response: any) => {
        this.emitAlertAndRouting('mise à jour effectuée', new userMsg(true, 'Création effectuée'));
        console.log('response ' + response);
      },
      (error) => {
        console.log('erreur appel updateUser ' + error);
      }
    );
    let roleUserUpdate = [];
    roleUserUpdate.push(this.formModify.get('role').value);
    let userUpdate = new UserCreate(this.idUser,
      this.formModify.get('nomJoueur').value,
      this.formModify.get('prenomJoueur').value,
      this.formModify.get('mailJoueur').value,
      this.formModify.get('telJoueur').value,
      this.idUser,
      roleUserUpdate
    );
    this.userService.updateUser(userUpdate);
  }

  verifyChange($event: Event) {

  }

  emitAlertAndRouting(message: string, response: userMsg) {

    console.log('userMsg ' + response);
    console.log('response.success ' + response.success);
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

}
