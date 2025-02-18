import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-confirm-view-display",
  templateUrl: "./confirm-view-display.component.html",
  styleUrls: ["./confirm-view-display.component.scss"],
})
export class ConfirmViewDisplayComponent implements OnInit {
  @Input() confirmViewDisplayWidgetModal: any;
  @Input() displayUrl: any;
  @Output() confirmedViewDisplayWidget = new EventEmitter<boolean>();

  constructor(private toastr: ToastrService) {}
  ngOnInit() {}

  copyToCloipBoard() {
    navigator.clipboard.writeText(this.displayUrl);
    this.toastr.success("copied to clipboard", "Success");
  }

  viewdisplay() {
    this.confirmedViewDisplayWidget.emit(true);
    this.confirmViewDisplayWidgetModal.hide();
  }
}
