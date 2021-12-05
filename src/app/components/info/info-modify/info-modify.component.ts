import {Component, Input, OnInit} from '@angular/core';
import {InfoResult} from "../../../models/info-result.model";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {debounceTime, Subject, Subscription} from "rxjs";
import {InfoService} from "../../../services/info-service";
import {userMsg} from "../../../models/user-msg";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Editor} from "ngx-editor";

@Component({
  selector: 'app-info-modify',
  templateUrl: './info-modify.component.html',
  styleUrls: ['./info-modify.component.scss']
})
export class InfoModifyComponent implements OnInit {

  idInfo = '';
  idInfoInt: bigint;
  infoToModify: InfoResult;
  private paramRouteMapSubscription: Subscription;
  private getInfoSubscription: Subscription;
  private updateInfoSubscription: Subscription;
  formModifyInfo: FormGroup;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  private successSubscription = new Subscription();
  successMessage: string = '';
  availableMessage:boolean = false;
  typeMessage = 'success';

  notification = [{name : 'Tous', value : 'Tous', checked : true},
    {name : 'Aucun', value : 'Aucun', checked : false}];

  disabled = true;
  editor: Editor;

  constructor(private routeInfo: ActivatedRoute,
              private infoService: InfoService,
              private router: Router) { }

  ngOnInit(): void {

    this.paramRouteMapSubscription = this.routeInfo.paramMap.subscribe((params: ParamMap) => {
        this.idInfo = this.idInfo +params.get('idInfo');
        console.log('idInfo : ', this.idInfo);
        this.idInfoInt = BigInt(this.idInfo);
      }
    );
    this.editor = new Editor();

    this.getInfoSubscription = this.infoService.infoGetSubject.subscribe(
      (info: InfoResult) => {
        this.infoToModify = info;
        console.log('info', info);
        this.formModifyInfo.get('titleInfo')?.setValue(this.infoToModify.title);
        this.formModifyInfo.get('bodyInfo')?.setValue(this.infoToModify.body);
        if (!this.infoToModify.notification){
          this.formModifyInfo.get('notifyInfo')?.setValue('Aucun');
        }
      }
    );
    this.infoService.getInfoById(this.idInfoInt);

    this.formModifyInfo = new FormGroup(
      {
        titleInfo: new FormControl ('', Validators.required),
        bodyInfo: new FormControl ('', Validators.required),
        notifyInfo: new FormControl('Tous', Validators.required)
      },
    );
  }

  modifyInfo(){

    this.infoToModify.title = this.formModifyInfo.get('titleInfo')?.value;
    this.infoToModify.body = this.formModifyInfo.get('bodyInfo')?.value;
    this.updateInfoSubscription = this.infoService.infoUpdateSubject.subscribe(
      (result: String) => {
        console.log('updateInfo : ', result);
        this.emitAlertAndRouting('Mise à jour effectuée', new userMsg(true, 'Mise à jour effectuée'));
      }
      );
    this.infoService.updateInfoToServer(this.infoToModify);
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

  verifyChange($event: any){

  }

}
