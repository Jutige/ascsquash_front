import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css']
})
export class DialogModalComponent implements OnInit {

@Input() title: string;
@Input() message: string;
  constructor(public activeModal: NgbActiveModal) {
    this.title = '';
    this.message = '';
  }

  ngOnInit(): void {

  }

}
