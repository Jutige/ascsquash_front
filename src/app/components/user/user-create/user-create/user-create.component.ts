import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, Subject, Subscription} from "rxjs";
import {UserService} from "../../../../services/user-service";
import {userMsg} from "../../../../models/user-msg";
import {Router} from "@angular/router";
import {UserCreate} from "../../../../models/user-create.model";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  formCreateUser: FormGroup;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  private successSubscription = new Subscription();
  successMessage: string = '';
  availableMessage:boolean = false;
  typeMessage = 'success';

  userCreate: UserCreate;

  private userCreateSouscription: Subscription = new Subscription();

  roleUserCreate: string[] = [];

  roles = [{name : 'Restreint', value : '', checked : false},
    {name : 'Utilisateur', value : 'ROLE_USER', checked : true},
    {name : 'Administrateur', value: 'ROLE_ADMIN', checked : false}];
  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {

    this.formCreateUser = new FormGroup(
      {
        userId: new FormControl ('', Validators.required),
        prenomJoueur: new FormControl ('', Validators.required),
        nomJoueur: new FormControl ('', Validators.required),
        mailJoueur: new FormControl ('', Validators.required),
        telJoueur: new FormControl (''),
        userRole: new FormControl('ROLE_USER', Validators.required)
      },
    );
    //this.formCreateUser.get('userRole').setValue('Utilisateur');
  }

  createUser() {
    console.log('createUser demandé');
    this.userCreateSouscription = this.userService.userCreateSubject.subscribe(
      (response: any) => {
        this.emitAlertAndRouting('création effectuée', new userMsg(true, 'Création effectuée'));
        console.log('response ' + response);
      },
      (error) => {
        console.log('erreur appel createUser ' + error);
      }
    );
    this.roleUserCreate = [];
    this.roleUserCreate.push(this.formCreateUser.get('userRole').value);
    this.userCreate = new UserCreate(this.formCreateUser.get('userId').value,
      this.formCreateUser.get('nomJoueur').value,
      this.formCreateUser.get('prenomJoueur').value,
      this.formCreateUser.get('mailJoueur').value,
      this.formCreateUser.get('telJoueur').value,
      this.formCreateUser.get('userId').value,
      this.roleUserCreate
      );
    console.log('UserCreate : ' + this.userCreate);
    this.userCreate.idUser = this.formCreateUser.get('userId').value;
    this.userService.createUser(this.userCreate);
  }

  verifyChange($event: Event) {

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
}
