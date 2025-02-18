import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDirective } from "angular-bootstrap-md";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { AwsService } from "src/app/service/aws.service";
import { environment } from "src/environments/environment";
import * as bytes from "bytes";
import { SubscriptionUtil } from "src/app/util/subscriptionUtil";
declare var $: any;

@Component({
  selector: "app-manage-s3-bucket",
  templateUrl: "./manage-s3-bucket.component.html",
  styleUrls: ["./manage-s3-bucket.component.scss"],
})
export class ManageS3BucketComponent implements OnInit {
  @Output() updateS3Details: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateBgS3Details: EventEmitter<any> = new EventEmitter<any>();
  @Output() updatePDFS3Details: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateVideoS3Details: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateMicrosoftS3Details: EventEmitter<any> =
    new EventEmitter<any>();

  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Input() requestType: any = "userprofile";
  @Input() selectedS3Files: any[] = [];

  @ViewChild("fileExistAlert", { static: true })
  commonAlertModal: ModalDirective;

  @ViewChild("fileSelector", { static: false }) file_selector!: ElementRef;
  file_selection_form: FormGroup;

  s3files: any[] = [];
  currentPath: any[] = [];
  type: string = "manage-s3-comp";
  selectedFile: any[] = [];
  existingFile: any[] = [];
  selectedView: string = "list";
  filterKey: string = "";
  headers: string[] = ["File Name", "Type", "Size", "Added On"];
  newFolderName: string = "";
  isCollapsed: boolean = true;
  alertType: string = "selectedFileExist";
  alertHeaderMessage: string = "File can’t be deleted";
  totalAvailableSize: number = 250000000;
  usedSize: string = "";
  percentage: number = 0;
  totalUtilizedSizeInBytes: number = 0;
  selectedFileSize: number = 0;
  currentSubscriptionHirarchy: number = 0;
  subscriptionData: any;
  supportedRequestType: string[] = [
    "bgRequestType",
    "imageRequestType",
    "pdfRequestType",
    "videoRequestType",
    "microsoftRequestType",
  ];
  supportedVideoType: string[] = ["video/webm", "video/mp4", "video/quicktime"];
  supportedMicrosoftType: string[] = [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  multiFileSelect: boolean = true;
  acceptedFormat = "image/*,application/pdf,.docx,.xlsx,.jfif,.gif";

  constructor(
    private storage: LocalStorageService,
    private route: Router,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private awsService: AwsService,
    private _subscriptionUtil: SubscriptionUtil
  ) {
    this.file_selection_form = new FormGroup({
      file_selection: new FormControl(),
    });
  }

  ngOnInit() {
    this.subscriptionData = this.storage.get("subscriptionObject");
    if (this._subscriptionUtil.getCurrentSubscriptionStatus) {
      this.currentSubscriptionHirarchy =
        this._subscriptionUtil.getCurrentPlanHirarchy();
      if (this.currentSubscriptionHirarchy == 2) {
        this.totalAvailableSize = 250000000;
      } else if (this.currentSubscriptionHirarchy >= 3) {
        this.totalAvailableSize = 1000000000;
      }
    }

    if (environment.production) {
      this.awsService.currentFolder = "prod/";
    } else {
      this.awsService.currentFolder = "test/";
    }
    this.checkBaseFolder();
    this.trackFileSelection();
  }

  getFormatedSize() {
    if (this.currentSubscriptionHirarchy == 2) {
      let usedSizeText = "$utilizedSize of 250MB";
      this.usedSize = usedSizeText.replace(
        "$utilizedSize",
        bytes(this.totalUtilizedSizeInBytes, { decimalPlaces: 0 })
      );
    } else if (this.currentSubscriptionHirarchy >= 3) {
      let usedSizeText = "$utilizedSize of 1GB";
      this.usedSize = usedSizeText.replace(
        "$utilizedSize",
        bytes(this.totalUtilizedSizeInBytes, { decimalPlaces: 0 })
      );
    }

    this.percentage = Math.floor(
      (this.totalUtilizedSizeInBytes / this.totalAvailableSize) * 100
    );
  }

  getUtilizedSize() {
    this.loadingSpinner.show();
    this.awsService
      .getS3FolderSize(this.getBaseS3Folder())
      .then((res) => {
        this.loadingSpinner.hide();
        this.totalUtilizedSizeInBytes = res;
        this.getFormatedSize();
      })
      .catch((error) => {
        this.loadingSpinner.hide();
      });
  }

  checkSelectedFile(key: string) {
    return this.selectedFile.includes(key);
  }

  trackFileSelection() {
    this.file_selection_form
      .get("file_selection")
      .valueChanges.subscribe(() => {
        const file_selection = this.file_selector.nativeElement;
        let files: File[] = Array.from(file_selection.files); // Convert FileList to an array

        // Filter out video files
        files = files.filter(
          (file) => !file.type.includes("video") && !file.type.includes("bmp")
        );

        if (files.length > 0) {
          this.uploadFileToS3(files);
          this.file_selector.nativeElement.value = "";
        }
      }) as Subscription;
  }

  goBackToOptionPage() {
    if (this.currentPath.length > 2) {
      this.openFolderByIndex(this.currentPath.length - 2);
    } else {
      if (this.requestType == "userprofile") {
        this.discardChanges();
      } else if (this.supportedRequestType.includes(this.requestType)) {
        this.close.emit();
      }
    }
  }

  updateView(view) {
    this.selectedView = view;
  }

  openFolderByIndex(index: number) {
    let intermidiatPath = this.currentPath.slice(0, index + 1);
    if (
      intermidiatPath.length >= 2 &&
      intermidiatPath.length != this.currentPath.length
    ) {
      let path = intermidiatPath.join("/").concat("/");
      this.awsService.currentFolder = path;
      this.getCurrentFolder();
    }
  }
  clearLastSelectedData(lastCheckedItem: any) {
    for (let index = 0; index < this.s3files.length; index++) {
      const element = this.s3files[index];
      if (element.name == lastCheckedItem.key) {
        element.isSelected = false;
        break;
      }
    }
  }

  selectItem(event, selectItem) {
    if (
      this.supportedRequestType.includes(this.requestType) &&
      selectItem.type == "folder"
    ) {
      return;
    }
    if (event.target.checked) {
      let data = {
        s3_img_url: selectItem.s3_img_url,
        key: selectItem.name,
        mimeType: selectItem.mimeType,
        zindex: 0,
      };
      if (this.selectedFile.length > 0) {
        data.zindex =
          this.selectedFile[this.selectedFile.length - 1].zindex + 1;
      }
      if (
        (this.requestType == "pdfRequestType" ||
          this.requestType == "videoRequestType" ||
          this.requestType == "microsoftRequestType") &&
        this.selectedFile.length > 0
      ) {
        this.clearLastSelectedData(this.selectedFile[0]);
        this.selectedFile.pop();
      }
      this.selectedFile.push(data);
    } else {
      for (let index = 0; index < this.selectedFile.length; index++) {
        const element = this.selectedFile[index];
        if (element.key == selectItem.name) {
          this.selectedFile.splice(index, 1);
          this.updateIndes(index);
          break;
        }
      }
    }
  }

  updateIndes(lastIndex) {
    for (let index = lastIndex; index < this.selectedFile.length; index++) {
      this.selectedFile[index].zindex = this.selectedFile[index].zindex - 1;
    }
  }

  checkBaseFolder() {
    this.loadingSpinner.show();
    let user = this.storage.get("userDetails");
    let key = user.id.toString().concat("/");
    if (environment.production) {
      key = "prod/".concat(user.id.toString().concat("/"));
    } else {
      key = "test/".concat(user.id.toString().concat("/"));
    }

    this.awsService.isFolderExist(key).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.setbasePath();
        this.getCurrentFolder();
        this.getUtilizedSize();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        let user = this.storage.get("userDetails");
        this.createBaseFolder(user.id.toString());
      }
    );
  }

  createBaseFolder(key: string) {
    this.getFormatedSize();
    this.loadingSpinner.show();
    this.awsService.createS3Folder(key).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.setbasePath();
        this.getCurrentFolder();
      },
      (err: any) => {
        this.loadingSpinner.hide();
      }
    );
  }

  openFolder(template: any) {
    if (template.type == "folder") {
      this.awsService.currentFolder = template.name;
      this.getCurrentFolder();
    }
  }

  getCurrentFolder() {
    this.loadingSpinner.show();
    this.awsService.getS3Folder().subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.s3files = [];
        const folders = res.filter((item) => item.type === "folder");
        const files = res.filter((item) => item.type === "file");
        folders.sort((a, b) => a.name.localeCompare(b.name));
        files.sort((a, b) => {
          return (
            new Date(b.modifiedTime).getTime() -
            new Date(a.modifiedTime).getTime()
          );
        });

        this.s3files = [...folders, ...files];

        // this.s3files = res;
        let path = this.awsService.currentFolder.substring(
          0,
          this.awsService.currentFolder.length - 1
        );
        this.currentPath = path.split("/");
        this.mapData();
      },
      (err: any) => {
        this.toastr.error(err.error.message, "Error");
        this.loadingSpinner.hide();
      }
    );
  }

  mapData() {
    this.selectedFile = this.selectedS3Files;
    if (this.supportedRequestType.includes(this.requestType)) {
      if (this.requestType == "pdfRequestType") {
        this.s3files = this.s3files
          .filter(
            (file) =>
              file.mimeType.includes("pdf") || file.mimeType.includes("folder")
          )
          .map((element) => {
            element.isSelected = this.checkKeyExist(element.name);
            return element;
          });
      } else if (this.requestType == "videoRequestType") {
        this.s3files = this.s3files
          .filter(
            (file) =>
              this.supportedVideoType.includes(file.mimeType) ||
              file.mimeType.includes("folder")
          )
          .map((element) => {
            element.isSelected = this.checkKeyExist(element.name);
            return element;
          });
      } else if (this.requestType == "microsoftRequestType") {
        this.s3files = this.s3files
          .filter(
            (file) =>
              this.supportedMicrosoftType.includes(file.mimeType) ||
              file.mimeType.includes("folder")
          )
          .map((element) => {
            element.isSelected = this.checkKeyExist(element.name);
            return element;
          });
      } else {
        this.s3files = this.s3files
          .filter(
            (file) =>
              file.mimeType.includes("image") ||
              file.mimeType.includes("folder")
          )
          .map((element) => {
            element.isSelected = this.checkKeyExist(element.name);
            return element;
          });
        this.selectedView = "grid";
      }
    }
  }

  checkKeyExist(key: string) {
    if (this.selectedS3Files.length == 0) {
      return false;
    } else {
      for (let index = 0; index < this.selectedS3Files.length; index++) {
        const element = this.selectedS3Files[index];
        if (element.key == key) {
          return true;
        }
      }
    }
    return false;
  }

  setbasePath() {
    let user = this.storage.get("userDetails");
    let key = user.id.toString().concat("/");
    if (environment.production) {
      this.awsService.currentFolder = "prod/".concat(key);
    } else {
      this.awsService.currentFolder = "test/".concat(key);
    }
  }

  getBaseS3Folder() {
    let user = this.storage.get("userDetails");
    let key = user.id.toString().concat("/");
    if (environment.production) {
      return "prod/".concat(key);
    } else {
      return "test/".concat(key);
    }
  }

  clearFolderDetails() {
    this.newFolderName = "";
    $("#create-s3-folder").collapse("toggle");
  }

  addFolderName() {
    if (this.newFolderName.trim().length == 0) {
      this.toastr.error("Please add folder name.", "Error");
      return;
    }
    this.loadingSpinner.show();
    this.awsService.createS3Folder(this.newFolderName).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.clearFolderDetails();
        this.getCurrentFolder();
      },
      (err: AWS.AWSError) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.message, "Error");
      }
    );
  }

  openFileSelector() {
    const file_selection = this.file_selector.nativeElement;
    if (this.requestType == "pdfRequestType") {
      this.acceptedFormat = "application/pdf";
    } else if (
      this.requestType == "imageRequestType" ||
      this.requestType == "bgRequestType"
    ) {
      this.acceptedFormat = "image/*";
    } else if (this.requestType == "microsoftRequestType") {
      this.acceptedFormat =
        ".docx,.xlsx,application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else {
      this.acceptedFormat = "image/*,application/pdf,.docx,.xlsx,.jfif,.gif";
    }

    setTimeout(() => {
      file_selection.click();
    }, 200);
  }

  getSelectedFileSize(files: File[]) {
    let fileSize: number = 0;
    Array.from(files).forEach((file) => (fileSize += file.size));
    return fileSize;
  }

  uploadFileToS3(files: File[]) {
    this.selectedFileSize = this.getSelectedFileSize(files);
    let calculatedSize = this.totalUtilizedSizeInBytes + this.selectedFileSize;
    if (calculatedSize > this.totalAvailableSize) {
      this.alertType = "fileSizeLimit";
      this.alertHeaderMessage = "Storage Limit Exceeded";
      this.commonAlertModal.show();
      return;
    }
    const uploadPromises = [];
    this.loadingSpinner.show();
    this.awsService
      .uploadFile(files)
      .then(() => {
        this.toastr.success("File uploaded successfully");
        this.loadingSpinner.hide();
        this.getCurrentFolder();
        this.totalUtilizedSizeInBytes += this.selectedFileSize;
        this.getFormatedSize();
      })
      .catch((error) => {
        this.loadingSpinner.hide();
        this.toastr.error(error.message);
      });
  }

  deleteFiles() {
    let mappedData = this.createFileCheckRequestData();
    let payload = { s3FileCheckRequest: mappedData };
    this.loadingSpinner.show();
    this.awsService.checkSelectedImageFile(payload).subscribe(
      (result: any) => {
        this.loadingSpinner.hide();
        if (result.object == true) {
          this.alertType = "selectedFileExist";
          this.alertHeaderMessage = "File can’t be deleted";
          this.commonAlertModal.show();
          return;
        } else {
          this.deleteFileFromS3();
        }
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  createFileCheckRequestData(): any[] {
    let image = [];
    let others = [];
    let payload = [];

    this.selectedFile.forEach((element) => {
      if (element.mimeType.includes("image")) {
        image.push(element.key);
      } else {
        others.push(element.key);
      }
    });
    if (image.length > 0) {
      let imageData = { type: "image", keys: image };
      payload.push(imageData);
    } else if (others.length > 0) {
      let otherFile = { type: "others", keys: others };
      payload.push(otherFile);
    }

    return payload;
  }

  deleteFileFromS3() {
    this.loadingSpinner.show();
    if (this.selectedFile.length <= 0) {
      this.toastr.error("Please select some files");
    }
    const names = this.selectedFile.map((item) => item.key);
    this.awsService.deleteSelectedFile(names).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.selectedFile = [];
        this.toastr.success("File(s) have been deleted");
        this.getUtilizedSize();
        this.getCurrentFolder();
      },
      (err: AWS.AWSError) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.message);
      }
    );
  }

  discardChanges() {
    this.route.navigate(["user-profile"]);
  }

  applyFiles() {
    let data = {
      selectedS3Files: this.selectedFile,
    };
    if (this.requestType == "imageRequestType") {
      this.updateS3Details.emit(data);
    } else if (this.requestType == "bgRequestType") {
      this.updateBgS3Details.emit(data);
    } else if (this.requestType == "pdfRequestType") {
      this.updatePDFS3Details.emit(data);
    } else if (this.requestType == "videoRequestType") {
      this.updateVideoS3Details.emit(data);
    } else if (this.requestType == "microsoftRequestType") {
      this.updateMicrosoftS3Details.emit(data);
    }
  }

  showImage(s3file) {
    if (s3file.type != "folder") {
    }
  }
}
