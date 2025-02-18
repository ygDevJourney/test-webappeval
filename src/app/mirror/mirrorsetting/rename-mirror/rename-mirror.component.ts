import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validator } from 'src/app/util/validator';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/service/data.service';
import { MirrorService } from 'src/app/service/mirror.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rename-mirror',
  templateUrl: './rename-mirror.component.html',
  styleUrls: ['./rename-mirror.component.scss']
})
export class RenameMirrorComponent implements OnInit {

  mirrorName: any = { value: "", error: null };
  private activeUserMirror : any;

  constructor(
    private router: Router,
    private validator: Validator,
    private translator: TranslateService,
    private _dataService: DataService,
    private _mirrorService : MirrorService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this._dataService.getActiveMirrorDetails().subscribe(mirrorDetails => {
      this.activeUserMirror = mirrorDetails;
      this.mirrorName.value = this.activeUserMirror.mirrorName;
    })
  }

  updateMirroName(){
    if(this.validator.isEmptyField(this.mirrorName.value))
    {
      this.mirrorName.error = this.translator.instant(
        "ERROR.EMPTYFIELDS"
      );
      return
    } else {
      let renameMirrorRequestData = {
        "mirror" : {
          "id" : 1030
        },
        "mirrorName" : "motog4-test",
        "userRole" : "general"
      }
      
      renameMirrorRequestData.mirror.id = this.activeUserMirror.mirror.id;
      renameMirrorRequestData.userRole = this.activeUserMirror.userRole;
      renameMirrorRequestData.mirrorName = this.mirrorName.value;

      this._mirrorService.renameMirror(renameMirrorRequestData).subscribe(
        (res:any) => {
          this.mirrorName.error = null;
          this.activeUserMirror.mirrorName = this.mirrorName.value;
          this._dataService.setMirrorName(this.mirrorName.value)
          this.backToMirrorSettingPage();
        },
        (err: any) => {
          this.toastr.error(err.error.message, "Error");
        }
      )
    }
  }

  backToMirrorSettingPage()
  {
    this.router.navigateByUrl("mirrors/setting");
  }
  
}
