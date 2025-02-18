import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { VanillaJSGrid } from "src/app/grid";
import { getGifOptions, GifData, GifOptions } from "src/app/model/gif-data";
import { DataService } from "src/app/service/data.service";
import { GifsStickersService } from "src/app/service/gifs-stickers.service";
import { ImageWidgetService } from "src/app/service/image-widget.service";

@Component({
  selector: "app-gif-stickers",
  templateUrl: "./gif-stickers.component.html",
  styleUrls: ["./gif-stickers.component.scss"],
})
export class GifStickersComponent implements OnInit {
  @Input() gifWidgetObject: any;
  @Input() gifSettingModal: any;
  @Input() activeLayout: any;

  public previewImage: any = null;
  gifsFormGroup: FormGroup;
  search: any = "";
  public obj: any;
  gifWidgetData: any;
  subscriptionAvailable: false;
  widgetLayoutDetails: any;
  widgetSettingDetails: any;
  isGif: boolean = false;
  isSticker: boolean = false;
  isDataLoaded: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private storage: LocalStorageService,
    private _dataService: DataService,
    private _imageWidgetService: ImageWidgetService
  ) {
    this.obj = new VanillaJSGrid();
  }

  ngOnInit() {
    this.createGifForm(this.gifWidgetData);
    let subscription = this.storage.get("subscriptionDetails");
    if (subscription != null) {
      this.subscriptionAvailable = subscription.isSubscriptionAvailable;
    }
    document.addEventListener("click", (event: any) => {
      if (event.target.className.includes("giphy-gif-img")) {
        let url = event.target.getAttribute("src");
        if (url != null) this.previewImage = url;
      }
    });
  }

  ngOnChanges(changes: any) {
    if (
      changes.gifWidgetObject != null &&
      changes.gifWidgetObject.currentValue != undefined
    ) {
      if (
        changes.gifWidgetObject.currentValue != undefined &&
        changes.gifWidgetObject.currentValue != null
      ) {
        this._dataService.getWidgetSettingsLayout().subscribe((data) => {
          this.widgetLayoutDetails = data;
          this.widgetSettingDetails = data.widgetSetting;
          this.gifWidgetObject = changes.gifWidgetObject.currentValue;
        });
        this.isDataLoaded = true;
        if (this.gifWidgetObject.data != undefined) {
          this.initializeGifData(this.gifWidgetObject.data.gifWidgetDetail);
        }
      }
    }
  }
  initializeGifData(gifWidgetData) {
    this.createGifForm(gifWidgetData);
  }
  createGifForm(gifWidgetData) {
    this.gifsFormGroup = this.formBuilder.group({
      crop: [
        gifWidgetData ? gifWidgetData.isCropToFill : false,
        Validators.requiredTrue,
      ],
      brightness: [
        gifWidgetData ? gifWidgetData.brightness : 1.0,
        Validators.requiredTrue,
      ],
    });

    if (
      gifWidgetData != null &&
      (gifWidgetData.isGif || gifWidgetData.isStickers)
    ) {
      if (this.isDataLoaded == false) {
        return;
      }
      this.previewImage = gifWidgetData.imageUrl;
      if (gifWidgetData.isGif) {
        this.isGif = true;
        setTimeout(() => {
          this.loadGifs();
        }, 200);
      }
      if (gifWidgetData.isStickers) {
        this.isSticker = true;
        setTimeout(() => {
          this.loadStickers();
        }, 200);
      }
    }

    if (this.isGif == false && this.isSticker == false) {
      if (this.isDataLoaded == false) {
        return;
      }
      this.isGif = true;
      setTimeout(() => {
        this.loadGifs();
      }, 200);
    }
  }

  dismissModel() {
    this.gifSettingModal.hide();
  }

  saveGIFSetting() {
    let gifWidgetData = {
      widgetSetting: {},
    };

    let requestFormData = this.gifsFormGroup.value;

    gifWidgetData["imageBrightness"] = requestFormData.brightness;
    gifWidgetData["isCropToFill"] = requestFormData.crop;
    gifWidgetData["isGif"] = false;
    gifWidgetData["imageUrl"] = "";
    gifWidgetData["isStickers"] = false;

    if (this.previewImage != "") {
      gifWidgetData["imageUrl"] = this.previewImage;
      if (this.isGif == true) {
        gifWidgetData["isGif"] = true;
      }
      if (this.isSticker == true) {
        gifWidgetData["isStickers"] = true;
      }
    } else {
      gifWidgetData["isGif"] = false;
      gifWidgetData["imageUrl"] = "";
      gifWidgetData["isStickers"] = false;
    }

    gifWidgetData["widgetSetting"] = {
      id: this.gifWidgetObject.widgetSettingId,
    };

    this._imageWidgetService
      .updateGifWidgetSettings(gifWidgetData)
      .subscribe((widgetResponseData: any) => {
        this.gifSettingModal.hide();
        this.widgetSettingDetails.forEach((widgetPageData) => {
          widgetPageData.widgets.forEach((element) => {
            if (
              element.widgetSettingId === this.gifWidgetObject.widgetSettingId
            ) {
              let data = element.data.gifWidgetDetail;
              data = widgetResponseData.object.gifWidgetDetail;
              element.data.gifWidgetDetail = data;
            }
          });
        });
        this.widgetLayoutDetails.widgetSetting = this.widgetSettingDetails;
        this.storage.set("activeWidgetDetails", this.widgetLayoutDetails);
        this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);
      });
    this.dismissModel();
  }

  ngAfterViewInit(): void {
    // this.loadGifs()
  }

  loadStickers() {
    this.isSticker = true;
    this.isGif = false;
    if (this.search != null && this.search.trim() != "") {
      this.searchBasedGifs();
    } else {
      this.refreshElement();
      const gridTarget = document.getElementById("gif");
      var width = document.getElementById("gif_sticker");
      this.obj.stickers(gridTarget, width.clientWidth);
    }
  }

  loadGifs() {
    this.isSticker = false;
    this.isGif = true;
    if (this.search != null && this.search.trim() != "") {
      this.searchBasedGifs();
    } else {
      this.refreshElement();
      var width = document.getElementById("gif_sticker");
      const gridTarget = document.getElementById("gif");
      this.obj.trending(gridTarget, width.clientWidth);
    }
  }
  refreshElement() {
    const element = document.getElementById("gif");
    element.remove();
    const node = document.createElement("div");
    node.id = "gif";
    const parent = document.getElementById("gif-parent");
    parent.appendChild(node);
  }

  searchBasedGifs() {
    if (this.search != null && this.search.trim() != "") {
      this.refreshElement();
      const gridTarget = document.getElementById("gif");
      var search = this.search;
      var type = this.isGif ? "gifs" : "stickers";
      var width = document.getElementById("gif_sticker");
      this.obj = new VanillaJSGrid();
      this.obj.searching(gridTarget, search, type, width.clientWidth);
    }
  }

  // Tenore api changes
  // @Input() gifWidgetObject: any;
  // @Input() gifSettingModal: any;
  // @Input() activeLayout: any;
  // public previewImage: any = null;
  // gifsFormGroup: FormGroup;
  // search: any = "";
  // public obj: any;
  // gifWidgetData: any;
  // subscriptionAvailable: false;
  // widgetLayoutDetails: any;
  // widgetSettingDetails: any;
  // isGif: boolean = false;
  // isSticker: boolean = false;
  // isDataLoaded: boolean = false;
  // gifData: GifData[] = [];
  // selectedGif: GifData;
  // nextPage: string;
  // gifoption: GifOptions;
  // constructor(
  //   private formBuilder: FormBuilder,
  //   private storage: LocalStorageService,
  //   private _dataService: DataService,
  //   private _imageWidgetService: ImageWidgetService,
  //   private _gifService: GifsStickersService,
  //   private _imageService: ImageWidgetService,
  //   private toastr: ToastrService,
  //   private loadingSpinner: Ng4LoadingSpinnerService
  // ) {}
  // resizeAllGridItems() {
  //   const allItems = document.querySelectorAll(".grid-item");
  //   allItems.forEach((item) =>
  //     this.resizeGridItem({ target: item.querySelector("img") })
  //   );
  // }
  // resizeGridItem(event) {
  //   const item = event.target.parentElement;
  //   const grid = document.querySelector(".grid-container");
  //   const rowHeight = parseInt(
  //     window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
  //   );
  //   const rowGap = parseInt(
  //     window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
  //   );
  //   const rowSpan = Math.ceil(
  //     (item.querySelector("img").getBoundingClientRect().height + rowGap + 17) /
  //       (rowHeight + rowGap)
  //   );
  //   item.style.gridRowEnd = `span ${rowSpan}`;
  // }
  // ngOnInit() {
  //   this.createGifForm(this.gifWidgetData);
  //   let subscription = this.storage.get("subscriptionDetails");
  //   if (subscription != null) {
  //     this.subscriptionAvailable = subscription.isSubscriptionAvailable;
  //   }
  // }
  // onScroll(event: any): void {
  //   const element = event.target;
  //   if (element.scrollHeight - element.scrollTop - element.clientHeight < 10) {
  //     this.loadMoreItems();
  //   }
  // }
  // ngOnChanges(changes: any) {
  //   if (
  //     changes.gifWidgetObject != null &&
  //     changes.gifWidgetObject.currentValue != undefined
  //   ) {
  //     if (
  //       changes.gifWidgetObject.currentValue != undefined &&
  //       changes.gifWidgetObject.currentValue != null
  //     ) {
  //       this._dataService.getWidgetSettingsLayout().subscribe((data) => {
  //         this.widgetLayoutDetails = data;
  //         this.widgetSettingDetails = data.widgetSetting;
  //         this.gifWidgetObject = changes.gifWidgetObject.currentValue;
  //       });
  //       this.isDataLoaded = true;
  //       if (this.gifWidgetObject.data != undefined) {
  //         this.initializeGifData(this.gifWidgetObject.data.gifWidgetDetail);
  //       }
  //     }
  //   }
  // }
  // initializeGifData(gifWidgetData) {
  //   this.createGifForm(gifWidgetData);
  // }
  // createGifForm(gifWidgetData) {
  //   this.gifsFormGroup = this.formBuilder.group({
  //     crop: [
  //       gifWidgetData ? gifWidgetData.isCropToFill : false,
  //       Validators.requiredTrue,
  //     ],
  //     brightness: [
  //       gifWidgetData ? gifWidgetData.brightness : 1.0,
  //       Validators.requiredTrue,
  //     ],
  //   });
  //   if (
  //     gifWidgetData != null &&
  //     (gifWidgetData.isGif || gifWidgetData.isStickers)
  //   ) {
  //     if (this.isDataLoaded == false) {
  //       return;
  //     }
  //     this.previewImage = gifWidgetData.imageUrl;
  //     if (gifWidgetData.isGif) {
  //       this.isGif = true;
  //       setTimeout(() => {
  //         this.loadTrending("gif");
  //       }, 200);
  //     }
  //     if (gifWidgetData.isStickers) {
  //       this.isSticker = true;
  //       setTimeout(() => {
  //         this.loadTrending("sticker");
  //       }, 200);
  //     }
  //   }
  //   if (this.isGif == false && this.isSticker == false) {
  //     if (this.isDataLoaded == false) {
  //       return;
  //     }
  //     this.isGif = true;
  //     setTimeout(() => {
  //       this.loadTrending("gif");
  //     }, 200);
  //   }
  // }
  // dismissModel() {
  //   this.gifSettingModal.hide();
  // }
  // saveGIFSetting() {
  //   let gifWidgetData = {
  //     widgetSetting: {},
  //   };
  //   let requestFormData = this.gifsFormGroup.value;
  //   gifWidgetData["imageBrightness"] = requestFormData.brightness;
  //   gifWidgetData["isCropToFill"] = requestFormData.crop;
  //   gifWidgetData["isGif"] = false;
  //   gifWidgetData["imageUrl"] = "";
  //   gifWidgetData["isStickers"] = false;
  //   if (this.selectedGif != undefined) {
  //     gifWidgetData["imageUrl"] = this.selectedGif.itemUrl;
  //     if (this.isGif == true) {
  //       gifWidgetData["isGif"] = true;
  //     }
  //     if (this.isSticker == true) {
  //       gifWidgetData["isStickers"] = true;
  //     }
  //   } else {
  //     gifWidgetData["isGif"] = false;
  //     gifWidgetData["imageUrl"] = "";
  //     gifWidgetData["isStickers"] = false;
  //   }
  //   gifWidgetData["widgetSetting"] = {
  //     id: this.gifWidgetObject.widgetSettingId,
  //   };
  //   this._imageWidgetService
  //     .updateGifWidgetSettings(gifWidgetData)
  //     .subscribe((widgetResponseData: any) => {
  //       this.gifSettingModal.hide();
  //       this.widgetSettingDetails.forEach((widgetPageData) => {
  //         widgetPageData.widgets.forEach((element) => {
  //           if (
  //             element.widgetSettingId === this.gifWidgetObject.widgetSettingId
  //           ) {
  //             let data = element.data.gifWidgetDetail;
  //             data = widgetResponseData.object.gifWidgetDetail;
  //             element.data.gifWidgetDetail = data;
  //           }
  //         });
  //       });
  //       this.widgetLayoutDetails.widgetSetting = this.widgetSettingDetails;
  //       this.storage.set("activeWidgetDetails", this.widgetLayoutDetails);
  //       this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);
  //     });
  //   this.dismissModel();
  // }
  // selectImage(gif: GifData): void {
  //   this.selectedGif = gif;
  //   this.previewImage = gif.gridUrl;
  // }
  // async loadTrending(type: string) {
  //   this.gifData = [];
  //   this.isSticker = false;
  //   this.isGif = true;
  //   if (type == "gif") {
  //     this.isSticker = false;
  //     this.isGif = true;
  //   } else {
  //     this.isSticker = true;
  //     this.isGif = false;
  //   }
  //   this.gifoption = {
  //     searchTerm: "",
  //     type: type,
  //     requestType: "trending",
  //   };
  //   this.gifoption = getGifOptions(this.gifoption);
  //   this.loadingSpinner.show();
  //   try {
  //     this.gifData = await this.fetchTrendingGifs(this.gifoption);
  //     this.loadingSpinner.hide();
  //   } finally {
  //     this.loadingSpinner.hide();
  //   }
  // }
  // private async fetchTrendingGifs(payload: GifOptions): Promise<GifData[]> {
  //   try {
  //     const result: any = await this._imageService
  //       .getGifData(payload)
  //       .toPromise();
  //     this.nextPage = result.object.nextPage;
  //     return [...result.object.gifData];
  //   } catch (err) {
  //     this.toastr.error(err.error.message, "Error");
  //     return []; // Return an empty array on error
  //   }
  // }
  // private async fetchSearchedGifs(payload: GifOptions): Promise<GifData[]> {
  //   try {
  //     const result: any = await this._imageService
  //       .getGifData(payload)
  //       .toPromise();
  //     this.nextPage = result.object.nextPage;
  //     return [...result.object.gifData];
  //   } catch (err) {
  //     this.toastr.error(err.error.message, "Error");
  //     return []; // Return an empty array on error
  //   }
  // }
  // async searchBasedGifs() {
  //   if (this.search != null && this.search.trim() != "") {
  //     var search = this.search;
  //     this.nextPage = "";
  //     var type = this.isGif ? "gif" : "sticker";
  //     this.gifData = [];
  //     this.gifoption = {
  //       searchTerm: search,
  //       type: type,
  //       requestType: "search",
  //     };
  //     this.gifoption = getGifOptions(this.gifoption);
  //     this.loadingSpinner.show();
  //     try {
  //       this.gifData = await this.fetchSearchedGifs(this.gifoption);
  //       this.loadingSpinner.hide();
  //     } finally {
  //       this.loadingSpinner.hide();
  //     }
  //   }
  // }
  // async loadMoreItems() {
  //   let payload = this.gifoption;
  //   payload.pos = this.nextPage;
  //   let result: GifData[];
  //   try {
  //     this.loadingSpinner.show();
  //     if (payload.searchTerm != null && payload.searchTerm.trim() != "") {
  //       result = await this.fetchSearchedGifs(payload);
  //     } else {
  //       result = await this.fetchTrendingGifs(payload);
  //     }
  //   } finally {
  //     this.loadingSpinner.hide();
  //   }
  //   if (result != null && result.length > 0) {
  //     this.gifData = [...this.gifData, ...result];
  //   }
  // }
}
