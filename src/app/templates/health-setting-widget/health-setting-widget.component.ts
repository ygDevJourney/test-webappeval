import { AfterViewInit, EventEmitter } from '@angular/core';
import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonFunction } from 'src/app/service/common-function.service';
import { DataService } from 'src/app/service/data.service';
import { WidgetService } from 'src/app/service/widget.service';
import { LayoutRequest, WidgetBackgroundSetting } from 'src/app/util/static-data';
import { WidgetsUtil } from 'src/app/util/widgetsUtil';

@Component({
  selector: 'app-health-setting-widget',
  templateUrl: './health-setting-widget.component.html',
  styleUrls: ['./health-setting-widget.component.scss']
})
export class HealthSettingWidgetComponent implements OnInit,OnChanges {
  @Input() healthSettingModal: any;
  @Input() category: string;
  @Input() activeLayout: any;
  @Output() updateWidgetStatusEventEmiter = new EventEmitter();
  
  selectedAppleHealthWidgets :any;
  selectedFeetBitHealthWidgets:any;
  widgetData:any;
  healthWidgets:any;
  isAppleHealthEnabled:boolean = true;
  isFitbitEnabled:boolean=false;
  fitBitWidgets :any;
  appleHealthWidget :any;   
  selectedWidgetId= [];   
  settingDisplayflag: any;
  activeMirrorDetails: any;  
  isAppleHealthDataAvailable:boolean=false;
  defaultHealthWidget: any;

  //background widget setting
  widgetType:any
  widgetBgSetting: any;  
  newBgSetting:any;      

  constructor(private _dataService:DataService,
    private toastr: ToastrService,
    private _widgetService: WidgetService,
    private commonFunction: CommonFunction,
    private layoutRequest: LayoutRequest,
    private storage: LocalStorageService,    
    private loadingSpinner: Ng4LoadingSpinnerService,
    private _widgetUtil: WidgetsUtil
    ) { }
    
  ngOnInit() { 
   }

  ngOnChanges(changes) {
    this.activeMirrorDetails =  this.storage.get('activeMirrorDetails');

    if(changes.category && changes.category.currentValue === "health"){
      this._dataService.getWidgetSettingsLayout().subscribe(data => {
        this.isAppleHealthDataAvailable = data.isAppleHealthEnabled;
        this.selectedAppleHealthWidgets = [];
        this.selectedFeetBitHealthWidgets = [];
        this.widgetData = data.widgetSetting;
        this.healthWidgets = data.healthWidget[0];
        this.fitBitWidgets = this.healthWidgets.Fitbit;
        this.appleHealthWidget = this.healthWidgets.HealthKit;
        this.createSelectedItemsArray(this.widgetData);
      });
    }
  }

  setBackgroundWidgetDetail(){
    this.widgetType = this.category;
    let widgetData = this.storage.get("selectedwidget");
    if(widgetData!=null){
      this.widgetBgSetting = widgetData.widgetBackgroundSettingModel;
    }
    this.activeMirrorDetails =  this.storage.get('activeMirrorDetails');
  }

  createSelectedItemsArray(widgetPageList: any){
    widgetPageList.forEach(widgetPageData => {
        widgetPageData.widgets.forEach(element => {
          if(element.widgetMasterCategory === "Apple Health" || element.widgetMasterCategory === "Fitbit"){ 
            if(element.status === "on")
            {
              this.selectedWidgetId.push(element.contentId);
            }
          }
        });
      });

      Object.keys(this.appleHealthWidget).forEach(key => {
        let value = this.appleHealthWidget[key];
        value.forEach(element => {
          if(this.selectedWidgetId.includes(element.id)){
            element["status"] = "on";
          } else {
            element["status"] = "off";
          }
        });  
      });


      Object.keys(this.fitBitWidgets).forEach(key => {
        let value = this.fitBitWidgets[key];
        value.forEach(element => {
          if(this.selectedWidgetId.includes(element.id)){
            element["status"] = "on";
          } else {
            element["status"] = "off";
          }
        });  
      });
      this.setDisplayflag();    
  }

  dismissModel() {
    this.healthSettingModal.hide();
  }

  setDisplayflag() {
    this.settingDisplayflag = true;
  }

  updateAppleHealthToggle()
  {
    this.isAppleHealthEnabled = !this.isAppleHealthEnabled;
    if(this.isAppleHealthEnabled==true && this.isFitbitEnabled)
    {
      this.isFitbitEnabled = false;
    }
  }

  updateFitbitToggle()
  {
    this.isFitbitEnabled = !this.isFitbitEnabled;
    if(this.isAppleHealthEnabled==true && this.isFitbitEnabled)
    {
      this.isAppleHealthEnabled = false;
    }
  }

  customFindIndex(widgetsArray: any, contentId: any){
    for(let i=0;i<widgetsArray.length;i++){
      let widgetIndex = widgetsArray[i].widgets.findIndex(
        element => element.contentId === contentId
      );
      if(widgetIndex !== -1){
        return { pageIndex: i, widgetIndex: widgetIndex};
      }
    }
  }

  changeHealthWidgetSetting(widget: any, type:string, category: string) {
    let selectedIndex = this.customFindIndex(this.widgetData, widget.id);
    
    if(widget.status === "off") {
      if(type === 'Fitbit')
      {
        this.fitBitWidgets[category].forEach(element => {
          if(widget.id == element.id){
              element["status"] = "on";
            } 
          });
      }else if (type ==='Apple Health')
      {
        this.appleHealthWidget[category].forEach(element => {
          if(widget.id == element.id){
              element["status"] = "on";
            } 
          });
      }
      /** Local displaying object changes. */
      this.selectedWidgetId.push(widget.id);
      /** Data service object changes. */
      this.widgetData[0].widgets[selectedIndex.widgetIndex].status = "on";
      this.widgetData[this.activeLayout].widgets.push(this.widgetData[0].widgets[selectedIndex.widgetIndex]);
      this.widgetData[0].widgets.splice(selectedIndex.widgetIndex, 1);
    }else if(widget.status === "on"){
        if(type === 'Fitbit')
        {
          this.fitBitWidgets[category].forEach(element => {
            if(widget.id == element.id){
                element["status"] = "off";
              } 
            });
        }else if (type ==='Apple Health')
        {
          this.appleHealthWidget[category].forEach(element => {
            if(widget.id == element.id){
                element["status"] = "off";
              } 
            });
        }
      /** Local displaying object changes. */
      this.selectedWidgetId.splice(this.selectedWidgetId.indexOf(widget.id),1);
      /** Data service object changes. */
      this.widgetData[selectedIndex.pageIndex].widgets[selectedIndex.widgetIndex].status = "off";
      this.widgetData[0].widgets.push(this.widgetData[selectedIndex.pageIndex].widgets[selectedIndex.widgetIndex]);
      this.widgetData[selectedIndex.pageIndex].widgets.splice(selectedIndex.widgetIndex, 1);
    }
  }

  updatebackgroundSettings(event) {
    this.newBgSetting = event;
    const healthBgPayload = {
      userMirrorId: this.activeMirrorDetails.id,
      mastercategory: ["Fitbit","Apple Health"],
      widgetBackgroundSettingModel: this.newBgSetting
    };
    this.commonFunction.updateWidgetSettings(this.newBgSetting, healthBgPayload);
    this.healthSettingModal.hide();
  }

  saveHealthSettings() {
    let activemirror = this._dataService.getActiveMirrorDetails();
    this.updateWidgetStatusEventEmiter.emit();
    this.healthSettingModal.hide();
  }

  checkHealthDataAvailability()
  {
    this.loadingSpinner.show();        
    this._widgetService.checkHealthDataAvailability().subscribe(
      (res: any) => { 
        this.isAppleHealthDataAvailable = res.object;        
        let widgetsetting = this.storage.get("activeWidgetDetails");
        widgetsetting.isAppleHealthEnabled = this.isAppleHealthDataAvailable;
        this.storage.set("activeWidgetDetails",widgetsetting);
        this._dataService.setWidgetSettingsLayout(widgetsetting);
        this.loadingSpinner.hide();
      },
      (error: any) => {
        this.toastr.error(error.error.message);
        this.loadingSpinner.hide();
      });
  }
}
