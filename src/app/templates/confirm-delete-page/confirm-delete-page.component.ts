import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-page',
  templateUrl: './confirm-delete-page.component.html',
  styleUrls: ['./confirm-delete-page.component.scss']
})
export class ConfirmDeletePageComponent implements OnInit {

  @Input() confirmDeletePageModal: any;
  @Output() confirmedDeletePage = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  deletePage(){
    this.confirmedDeletePage.emit(true);
    this.confirmDeletePageModal.hide();
  }

}
