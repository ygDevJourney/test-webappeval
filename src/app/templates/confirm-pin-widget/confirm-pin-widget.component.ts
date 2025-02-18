import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-pin-widget',
  templateUrl: './confirm-pin-widget.component.html',
  styleUrls: ['./confirm-pin-widget.component.scss']
})
export class ConfirmPinWidgetComponent implements OnInit {

  @Input() confirmPinwidgetModal: any;
  @Output() confirmedPinWidget = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  confirmPinWidget(){
    this.confirmedPinWidget.emit(true);
    this.confirmPinwidgetModal.hide();
  }

}
