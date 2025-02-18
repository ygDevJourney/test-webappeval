import { Injectable } from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { BehaviorSubject, Observable } from "rxjs";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private mirrorName = new BehaviorSubject("New Mango Display");
  private activeMirrorDetail = new BehaviorSubject(null);
  private widgetSettingsLayout = new BehaviorSubject(null);
  private subscriptionDetails = new BehaviorSubject(null);
  private subscriptionObject = new BehaviorSubject(null);
  private subscriptionHirarchy = new BehaviorSubject(null);
  private templateList = new BehaviorSubject(null);
  private widgetsList = new BehaviorSubject(null);
  private displayCode = new BehaviorSubject(null);
  private customTemplateList = new BehaviorSubject(null);
  private addedCalendarAccountList = new BehaviorSubject(null);
  currentsubscriptionStatus = false;

  constructor(private storage: LocalStorageService) {}

  public getCustomTemplateList(): Observable<any> {
    return this.customTemplateList.asObservable();
  }
  public setCustomTemplateList(customTemplateList: any) {
    this.customTemplateList.next(customTemplateList);
  }

  public getAddedCalendarAccountList(): Observable<any> {
    return this.addedCalendarAccountList.asObservable();
  }
  public setAddedCalendarAccountList(accountList: any) {
    this.addedCalendarAccountList.next(accountList);
  }

  setDisplayCode(displayCode: string) {
    this.displayCode.next(displayCode);
  }

  getDisplayCode(): Observable<string> {
    return this.displayCode.asObservable();
  }

  public getTemplateList(): Observable<any> {
    return this.templateList.asObservable();
  }
  public setTemplateList(templateList: any) {
    this.templateList.next(templateList);
  }

  public getWidgetsList(): Observable<any> {
    return this.widgetsList.asObservable();
  }
  public setWidgetsList(widgetsList: any) {
    this.widgetsList.next(widgetsList);
  }

  setSubscriptionHirarchy(subscriptionHirarchy: string) {
    this.subscriptionHirarchy.next(subscriptionHirarchy);
  }

  getSubscriptionHirarchyt(): Observable<string> {
    return this.subscriptionHirarchy.asObservable();
  }

  setSubscriptionObject(subscriptionObject: string) {
    this.subscriptionObject.next(subscriptionObject);
  }

  getSubscriptionObject(): Observable<string> {
    return this.subscriptionObject.asObservable();
  }

  setSubscriptionDetails(subscriptionDetails: string) {
    this.subscriptionDetails.next(subscriptionDetails);
  }

  getSubscriptionDetails(): Observable<string> {
    return this.subscriptionDetails.asObservable();
  }

  setMirrorName(mirrorName: string) {
    this.mirrorName.next(mirrorName);
  }

  getMirrorName(): Observable<string> {
    return this.mirrorName.asObservable();
  }

  setActiveMirrorDetails(mirror: any) {
    this.activeMirrorDetail.next(mirror);
  }

  getActiveMirrorDetails(): Observable<any> {
    return this.activeMirrorDetail.asObservable();
  }

  setWidgetSettingsLayout(widgetSettingsLayout: any) {
    this.widgetSettingsLayout.next(widgetSettingsLayout);
  }

  getWidgetSettingsLayout(): Observable<any> {
    return this.widgetSettingsLayout.asObservable();
  }

  getCurrentSubscriptionStatus(): boolean {
    let subscription = this.storage.get("subscriptionObject");

    if (subscription != null && subscription != undefined) {
      let currentdate = moment.utc();
      if (subscription.expiryDate.isAfter(currentdate)) {
        this.currentsubscriptionStatus = true;
      } else {
        this.currentsubscriptionStatus = false;
      }
    }
    return this.currentsubscriptionStatus;
  }
}
