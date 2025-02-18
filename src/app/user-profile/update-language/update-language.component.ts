import { Component, Input, OnInit } from '@angular/core';
import { Validator } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-web-storage';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/service/profile.service';
import { SupportedLanguage } from 'src/app/util/static-data';

@Component({
  selector: 'app-update-language',
  templateUrl: './update-language.component.html',
  styleUrls: ['./update-language.component.scss']
})
export class UpdateLanguageComponent implements OnInit {

  @Input() languageModal: any;
  @Input() currentLanguage: any;

  supportedlanguage : any[] = SupportedLanguage
  selectedLanguage:any;
  constructor(
    private storage: LocalStorageService,
    private route: Router,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private _profileService:ProfileService
  ) { }

  ngOnInit() {
    if (this.storage.get("userDetails") === null) {
      this.storage.clear();
      this.route.navigate(["login"]);
    }
    this.selectedLanguage = this.currentLanguage;
  }

  discardChanges() {
    this.languageModal.hide();
  }

  updatelanguage(){
    this.loadingSpinner.show();    
    this._profileService.updateLanguage(this.selectedLanguage.value).subscribe(
      (res: any) => {
        let userdetail = this.storage.get("userDetails");
        userdetail.userLocalLanguage = this.selectedLanguage.value;
        this.storage.set("userDetails",userdetail);
        this.loadingSpinner.hide();
        this.languageModal.hide();
        this.route.navigate(["mirrors"]);
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message);        
      }
    )
  }

}
