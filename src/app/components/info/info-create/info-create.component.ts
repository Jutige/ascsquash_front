import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, Subject, Subscription} from "rxjs";
import {Info} from "../../../models/info.model";
import {InfoService} from "../../../services/info-service";
import {userMsg} from "../../../models/user-msg";
import {Router} from "@angular/router";
import {Editor} from "ngx-editor";

@Component({
  selector: 'app-info-create',
  templateUrl: './info-create.component.html',
  styleUrls: ['./info-create.component.scss']
})
export class InfoCreateComponent implements OnInit {

  formCreateInfo: FormGroup;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  private successSubscription = new Subscription();
  successMessage: string = '';
  availableMessage:boolean = false;
  typeMessage = 'success';

  notification = [{name : 'Tous', value : 'Tous', checked : true},
    {name : 'Aucun', value : 'Aucun', checked : false}];

  private userCreateSouscription: Subscription = new Subscription();

  editor: Editor;
  html: ''

  constructor(private infoService : InfoService,
              private router: Router) { }

  ngOnInit(): void {

    this.formCreateInfo = new FormGroup(
      {
        titleInfo: new FormControl ('', Validators.required),
        bodyInfo: new FormControl ('', Validators.required),
        notifyInfo: new FormControl('Tous', Validators.required)
      },
    );
    this.editor = new Editor();
  }

  createInfo(){
    let notification = false;
    if (this.formCreateInfo.get('notifyInfo')?.value === 'Tous'){
      notification = true;
    }
    let info = new Info(this.formCreateInfo.get('titleInfo')?.value,
      this.formCreateInfo.get('bodyInfo')?.value,
      '',
      '',
      localStorage.getItem('userId'),
      notification);
    console.log('infoToCreate', info);

    this.userCreateSouscription = this.infoService.infoCreateSubject.subscribe(
      (response:any) => {
        this.emitAlertAndRouting('création effectuée', new userMsg(true, 'Création effectuée'));
        console.log('response ' + response);
      }
    );


    this.infoService.createInfoToServer(info);
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
          this.router.navigate(['/infos']);
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
