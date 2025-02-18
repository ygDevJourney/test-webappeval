import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ElementRef,
  HostListener,
} from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { ThemeCategory, Fonts } from "src/app/util/static-data";

@Component({
  selector: "app-mirrorbg-setting",
  templateUrl: "./mirrorbg-setting.component.html",
  styleUrls: ["./mirrorbg-setting.component.scss"],
})
export class MirrorbgSettingComponent implements OnInit, OnChanges {
  @Input() getSettingOptions: any = this.storage.get("activeMirrorDetails");
  @Input() activeMirror: any;
  @Output() emitbgsetting: EventEmitter<any> = new EventEmitter<any>();

  themeCategoryList = [];
  gesture = {
    touch_page_swipe: true,
    touch_page_hold: true,
    touch_todo_complete: true,
    touch_chores_complete: true,
  };
  settingOptions = {
    id: "",
    backgroundSetting: {
      transparency: 1,
      blur: 0,
      shadow: true,
      corner: "rounded",
      backgroundColor: "default",
      id: "",
      theme: "Simplex",
      fontFamily: "Open Sans",
      fontColor: "#212529",
      pageBackgroundColor: "#FCFCFC",
      gesture: JSON.stringify(this.gesture),
    },
  };

  availableFonts = [...Fonts];
  mirrorBackgroundSetting: any;
  backgroundEffect: string = "Transparency";
  showOptions: boolean = false;

  toggleOptions(event: Event): void {
    this.showOptions = !this.showOptions;
    event.stopPropagation();
  }

  selectOption(option: string): void {
    this.settingOptions.backgroundSetting.fontFamily = option;
    this.showOptions = false;
  }

  constructor(private storage: LocalStorageService) {}

  // Method to close dropdown if user clicks outside of the container
  @HostListener("document:click", ["$event"])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdownContainer = document.querySelector(
      ".custom-select-container"
    );

    if (!dropdownContainer.contains(target)) {
      this.showOptions = false;
    }
  }

  ngOnChanges(changes: any) {
    if (changes.activeMirror) {
      this.getSettingOptions = this.storage.get("activeMirrorDetails");
      this.mirrorBackgroundSetting =
        this.getSettingOptions.mirror.backgroundSetting;
      this.initializeBgSettings();
    }
  }

  initializeBgSettings() {
    if (
      this.getSettingOptions &&
      this.getSettingOptions.mirror &&
      this.getSettingOptions.mirror.backgroundSetting
    ) {
      this.settingOptions = {
        id: this.getSettingOptions.mirror.id,
        backgroundSetting: {
          transparency: this.mirrorBackgroundSetting.transparency,
          blur: this.mirrorBackgroundSetting.blur,
          shadow: this.mirrorBackgroundSetting.shadow,
          corner: this.mirrorBackgroundSetting.corner,
          backgroundColor: this.mirrorBackgroundSetting.backgroundColor,
          id: this.mirrorBackgroundSetting.id,
          theme: "Simplex",
          fontFamily:
            this.mirrorBackgroundSetting.fontFamily != undefined
              ? this.mirrorBackgroundSetting.fontFamily
              : "Roboto Slab",
          fontColor:
            this.mirrorBackgroundSetting.fontColor != undefined
              ? this.mirrorBackgroundSetting.fontColor
              : "#c34141",
          pageBackgroundColor:
            this.mirrorBackgroundSetting.pageBackgroundColor != undefined
              ? this.mirrorBackgroundSetting.pageBackgroundColor
              : "#64C341",

          gesture:
            this.mirrorBackgroundSetting.gesture != undefined
              ? this.mirrorBackgroundSetting.gesture
              : JSON.stringify(this.gesture),
        },
      };

      if (this.mirrorBackgroundSetting.blur == 0) {
        this.backgroundEffect = "Transparency";
      } else {
        this.backgroundEffect = "Blur";
      }
    } else if (this.getSettingOptions && this.getSettingOptions.mirror) {
      this.settingOptions["id"] = this.getSettingOptions.mirror.id;
    }
  }

  ngOnInit() {
    this.themeCategoryList = ThemeCategory;
    this.initializeBgSettings();
  }

  onAddBackgroundSetting() {
    if (this.backgroundEffect == "Transparency") {
      this.settingOptions.backgroundSetting.blur = 0;
    } else {
      this.settingOptions.backgroundSetting.transparency = 0;
    }
    this.emitbgsetting.emit(this.settingOptions);
  }
}
