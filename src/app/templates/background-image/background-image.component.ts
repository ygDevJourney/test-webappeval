import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/service/data.service";
import { WidgetService } from "src/app/service/widget.service";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { CommonFunction } from "src/app/service/common-function.service";
import { ImageWidgetService } from "src/app/service/image-widget.service";
import { Validator } from "src/app/util/validator";
import {
  CdkDragEnter,
  moveItemInArray,
  CdkDragMove,
  CdkDragDrop,
} from "@angular/cdk/drag-drop";
import { CustomSortPipe } from "src/app/pipes/custom-sort.pipe";
import { SubscriptionUtil } from "src/app/util/subscriptionUtil";
import {
  available_image_transition,
  available_transition,
} from "src/app/util/static-data";

@Component({
  selector: "app-background-image",
  templateUrl: "./background-image.component.html",
  styleUrls: ["./background-image.component.scss"],
})
export class BackgroundImageComponent implements OnInit {
  @Input() backgroundImageModal: any;
  @Input() category: string;
  @Input() activeLayout: any;
  @Input() googlePhotoCredentials: any;
  @Output() updateBackgroundImageEventEmiter = new EventEmitter<any>();

  @ViewChild("dropListContainer", { static: true })
  dropListContainer?: ElementRef;

  dropListReceiverElement: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };

  isCollapsed: boolean = false;

  availableTransition = [...available_image_transition];
  selectedTransition: string = "fade";

  backgroundImageFormGroup: FormGroup;
  photoChangeDuration: any = 1;
  appleAccessToken: string;
  countList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  backgroundCategoryList: any;
  selectedUnsplashedCategory = ["Nature"];
  widgetData = null;
  isUnsplshSelected = false;
  isApplePhotoSelected: any = false;
  ismangoBackgroundSelected: any = false;
  isGoogleAlbumAdded: boolean = false;

  backgroundCategoryData: any;
  availableUnsplashList = [];
  googleAlbumList = [];
  backgroundImageData: any;
  myrange: number = 1.1;
  selectedAlbum = {
    googleAlbumName: "",
    googlePhotoAlbumId: "",
  };
  widgetLayoutDetails: any;
  subscriptionAvailable: false;
  bgsettingBackgroundImageOptions: any;
  ispublicUrlImageExist = false;
  isSinglePhotoSelected: any = false;
  imageUrlLink: string = null;
  isAppleUrlInvalid: boolean = false;
  isMyFileSelected = false;
  selectedS3Files: any[] = [];
  currentSubscriptionHirarchy: number = 0;
  requestType: string = "bgRequestType";

  defaultMinutes = 0;
  defaultSeconds = 30;

  minute = 0;
  second = 30;

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private widgetService: WidgetService,
    private _imageWidgetService: ImageWidgetService,
    private storage: LocalStorageService,
    private validator: Validator,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private _customSortPipe: CustomSortPipe,
    private _subscriptionUtil: SubscriptionUtil
  ) {}

  ngOnInit() {
    this.createBackgroundForm(this.backgroundImageData);
    let subscription = this.storage.get("subscriptionDetails");
    if (subscription != null) {
      this.subscriptionAvailable = subscription.isSubscriptionAvailable;
    }

    if (this._subscriptionUtil.getCurrentSubscriptionStatus) {
      this.currentSubscriptionHirarchy =
        this._subscriptionUtil.getCurrentPlanHirarchy();
    }
  }

  ngOnChanges(changes: any) {
    if (this.googlePhotoCredentials !== null) {
      this.updateGooglePhotoCredentials();
    }

    if (
      changes.category &&
      changes.category.currentValue === "background image"
    ) {
      this._dataService.getWidgetSettingsLayout().subscribe((data) => {
        this.widgetLayoutDetails = data;
        this.availableUnsplashList = data.unsplashCollections;
        if (
          data.unsplashCollectionKeyList != undefined ||
          data.unsplashCollectionKeyList != null
        ) {
          this.selectedUnsplashedCategory = data.unsplashCollectionKeyList;
        }
        // if (data.googleAlbumList != undefined || data.googleAlbumList != null) {
        //   this.googleAlbumList = data.googleAlbumList;
        // }

        if (
          data.backgroundImageDetails != undefined ||
          data.backgroundImageDetails != null
        ) {
          this.backgroundImageData = data.backgroundImageDetails;
          if (
            this.backgroundImageData != undefined &&
            this.backgroundImageData.googleAlbum != undefined
          ) {
            if (
              this.backgroundImageData.googleAlbumName != undefined &&
              this.backgroundImageData.googleAlbumName.trim() != ""
            ) {
              this.selectedAlbum["googleAlbumName"] =
                this.backgroundImageData.googleAlbumName;
              this.selectedAlbum["googlePhotoAlbumId"] =
                this.backgroundImageData.googlePhotoAlbumId;
            }

            if (this.backgroundImageData.isGoogleImage) {
              this.isGoogleAlbumAdded = true;
            } else {
              this.isGoogleAlbumAdded = false;
            }
          }
        }
        this.createBackgroundForm(this.backgroundImageData);
      });
    }
  }

  checkSubscription() {
    let subscriptionObject = this.storage.get("subscriptionObject");
    if (subscriptionObject === null) {
      this.router.navigateByUrl("plans-and-payments");
    } else {
      let expiryDate = new Date(subscriptionObject.expiryDate);
      let currentUtcDate = new Date();
      if (
        (subscriptionObject.subscriptionStatus != null &&
          subscriptionObject.subscriptionStatus == "canceled") ||
        currentUtcDate.getTime() > expiryDate.getTime()
      ) {
        this.router.navigateByUrl("plans-and-payments");
      }
    }
  }

  updateGooglePhotoCredentials() {
    let payload = {
      userMirrorModel: {
        id: this.googlePhotoCredentials.mirrorDetails.id,
        mirror: {
          id: this.googlePhotoCredentials.mirrorDetails.mirror.id,
        },
        userRole: this.googlePhotoCredentials.mirrorDetails.userRole,
      },
      type: "background",
      authorizationCode: this.googlePhotoCredentials.code,
    };
    this.loadingSpinner.show();
    this.widgetService.updateGooglePhotosCredentials(payload).subscribe(
      (res: any) => {
        let albums = res.object.albumList;
        let selectedAlbum = res.object.selectedAlbum;
        albums.forEach((element) => {
          let album = {
            googlePhotoesAlbumId: element.googlePhotoesAlbumId,
            googleAlbumName: element.googleAlbumName,
          };
          if (element.googleAlbumName === selectedAlbum) {
            this.selectedAlbum.googleAlbumName = res.object.selectedAlbum;
            this.selectedAlbum.googlePhotoAlbumId =
              res.object.googlePhotoesAlbumId;
          }
          this.googleAlbumList.push(album);
        });

        this.backgroundImageData = res.object.backgroundImageModel;
        this.isGoogleAlbumAdded = true;
        this.backgroundImageFormGroup.controls["googlePhotos"].setValue(true);
        // this.widgetLayoutDetails.googleAlbumList = this.googleAlbumList;
        this.widgetLayoutDetails.backgroundImageDetails =
          this.backgroundImageData;
        this.storage.remove("googlePhotosAuthCode");
        this.googlePhotoCredentials = null;
        this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);
        this.loadingSpinner.hide();
      },
      (err: any) => {
        this.storage.remove("googlePhotosAuthCode");
        this.googlePhotoCredentials = null;
        this.backgroundImageFormGroup.controls["googlePhotos"].setValue(false);
        if (err.error.message === "No album is avilable for this account") {
          this.toastr.error(err.error.message, "Error");
        } else {
          this.toastr.error(
            "Something went wrong while trying to add google photos account",
            "Error"
          );
        }
        this.loadingSpinner.hide();
      }
    );
  }

  getUnsplashCategory() {
    this.isUnsplshSelected = true;
  }

  updateUnsplashCategory(unsplash: any) {
    if (this.selectedUnsplashedCategory.includes(unsplash.displayName)) {
      this.selectedUnsplashedCategory.splice(
        this.selectedUnsplashedCategory.indexOf(unsplash.displayName),
        1
      );
      if (this.selectedUnsplashedCategory.length == 0) {
        this.backgroundImageFormGroup.controls["unSplash"].setValue(false);
        this.selectedUnsplashedCategory.push("Nature");
      }
    } else {
      this.selectedUnsplashedCategory.push(unsplash.displayName);
    }
  }

  checkCategoryExist(unsplash: any) {
    if (this.selectedUnsplashedCategory.includes(unsplash.displayName)) {
      return true;
    } else {
      return false;
    }
  }

  updateGoogleAlbum(album: any) {
    this.selectedAlbum["googleAlbumName"] = album.googleAlbumName;
    this.selectedAlbum["googlePhotoAlbumId"] = album.googlePhotoAlbumId;
  }

  addGooglePhotosAccount() {
    this.widgetService.addGooglePhotosAccount("background").subscribe(
      (res: any) => {
        window.location = res.url;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  get minutes() {
    return this.backgroundImageFormGroup.get("minutes").value;
  }

  get seconds() {
    return this.backgroundImageFormGroup.get("seconds").value;
  }

  validateTimerValue() {
    if (
      !new RegExp("^[0-9]*$").test(this.minutes) ||
      !new RegExp("^[0-9]*$").test(this.seconds)
    ) {
      if (!new RegExp("^[0-9]*$").test(this.minutes)) {
        this.backgroundImageFormGroup.controls.minutes.setValue(0);
      }

      if (!new RegExp("^[0-9]*$").test(this.seconds)) {
        this.backgroundImageFormGroup.controls.seconds.setValue(0);
      }
    }

    if (this.minutes <= 0 && this.seconds <= 0) {
      this.backgroundImageFormGroup.controls.minutes.setValue(0);
      this.backgroundImageFormGroup.controls.seconds.setValue(30);
    } else {
      if (this.minutes > 900) {
        this.backgroundImageFormGroup.controls.minutes.setValue(900);
      }

      if (this.seconds > 59) {
        this.backgroundImageFormGroup.controls.seconds.setValue(59);
      }

      if (this.seconds <= 10 && this.minutes <= 0) {
        this.backgroundImageFormGroup.controls.seconds.setValue(10);
      }

      if (this.minutes <= 0) {
        this.backgroundImageFormGroup.controls.minutes.setValue(0);
      }
    }
  }

  createBackgroundForm(backgroundImageData) {
    if (
      backgroundImageData == undefined ||
      backgroundImageData.isS3Enabled == undefined ||
      backgroundImageData.isS3Enabled == null
    ) {
      this.selectedS3Files = [];
    }

    if (
      backgroundImageData != undefined &&
      backgroundImageData.imageDelayTime != null
    ) {
      this.minute = Math.floor(backgroundImageData.imageDelayTime / 60);
      this.second = backgroundImageData.imageDelayTime - this.minute * 60;
    } else {
      this.minute = this.defaultMinutes;
      this.second = this.defaultSeconds;
    }

    this.backgroundImageFormGroup = this.formBuilder.group({
      mangoBackground: [
        backgroundImageData
          ? backgroundImageData.isDefaultUnsplashImage
          : false,
        Validators.requiredTrue,
      ],
      unSplash: [
        backgroundImageData ? backgroundImageData.isUnsplashImage : false,
        Validators.requiredTrue,
      ],
      googlePhotos: [
        backgroundImageData ? backgroundImageData.isGoogleImage : false,
        Validators.requiredTrue,
      ],
      applePhotos: [
        backgroundImageData ? backgroundImageData.isAppleImage : false,
        Validators.requiredTrue,
      ],
      isS3Enabled: [
        backgroundImageData && backgroundImageData.isS3Enabled != undefined
          ? backgroundImageData.isS3Enabled
          : false,
        Validators.requiredTrue,
      ],
      appleAccessToken: [
        backgroundImageData ? backgroundImageData.appleAccessToken : null,
        Validators.requiredTrue,
      ],
      isImageUrlEnable: [
        backgroundImageData ? backgroundImageData.isImageUrlEnable : false,
        Validators.requiredTrue,
      ],
      imageUrlLink: [
        backgroundImageData ? backgroundImageData.imageUrlLink : null,
      ],
      crop: [
        backgroundImageData ? backgroundImageData.isCropToFill : true,
        Validators.requiredTrue,
      ],
      transition: [
        backgroundImageData ? backgroundImageData.transition : "fade",
        Validators.required,
      ],
      brightness: [
        backgroundImageData ? backgroundImageData.imageBrightness : 1,
        Validators.requiredTrue,
      ],

      minutes: [
        this.minute,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(900),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      seconds: [
        this.second,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
    });

    if (
      backgroundImageData != undefined &&
      backgroundImageData.transition != null
    ) {
      this.selectedTransition = backgroundImageData.transition;
    }

    if (
      backgroundImageData != undefined &&
      backgroundImageData.imageUrlLink != null
    ) {
      this.imageUrlLink = backgroundImageData.imageUrlLink;
    }

    if (
      backgroundImageData != undefined &&
      backgroundImageData.imageDelayTime != null
    ) {
      this.photoChangeDuration = backgroundImageData.imageDelayTime / 60;
    }
    if (
      backgroundImageData != undefined &&
      backgroundImageData.appleAccessToken != null &&
      backgroundImageData.appleAccessToken != undefined
    ) {
      this.appleAccessToken = backgroundImageData.appleAccessToken;
    }

    const isSelected = this.backgroundImageFormGroup.controls.applePhotos.value;
    if (isSelected) {
      this.isApplePhotoSelected = true;
    } else {
      this.isApplePhotoSelected = false;
    }

    const isSPSelected =
      this.backgroundImageFormGroup.controls.isImageUrlEnable.value;
    this.validateImageExistance();
    if (isSPSelected) {
      this.isSinglePhotoSelected = true;
    } else {
      this.isSinglePhotoSelected = false;
    }

    if (this.backgroundImageFormGroup.controls.isS3Enabled.value) {
      if (backgroundImageData.s3Data.length > 3) {
        this.selectedS3Files = JSON.parse(backgroundImageData.s3Data);
      } else {
        this.selectedS3Files = [];
      }
    }
  }

  setPhotoDuration(count: any) {
    this.photoChangeDuration = count;
  }

  onApplePhotosSelect() {
    const isSelected = this.backgroundImageFormGroup.controls.applePhotos.value;
    this.backgroundImageFormGroup.controls["applePhotos"].setValue(!isSelected);
    this.isApplePhotoSelected = !isSelected;
  }

  onSinglePhotoSelect() {
    const isSinglePhotoSelected =
      this.backgroundImageFormGroup.controls.isImageUrlEnable.value;
    this.backgroundImageFormGroup.controls["isImageUrlEnable"].setValue(
      !isSinglePhotoSelected
    );
    this.isSinglePhotoSelected = !isSinglePhotoSelected;
    if (this.backgroundImageFormGroup.controls.isImageUrlEnable.value == true) {
      this.validateImageExistance();
    }
  }

  onbgsettingBackgroundImageOptions(event) {
    this.bgsettingBackgroundImageOptions = event;
  }

  validateAppleImage() {
    setTimeout(() => {
      let requestFormData = this.backgroundImageFormGroup.value;
      if (requestFormData.applePhotos == true) {
        let payload = requestFormData.appleAccessToken;
        this._imageWidgetService.validateAppleImageUrl(payload).subscribe(
          (res: any) => {
            if (
              res != null &&
              res.object != undefined &&
              res.object.applePhotoUrlObject != null
            ) {
              this.isAppleUrlInvalid = false;
            } else {
              this.isAppleUrlInvalid = true;
            }
          },
          (err: any) => {
            this.isAppleUrlInvalid = true;
          }
        );
      }
    }, 100);
  }

  saveBackgroundImage() {
    let requestFormData = this.backgroundImageFormGroup.value;
    let userMirrorDetails = this.storage.get("activeMirrorDetails");
    let payloadData = {
      calendarFlag: false,
      userMirrorModel: {
        mirror: {
          id: userMirrorDetails.mirror.id,
        },
        userRole: userMirrorDetails.userRole,
      },
    };

    if (
      this.backgroundImageData == undefined ||
      this.backgroundImageData.googleAlbum == undefined
    ) {
      requestFormData.googlePhotos = false;
      this.isGoogleAlbumAdded = false;
    }

    let backgroundData = {};

    if (requestFormData.googlePhotos == true) {
      backgroundData["isGoogleImage"] = true;
      backgroundData["googlePhotoAlbumId"] =
        this.selectedAlbum.googlePhotoAlbumId;
      backgroundData["googleAlbumName"] = this.selectedAlbum.googleAlbumName;
    } else {
      backgroundData["isGoogleImage"] = false;
    }

    if (requestFormData.unSplash == true) {
      backgroundData["isUnsplashImage"] = true;
      backgroundData["unsplashCollectionKeyList"] =
        this.selectedUnsplashedCategory;
    } else {
      backgroundData["isUnsplashImage"] = false;
    }

    if (requestFormData.mangoBackground == true) {
      backgroundData["isDefaultUnsplashImage"] = true;
    } else {
      backgroundData["isDefaultUnsplashImage"] = false;
    }

    if (requestFormData.crop == true) {
      backgroundData["isCropToFill"] = true;
    } else {
      backgroundData["isCropToFill"] = false;
    }

    if (requestFormData.transition != null && requestFormData.transition) {
      backgroundData["transition"] = requestFormData.transition;
    } else {
      backgroundData["transition"] = "fade";
    }

    if (
      requestFormData.isS3Enabled == true &&
      this.selectedS3Files.length > 0
    ) {
      backgroundData["isS3Enabled"] = true;
      backgroundData["s3Data"] = JSON.stringify(this.selectedS3Files);
    } else {
      backgroundData["isS3Enabled"] = false;
      this.selectedS3Files = [];
      backgroundData["s3Data"] = JSON.stringify(this.selectedS3Files);
    }

    backgroundData["imageDelayTime"] =
      Number(this.minutes) * 60 + Number(this.seconds);

    if (
      requestFormData.brightness != null &&
      requestFormData.brightness != undefined
    ) {
      backgroundData["imageBrightness"] = requestFormData.brightness;
    } else {
      backgroundData["imageBrightness"] = 1;
    }

    if (requestFormData.isImageUrlEnable == true) {
      if (
        requestFormData.imageUrlLink == null ||
        requestFormData.imageUrlLink == undefined ||
        requestFormData.imageUrlLink.trim() == "" ||
        this.ispublicUrlImageExist == false
      ) {
        backgroundData["imageUrlLink"] = "";
        backgroundData["isImageUrlEnable"] = false;
        requestFormData.imageUrlLink = null;
      } else {
        backgroundData["imageUrlLink"] = requestFormData.imageUrlLink;
        backgroundData["isImageUrlEnable"] = true;
      }
    } else {
      backgroundData["isImageUrlEnable"] = false;
      backgroundData["imageUrlLink"] = requestFormData.imageUrlLink;
    }

    backgroundData["isMultipleImages"] = true;

    //validate apple url

    if (requestFormData.applePhotos == true) {
      backgroundData["isAppleImage"] = true;
      if (
        requestFormData.appleAccessToken == null ||
        requestFormData.appleAccessToken == undefined ||
        this.validator.isEmptyField(requestFormData.appleAccessToken)
      ) {
        alert("Please add iCloud shared album URL or disable Apple Photos");
        return;
      }
      backgroundData["appleAccessToken"] = requestFormData.appleAccessToken;
    } else {
      backgroundData["isAppleImage"] = false;
    }

    if (this.isAppleUrlInvalid == true) {
      requestFormData.applePhotos = false;
      backgroundData["isAppleImage"] = false;
      backgroundData["appleAccessToken"] = null;
    }

    if (
      requestFormData.applePhotos == true ||
      requestFormData.googlePhotos == true ||
      requestFormData.unSplash == true ||
      requestFormData.mangoBackground == true ||
      requestFormData.isImageUrlEnable == true ||
      requestFormData.isS3Enabled == true
    ) {
      payloadData.userMirrorModel["backgroundImageStatus"] = true;
    } else {
      payloadData.userMirrorModel["backgroundImageStatus"] = false;
    }

    payloadData.userMirrorModel["backgroundImage"] = backgroundData;
    this.updateBackgroundImageEventEmiter.emit({
      backgroundImageData: payloadData,
    });
    this.isAppleUrlInvalid = false;
    this.backgroundImageModal.hide();
  }

  customFindIndex(widgetsArray: any, contentId: any) {
    for (let i = 0; i < widgetsArray.length; i++) {
      let widgetIndex = widgetsArray[i].widgets.findIndex(
        (element) => element.contentId === contentId
      );
      if (widgetIndex !== -1) {
        return { pageIndex: i, widgetIndex: widgetIndex };
      }
    }
  }

  dismissModel() {
    this.backgroundImageModal.hide();
  }

  removeAccount(backgroundImageData) {
    this.loadingSpinner.show();
    this.widgetService
      .removeGoogleBackgroundAccount(backgroundImageData.id, "backgroundImage")
      .subscribe(
        (res: any) => {
          this.loadingSpinner.hide();
          this.isGoogleAlbumAdded = false;
          this.widgetLayoutDetails.backgroundImageDetails = res.object;
          this.backgroundImageFormGroup.controls["googlePhotos"].setValue(
            false
          );
          this.googleAlbumList = [];
          this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);
          this.storage.set("activeWidgetDetails", this.widgetLayoutDetails);
          // this.createBackgroundForm(backgroundImageData);
        },
        (err: any) => {
          this.loadingSpinner.hide();
          this.toastr.error(err.error.message, "Error");
        }
      );
  }

  toggleGoogleAlbum(albumData) {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed == true) {
      this.getUpdatedGoogleAlbum(albumData);
    }
  }

  getUpdatedGoogleAlbum(albumData) {
    this.loadingSpinner.show();
    this._imageWidgetService.getLatestAlbumList(albumData).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.googleAlbumList = res.object;
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  validateImageExistance() {
    let requestFormData = this.backgroundImageFormGroup.value;
    if (
      requestFormData.imageUrlLink == null ||
      requestFormData.imageUrlLink.trim() == "" ||
      requestFormData.imageUrlLink.toString().endsWith(".pdf")
    ) {
      this.imageUrlLink = requestFormData.imageUrlLink;
      this.ispublicUrlImageExist = false;
      return;
    }
    if (requestFormData.imageUrlLink.includes("dropbox")) {
      requestFormData.imageUrlLink = requestFormData.imageUrlLink.replace(
        "dl=0",
        "raw=1"
      );

      requestFormData.imageUrlLink = requestFormData.imageUrlLink.replace(
        "www.dropbox.com",
        "dl.dropboxusercontent.com"
      );
    } else if (
      requestFormData.imageUrlLink.includes("drive.google") &&
      !requestFormData.imageUrlLink.includes(
        "https://lh3.googleusercontent.com/d/"
      )
    ) {
      let tempUrl = requestFormData.imageUrlLink.replace(
        "https://drive.google.com/file/d/",
        "id="
      );
      requestFormData.imageUrlLink = requestFormData.imageUrlLink.replace(
        "https://drive.google.com/file/d/",
        "https://lh3.googleusercontent.com/d/"
      );
      let code = tempUrl.substring(tempUrl.indexOf("=") + 1);
      code = code.substring(0, code.indexOf("/"));
      requestFormData.imageUrlLink =
        "https://lh3.googleusercontent.com/d/" + code;
    }
    this.backgroundImageFormGroup.controls["imageUrlLink"].setValue(
      requestFormData.imageUrlLink.trim()
    );
    this.imageUrlLink = requestFormData.imageUrlLink;
    this.ispublicUrlImageExist = true;
  }

  invalidImage() {
    if (this.imageUrlLink != null) {
      this.ispublicUrlImageExist = false;
    }
  }

  ngAfterViewInit() {
    this.ispublicUrlImageExist = true;
    this.imageUrlLink = this.imageUrlLink;
  }

  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    this.dragDropInfo = { dragIndex, dropIndex };

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector(".cdk-drag-placeholder");

    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement.insertBefore(phElement, phContainer);

      moveItemInArray(this.selectedS3Files, dragIndex, dropIndex);
    }
    for (let index = 0; index < this.selectedS3Files.length; index++) {
      this.selectedS3Files[index].zindex = index + 1;
    }
    this.selectedS3Files = this._customSortPipe.transform(
      this.selectedS3Files,
      "asc",
      "zindex"
    );
  }

  dragMoved(event: CdkDragMove<number>) {
    if (!this.dropListContainer || !this.dragDropInfo) return;

    const placeholderElement =
      this.dropListContainer.nativeElement.querySelector(
        ".cdk-drag-placeholder"
      );

    const receiverElement =
      this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex
        ? placeholderElement.nextElementSibling
        : placeholderElement.previousElementSibling;

    if (!receiverElement) {
      return;
    }

    receiverElement.style.display = "none";
    this.dropListReceiverElement = receiverElement;
  }

  dragDropped(event: CdkDragDrop<number>) {
    if (!this.dropListReceiverElement) {
      return;
    }

    this.dropListReceiverElement.style.removeProperty("display");
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }

  updateS3Details($event) {
    this.isMyFileSelected = false;
    this.requestType == undefined;
    this.selectedS3Files = $event.selectedS3Files;

    this.selectedS3Files = this._customSortPipe.transform(
      this.selectedS3Files,
      "asc",
      "zindex"
    );
  }

  openMyMediaFile(action) {
    if (action == "edit") {
      this.isMyFileSelected = true;
    } else {
      const isSelected =
        this.backgroundImageFormGroup.controls.isS3Enabled.value;
      if (isSelected == false) {
        this.isMyFileSelected = true;
        const isSelected =
          this.backgroundImageFormGroup.controls.isS3Enabled.value;
        this.backgroundImageFormGroup.controls["isS3Enabled"].setValue(
          !isSelected
        );
      } else {
        this.isMyFileSelected = false;
      }
    }
  }

  reverseSelection() {
    this.isMyFileSelected = false;
  }

  upgradeSubscription() {
    if (this.currentSubscriptionHirarchy < 2) {
      this._subscriptionUtil.upgradeSubscriptionPage();
    }
  }
}
