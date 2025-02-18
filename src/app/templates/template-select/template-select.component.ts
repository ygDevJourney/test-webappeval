import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-template-select",
  templateUrl: "./template-select.component.html",
  styleUrls: ["./template-select.component.scss"],
})
export class TemplateSelectComponent implements OnInit {
  @Input() templateSelectModal: any;
  @Input() data: any;
  @Input() requestType: string;
  @Output() emittemplate: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitApplyTemplate: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  emitSelectedTemplate() {
    if (this.requestType == "deviceSetup") {
      this.emittemplate.emit({
        templateData: this.data,
      });
    } else if (this.requestType == "templateUpdate") {
      this.emitApplyTemplate.emit({
        templateData: this.data,
      });
    }
    this.templateSelectModal.hide();
  }
}
