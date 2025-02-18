import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-widget',
  templateUrl: './confirm-delete-widget.component.html',
  styleUrls: ['./confirm-delete-widget.component.scss']
})
export class ConfirmDeleteWidgetComponent implements OnInit {

  @Input() confirmDeleteWidgetModal: any;
  @Output() confirmedDeleteWidget = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  deleteWidget(){
    this.confirmedDeleteWidget.emit(true);
    this.confirmDeleteWidgetModal.hide();
  }

}
