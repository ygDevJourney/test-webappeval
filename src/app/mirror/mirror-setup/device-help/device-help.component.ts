import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-help',
  templateUrl: './device-help.component.html',
  styleUrls: ['./device-help.component.scss']
})
export class DeviceHelpComponent implements OnInit {

  @Input() deviceHelpModal: any;

  constructor() { }

  ngOnInit() {
  }

  dismissModel() {
    this.deviceHelpModal.hide();
  }

}
