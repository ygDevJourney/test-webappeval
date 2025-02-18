import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-subscription',
  templateUrl: './confirm-delete-subscription.component.html',
  styleUrls: ['./confirm-delete-subscription.component.scss']
})
export class ConfirmDeleteSubscriptionComponent implements OnInit {

  @Input() confirmDeleteSubscriptionModal: any;
  @Output() confirmedDeleteSubscription = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  deleteSubscription(){
    this.confirmedDeleteSubscription.emit(true);
    this.confirmDeleteSubscriptionModal.hide();
  }

}
