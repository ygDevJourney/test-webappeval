import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { LocalStorageService } from "angular-web-storage";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "MangoDisplayPwaApp";
  deferredPrompt: any;
  showButton = false;
  newVariable: any = window.navigator;
  standalone = this.newVariable.standalone;
  userAgent = window.navigator.userAgent.toLocaleUpperCase();
  isAndroid = this.userAgent.indexOf("android") > -1;

  constructor(
    private route: Router,
    public translate: TranslateService,
    private deviceService: DeviceDetectorService,
    private storage: LocalStorageService
  ) {
    translate.addLangs(["en"]);
    translate.setDefaultLang("en");
    translate.use("en");
    // const browserLang = translate.getBrowserLang();
    // if (
    //   this.storage.get("userDetails") &&
    //   this.storage.get("userDetails") !== null
    // ) {
    //   translate.use(
    //     this.storage.get("userDetails").userLocalLanguage === "es" ? "es" : "en"
    //   );
    // } else {
    //   translate.use(browserLang === "es" ? browserLang : "en");
    // }

    if (
      this.storage.get("userDetails") !== undefined ||
      this.storage.get("userDetails") !== null
    ) {
      let pageURL = window.location.href;
      if (
        pageURL.includes("widgets/layout?calendar=true") ||
        pageURL.includes("widgets/layout?googlePhotos=true") ||
        pageURL.includes("widgets/layout/outlookcalendar") ||
        pageURL.includes("widgets/layout/outlookTodoTask") ||
        pageURL.includes("widgets/layout/TodoIst") ||
        pageURL.includes("widgets/layout?googletask=true") ||
        pageURL.includes("payment-success") ||
        pageURL.includes("plans-and-payments") ||
        pageURL.includes("payment-error")
      ) {
        return;
      } else {
        this.route.navigate(["mirrors"]);
      }
    } else {
      this.route.navigate(["login"]);
      return;
    }
  }

  ngOnInit() {
    // this.versionCheckService.initVersionCheck();

    // if (window.matchMedia('(display-mode: standalone)').matches) {
    //   alert("PWA")
    // }else {
    //   alert("Not PWA")
    // }
    // Checks if should display install popup notification:
    if (
      this.deviceService.isMobile() &&
      this.deviceService.os !== "Android" &&
      !this.isInStandaloneMode() &&
      !this.deviceService.isDesktop()
    ) {
      // $("#modal-btn").click();
    }
  }

  isInStandaloneMode = () =>
    "standalone" in window.navigator && this.newVariable.standalone;
}
