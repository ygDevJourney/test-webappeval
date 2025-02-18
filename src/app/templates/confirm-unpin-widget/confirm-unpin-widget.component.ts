import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-unpin-widget',
  templateUrl: './confirm-unpin-widget.component.html',
  styleUrls: ['./confirm-unpin-widget.component.scss']
})
export class ConfirmUnpinWidgetComponent implements OnInit {

  @Input() confirmUnpinwidgetModal: any;
  @Output() confirmedUnpinWidget = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  confirmUnpinWidget(){
    this.confirmedUnpinWidget.emit(true);
    this.confirmUnpinwidgetModal.hide();
  }

}
