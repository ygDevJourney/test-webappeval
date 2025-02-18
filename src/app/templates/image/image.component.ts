import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragMove,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { CustomSortPipe } from "src/app/pipes/custom-sort.pipe";
import { CommonFunction } from "src/app/service/common-function.service";
import { DataService } from "src/app/service/data.service";
import { ImageWidgetService } from "src/app/service/image-widget.service";
import { WidgetService } from "src/app/service/widget.service";
import {
  available_image_transition,
  available_transition,
} from "src/app/util/static-data";
import { SubscriptionUtil } from "src/app/util/subscriptionUtil";
import { Validator } from "src/app/util/validator";

// const s3basepath = "https://user-drive-bucket.s3.amazonaws.com/";
const s3basepath = "https://myfiles.mangodisplay.com/";

@Component({
  selector: "app-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.scss"],
})
export class ImageComponent implements OnInit, OnChanges {
  @Input() imageSettingModal: any;
  @Input() category: string;
  @Input() activeLayout: any;
  @Input() imageWidgetObject: any;
  @Input() imageWidgetGooglePhotoCredentials: any;

  @ViewChild("dropListContainer", { static: true })
  dropListContainer?: ElementRef;

  dropListReceiverElement: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };
  isCollapsed: boolean = false;

  //background widget setting
  availableTransition = [...available_image_transition];
  selectedTransition: string = "fade";
  widgetType: any;
  widgetBgSetting: any;
  newBgSetting: any;
  activeMirrorDetail: any;
  widgetData = null;
  widgetSettingDetails: any;
  imageWidget: any;
  settingDisplayflag: boolean = false;
  requestType: string = "imageRequestType";

  imageFormGroup: FormGroup;
  photoChangeDuration: any = 1;
  appleAccessToken: string;
  countList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  backgroundCategoryList: any;
  selectedUnsplashedCategory = ["Nature"];
  isUnsplshSelected = false;
  isApplePhotoSelected: any = false;
  isSinglePhotoSelected: any = false;
  ismangoBackgroundSelected: any = false;
  isGoogleAlbumAdded: boolean = false;
  imageUrlLink: any;

  backgroundCategoryData: any;
  availableUnsplashList = [];
  googleAlbumList = [];
  imageWidgetData: any;
  myrange: number = 1.1;
  selectedAlbum = {
    googleAlbumName: "",
    googlePhotoAlbumId: "",
  };
  widgetLayoutDetails: any;
  subscriptionAvailable: false;
  bgsettingBackgroundImageOptions: any;
  ispublicUrlImageExist = false;
  isAppleUrlInvalid: boolean = false;
  isMyFileSelected = false;
  selectedS3Files: any[] = [];
  currentSubscriptionHirarchy: number = 0;

  defaultMinutes = 0;
  defaultSeconds = 30;

  minute = 0;
  second = 30;

  constructor(
    private formBuilder: FormBuilder,
    private widgetService: WidgetService,
    private storage: LocalStorageService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private validator: Validator,
    private _dataService: DataService,
    private commonFunction: CommonFunction,
    private _imageWidgetService: ImageWidgetService,
    private _customSortPipe: CustomSortPipe,
    private _subscriptionUtil: SubscriptionUtil
  ) {}

  ngOnInit() {
    this.createBackgroundForm(this.imageWidgetData);
    let subscription = this.storage.get("subscriptionDetails");
    let subscriptionObject = this.storage.get("subscriptionObject");
    if (
      subscription != null &&
      subscription.isSubscriptionAvailable &&
      subscriptionObject != null &&
      !subscriptionObject.productId.includes("plus")
    ) {
      this.subscriptionAvailable = subscription.isSubscriptionAvailable;
    }

    if (this._subscriptionUtil.getCurrentSubscriptionStatus) {
      this.currentSubscriptionHirarchy =
        this._subscriptionUtil.getCurrentPlanHirarchy();
    }
  }

  ngAfterViewInit() {
    this.ispublicUrlImageExist = true;
    this.imageUrlLink = this.imageUrlLink;
  }

  ngOnChanges(changes: any) {
    if (
      this.imageWidgetGooglePhotoCredentials !== null &&
      this.imageWidgetGooglePhotoCredentials !== undefined
    ) {
      this.updateGooglePhotoCredentials();
    }

    if (
      changes.imageWidgetObject != null &&
      changes.imageWidgetObject.currentValue != undefined
    ) {
      if (
        changes.imageWidgetObject.currentValue != undefined &&
        changes.imageWidgetObject.currentValue != null
      ) {
        this._dataService.getWidgetSettingsLayout().subscribe((data) => {
          this.widgetLayoutDetails = data;
          this.widgetSettingDetails = data.widgetSetting;
          this.availableUnsplashList = data.unsplashCollections;
          this.widgetBgSetting =
            changes.imageWidgetObject.currentValue.widgetBackgroundSettingModel;
          this.imageWidgetObject = changes.imageWidgetObject.currentValue;
        });

        this.initializeImageData(this.imageWidgetObject);
      }
    }
  }

  initializeImageData(imageWidget) {
    this.isGoogleAlbumAdded = false;
    this.imageUrlLink = null;
    this.imageWidget = imageWidget;
    let data = imageWidget.data;
    this.availableUnsplashList = data.unsplashCollections;
    if (
      data.unsplashCollectionKeyList != undefined ||
      data.unsplashCollectionKeyList != null
    ) {
      this.selectedUnsplashedCategory = data.unsplashCollectionKeyList;
    }
    // if (data.albums != undefined || data.albums != null) {
    //   this.googleAlbumList = data.albums;
    // }

    if (data.imageWidgetDetail != undefined || data.imageWidgetDetail != null) {
      this.imageWidgetData = data.imageWidgetDetail;
      if (
        this.imageWidgetData != undefined &&
        this.imageWidgetData.googleAlbum != undefined
      ) {
        if (
          this.imageWidgetData.googleAlbumName != undefined &&
          this.imageWidgetData.googleAlbumName.trim() != ""
        ) {
          this.selectedAlbum["googleAlbumName"] =
            this.imageWidgetData.googleAlbumName;
          this.selectedAlbum["googlePhotoAlbumId"] =
            this.imageWidgetData.googlePhotoAlbumId;
        }
        if (this.imageWidgetData.isGoogleImage) {
          this.isGoogleAlbumAdded = true;
        } else {
          this.isGoogleAlbumAdded = false;
        }
      }
    }
    this.createBackgroundForm(this.imageWidgetData);
  }

  checkCategoryExist(unsplash: any) {
    if (this.selectedUnsplashedCategory.includes(unsplash.displayName)) {
      return true;
    } else {
      return false;
    }
  }

  get minutes() {
    return this.imageFormGroup.get("minutes").value;
  }

  get seconds() {
    return this.imageFormGroup.get("seconds").value;
  }

  validateTimerValue() {
    if (
      !new RegExp("^[0-9]*$").test(this.minutes) ||
      !new RegExp("^[0-9]*$").test(this.seconds)
    ) {
      if (!new RegExp("^[0-9]*$").test(this.minutes)) {
        this.imageFormGroup.controls.minutes.setValue(0);
      }

      if (!new RegExp("^[0-9]*$").test(this.seconds)) {
        this.imageFormGroup.controls.seconds.setValue(0);
      }
    }

    if (this.minutes <= 0 && this.seconds <= 0) {
      this.imageFormGroup.controls.minutes.setValue(0);
      this.imageFormGroup.controls.seconds.setValue(30);
    } else {
      if (this.minutes > 900) {
        this.imageFormGroup.controls.minutes.setValue(900);
      }

      if (this.seconds > 59) {
        this.imageFormGroup.controls.seconds.setValue(59);
      }

      if (this.seconds <= 10 && this.minutes <= 0) {
        this.imageFormGroup.controls.seconds.setValue(10);
      }

      if (this.minutes <= 0) {
        this.imageFormGroup.controls.minutes.setValue(0);
      }
    }
  }

  createBackgroundForm(imageData) {
    if (
      imageData == undefined ||
      imageData.isS3Enabled == undefined ||
      imageData.isS3Enabled == null
    ) {
      this.selectedS3Files = [];
    }

    if (imageData != undefined && imageData.transition != null) {
      this.selectedTransition = imageData.transition;
    }

    if (imageData != undefined && imageData.imageDelayTime != null) {
      this.minute = Math.floor(imageData.imageDelayTime / 60);
      this.second = imageData.imageDelayTime - this.minute * 60;
    } else {
      this.minute = this.defaultMinutes;
      this.second = this.defaultSeconds;
    }

    this.imageFormGroup = this.formBuilder.group({
      mangoBackground: [
        imageData ? imageData.isDefaultUnsplashImage : false,
        Validators.requiredTrue,
      ],
      unSplash: [
        imageData ? imageData.isUnsplashImage : false,
        Validators.requiredTrue,
      ],
      googlePhotos: [
        imageData ? imageData.isGoogleImage : false,
        Validators.requiredTrue,
      ],
      applePhotos: [
        imageData ? imageData.isAppleImage : false,
        Validators.requiredTrue,
      ],
      isS3Enabled: [
        imageData && imageData.isS3Enabled != undefined
          ? imageData.isS3Enabled
          : false,
        Validators.requiredTrue,
      ],
      appleAccessToken: [
        imageData ? imageData.appleAccessToken : null,
        Validators.requiredTrue,
      ],
      isImageUrlEnable: [
        imageData ? imageData.isImageUrlEnable : false,
        Validators.requiredTrue,
      ],
      imageUrlLink: [imageData ? imageData.imageUrlLink : null],
      crop: [
        imageData ? imageData.isCropToFill : true,
        Validators.requiredTrue,
      ],
      brightness: [
        imageData ? imageData.imageBrightness : 1,
        Validators.requiredTrue,
      ],

      transition: [
        imageData ? imageData.transition : "fade",
        Validators.requiredTrue,
      ],

      changePhotoDuration: [
        imageData ? imageData.imageDelayTime : 1,
        Validators.required,
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

    if (imageData != undefined && imageData.imageUrlLink != null) {
      this.imageUrlLink = imageData.imageUrlLink;
    }

    if (imageData != undefined && imageData.imageDelayTime != null) {
      this.photoChangeDuration = imageData.imageDelayTime / 60;
    }
    if (
      imageData != undefined &&
      imageData.appleAccessToken != null &&
      imageData.appleAccessToken != undefined
    ) {
      this.appleAccessToken = imageData.appleAccessToken;
    }

    const isSelected = this.imageFormGroup.controls.applePhotos.value;
    if (isSelected) {
      this.isApplePhotoSelected = true;
    } else {
      this.isApplePhotoSelected = false;
    }

    const isSPSelected = this.imageFormGroup.controls.isImageUrlEnable.value;
    if (isSPSelected) {
      this.isSinglePhotoSelected = true;
      this.validateImageExistance();
    } else {
      this.isSinglePhotoSelected = false;
    }

    if (this.imageFormGroup.controls.isS3Enabled.value) {
      if (imageData.s3Data.length > 3) {
        this.selectedS3Files = JSON.parse(imageData.s3Data);
      } else {
        this.selectedS3Files = [];
      }
    }
  }

  validateImageExistance() {
    let requestFormData = this.imageFormGroup.value;
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
    this.imageFormGroup.controls["imageUrlLink"].setValue(
      requestFormData.imageUrlLink.trim()
    );
    this.imageUrlLink = requestFormData.imageUrlLink.trim();
    this.ispublicUrlImageExist = true;
  }

  invalidImage() {
    this.ispublicUrlImageExist = false;
  }

  setPhotoDuration(count: any) {
    this.photoChangeDuration = count;
  }

  setBackgroundWidgetDetail() {
    this.widgetType = this.category;
    let widgetData = this.storage.get("selectedwidget");
    if (widgetData != null) {
      this.widgetBgSetting = widgetData.widgetBackgroundSettingModel;
    }
    this.activeMirrorDetail = this.storage.get("activeMirrorDetails");
  }

  onApplePhotosSelect() {
    const isSelected = this.imageFormGroup.controls.applePhotos.value;
    this.imageFormGroup.controls["applePhotos"].setValue(!isSelected);
    this.isApplePhotoSelected = !isSelected;
  }

  openMyMediaFile(action) {
    if (action == "edit") {
      this.isMyFileSelected = true;
    } else {
      const isSelected = this.imageFormGroup.controls.isS3Enabled.value;
      if (isSelected == false) {
        this.isMyFileSelected = true;
        const isSelected = this.imageFormGroup.controls.isS3Enabled.value;
        this.imageFormGroup.controls["isS3Enabled"].setValue(!isSelected);
      } else {
        this.isMyFileSelected = false;
      }
    }
    // const isSelected = this.imageFormGroup.controls.isS3Enabled.value;
    // this.isMyFileSelected = true;
    // if (isSelected == false || isSelected == undefined) {
    //   this.imageFormGroup.controls["isS3Enabled"].setValue(!isSelected);
    // }
  }

  onSinglePhotoSelect() {
    let isSinglePhotoSelected =
      this.imageFormGroup.controls.isImageUrlEnable.value;
    this.imageFormGroup.controls["isImageUrlEnable"].setValue(
      !isSinglePhotoSelected
    );
    this.isSinglePhotoSelected = !isSinglePhotoSelected;
    if (this.imageFormGroup.controls.isImageUrlEnable.value == true) {
      this.validateImageExistance();
    }
  }

  updateGooglePhotoCredentials() {
    let payload = {
      userMirrorModel: {
        id: this.imageWidgetGooglePhotoCredentials.mirrorDetails.id,
        mirror: {
          id: this.imageWidgetGooglePhotoCredentials.mirrorDetails.mirror.id,
        },
        userRole: this.imageWidgetGooglePhotoCredentials.mirrorDetails.userRole,
      },
      widgetSettingId: this.imageWidgetObject.widgetSettingId,
      type: "image",
      authorizationCode: this.imageWidgetGooglePhotoCredentials.code,
    };
    this.loadingSpinner.show();
    this.widgetService.updateGooglePhotosCredentials(payload).subscribe(
      (res: any) => {
        let albums = res.object.albumList;
        let selectedAlbum = res.object.selectedAlbum;
        this.isGoogleAlbumAdded = true;
        this.imageWidgetGooglePhotoCredentials = null;
        this.googleAlbumList = [];

        albums.forEach((element) => {
          let album = {
            googlePhotoAlbumId: element.googlePhotoAlbumId,
            googleAlbumName: element.googleAlbumName,
          };
          if (element.googleAlbumName === selectedAlbum) {
            this.selectedAlbum["googleAlbumName"] = element.googleAlbumName;
            this.selectedAlbum["googlePhotoAlbumId"] =
              element.googlePhotoAlbumId;
          }
          this.googleAlbumList.push(album);
        });
        this.imageFormGroup.controls["googlePhotos"].setValue(true);
        this.widgetSettingDetails.forEach((widgetPageData) => {
          widgetPageData.widgets.forEach((element) => {
            if (
              element.widgetSettingId === this.imageWidgetObject.widgetSettingId
            ) {
              element.data.albums = this.googleAlbumList;
              element.data.imageWidgetDetail =
                res.object.imageWidgetSettingModel;
              this.imageWidgetObject = element;
              this.storage.set("selectedwidget", element);
              this.initializeImageData(this.imageWidgetObject);
            }
          });
        });

        this.storage.remove("googlePhotosAuthCode");
        this.widgetLayoutDetails.widgetSetting = this.widgetSettingDetails;
        this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);

        this.loadingSpinner.hide();
      },
      (err: any) => {
        this.storage.remove("googlePhotosAuthCode");
        this.imageWidgetGooglePhotoCredentials = null;
        this.imageFormGroup.controls["googlePhotos"].setValue(false);
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
        this.imageFormGroup.controls["unSplash"].setValue(false);
        this.selectedUnsplashedCategory.push("Nature");
      }
    } else {
      this.selectedUnsplashedCategory.push(unsplash.displayName);
    }
  }

  updateGoogleAlbum(album: any) {
    this.selectedAlbum["googleAlbumName"] = album.googleAlbumName;
    this.selectedAlbum["googlePhotoAlbumId"] = album.googlePhotoAlbumId;
  }

  addGooglePhotosAccount() {
    this.widgetService.addGooglePhotosAccount("image").subscribe(
      (res: any) => {
        window.location = res.url;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  onbgsettingOptions(event) {
    this.newBgSetting = event;
    this.onAddBackgroundSetting();
  }

  onAddBackgroundSetting() {
    const imageBgPayload = {
      userMirrorId: this.activeMirrorDetail.id,
      mastercategory: [this.imageWidget.widgetMasterCategory],
      widgetBackgroundSettingModel: this.newBgSetting,
    };
    this.commonFunction.updateWidgetSettings(this.newBgSetting, imageBgPayload);
    this.imageSettingModal.hide();
  }

  validateAppleImage() {
    setTimeout(() => {
      let requestFormData = this.imageFormGroup.value;
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

  saveImageSetting() {
    this.imageFormGroup
      .get("changePhotoDuration")
      .setValue(this.photoChangeDuration);
    let requestFormData = this.imageFormGroup.value;

    let imageWidgetData = {};

    if (
      this.imageWidgetData == undefined ||
      this.imageWidgetData.googleAlbum == undefined
    ) {
      requestFormData.googlePhotos = false;
      this.isGoogleAlbumAdded = false;
    }

    if (this.imageWidgetData != null) {
      imageWidgetData["id"] = this.imageWidgetData.id;
    }

    if (requestFormData.googlePhotos == true) {
      imageWidgetData["isGoogleImage"] = true;
      imageWidgetData["googlePhotoAlbumId"] =
        this.selectedAlbum.googlePhotoAlbumId;
      imageWidgetData["googleAlbumName"] = this.selectedAlbum.googleAlbumName;
      imageWidgetData["googleAccessToken"] =
        this.imageWidgetData.googleAccessToken;
      imageWidgetData["googleRefreshToken"] =
        this.imageWidgetData.googleRefreshToken;
      imageWidgetData["googleAccountDetail"] =
        this.imageWidgetData.googleAccountDetail;
    } else {
      imageWidgetData["isGoogleImage"] = false;
    }

    if (requestFormData.unSplash == true) {
      imageWidgetData["isUnsplashImage"] = true;
      imageWidgetData["unsplashCollectionId"] =
        this.selectedUnsplashedCategory.toString();
    } else {
      imageWidgetData["isUnsplashImage"] = false;
    }

    if (
      requestFormData.isS3Enabled == true &&
      this.selectedS3Files.length > 0
    ) {
      imageWidgetData["isS3Enabled"] = true;
      imageWidgetData["s3Data"] = JSON.stringify(this.selectedS3Files);
    } else {
      imageWidgetData["isS3Enabled"] = false;
      this.selectedS3Files = [];
      imageWidgetData["s3Data"] = JSON.stringify(this.selectedS3Files);
    }

    if (requestFormData.mangoBackground == true) {
      imageWidgetData["isDefaultUnsplashImage"] = true;
    } else {
      imageWidgetData["isDefaultUnsplashImage"] = false;
    }

    if (requestFormData.crop == true) {
      imageWidgetData["isCropToFill"] = true;
    } else {
      imageWidgetData["isCropToFill"] = false;
    }

    if (requestFormData.transition != null && requestFormData.transition) {
      imageWidgetData["transition"] = requestFormData.transition;
    } else {
      imageWidgetData["transition"] = "fade";
    }

    imageWidgetData["imageDelayTime"] =
      Number(this.minutes) * 60 + Number(this.seconds);

    if (
      requestFormData.brightness != null &&
      requestFormData.brightness != undefined
    ) {
      imageWidgetData["imageBrightness"] = requestFormData.brightness;
    } else {
      imageWidgetData["imageBrightness"] = 1;
    }

    if (requestFormData.isImageUrlEnable == true) {
      if (
        requestFormData.imageUrlLink == null ||
        requestFormData.imageUrlLink == undefined ||
        requestFormData.imageUrlLink.trim() == "" ||
        this.ispublicUrlImageExist == false
      ) {
        imageWidgetData["imageUrlLink"] = "";
        imageWidgetData["isImageUrlEnable"] = false;
        requestFormData.imageUrlLink = null;
      } else {
        imageWidgetData["imageUrlLink"] = requestFormData.imageUrlLink;
        imageWidgetData["isImageUrlEnable"] = true;
      }
    } else {
      imageWidgetData["isImageUrlEnable"] = false;
    }

    //validate apple url
    if (requestFormData.applePhotos == true) {
      imageWidgetData["isAppleImage"] = true;
      if (
        requestFormData.appleAccessToken == null ||
        requestFormData.appleAccessToken == undefined ||
        this.validator.isEmptyField(requestFormData.appleAccessToken)
      ) {
        alert("Please add iCloud shared album URL or disable Apple Photos");
        return;
      }
      imageWidgetData["appleAccessToken"] = requestFormData.appleAccessToken;
    } else {
      imageWidgetData["isAppleImage"] = false;
    }

    if (this.isAppleUrlInvalid == true) {
      requestFormData.applePhotos = false;
      imageWidgetData["isAppleImage"] = false;
      imageWidgetData["appleAccessToken"] = null;
    }

    imageWidgetData["widgetSetting"] = {
      id: this.imageWidgetObject.widgetSettingId,
    };

    imageWidgetData["isMultipleImages"] = true;
    this.imageSettingModal.show();
    this._imageWidgetService
      .updateImageWidgetSettings(imageWidgetData)
      .subscribe(
        (widgetResponseData: any) => {
          this.isAppleUrlInvalid = false;
          this.imageSettingModal.hide();
          this.widgetSettingDetails.forEach((widgetPageData) => {
            widgetPageData.widgets.forEach((element) => {
              if (
                element.widgetSettingId === this.imageWidget.widgetSettingId
              ) {
                let data = element.data;
                data.imageWidgetDetail =
                  widgetResponseData.object.imageWidgetDetail;
                data.unsplashCollectionKeyList =
                  widgetResponseData.object.unsplashCollectionKeyList;
                element.data = data;
                this.imageWidgetObject = element;
                this.initializeImageData(this.imageWidgetObject);
              }
            });
          });
          this.widgetLayoutDetails.widgetSetting = this.widgetSettingDetails;
          this.storage.set("activeWidgetDetails", this.widgetLayoutDetails);
          this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);
        },
        (err: any) => {
          this.isAppleUrlInvalid = false;
          this.imageSettingModal.hide();
          this.toastr.error(err.error.message, "Error");
        }
      );
  }

  removeAccount(backgroundImageData) {
    this.loadingSpinner.show();
    this.widgetService
      .removeGoogleBackgroundAccount(backgroundImageData.id, "image")
      .subscribe(
        (res: any) => {
          this.loadingSpinner.hide();
          this.isGoogleAlbumAdded = false;
          this.googleAlbumList = [];
          this.selectedAlbum = {
            googleAlbumName: "",
            googlePhotoAlbumId: "",
          };
          this.widgetSettingDetails.forEach((widgetPageData) => {
            widgetPageData.widgets.forEach((element) => {
              if (
                element.widgetSettingId === this.imageWidget.widgetSettingId &&
                element.contentType === "image"
              ) {
                element.data.imageWidgetDetail = res.object;
                this.storage.set("selectedwidget", element);
                this.initializeImageData(element);
              }
            });
          });

          this.widgetLayoutDetails.widgetSetting = this.widgetSettingDetails;
          this.storage.set("activeWidgetDetails", this.widgetLayoutDetails);
          this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);
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
        let albums = res.object;
        this.googleAlbumList = albums;
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  dismissModel() {
    this.imageSettingModal.hide();
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
  reverseSelection() {
    this.isMyFileSelected = false;
  }
}
