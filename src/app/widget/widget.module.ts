import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WidgetRoutingModule } from "./widget-routing.module";
import { LayoutComponentComponent } from "./layout-component/layout-component.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { AngularDraggableModule } from "angular2-draggable";
import { QuotesComponent } from "../templates/quotes-setting/quotes.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { WidgetCategoryComponent } from "../templates/widget-category/widget-category.component";
import { ClockSettingComponent } from "../templates/clock-setting/clock-setting.component";
import { NewsSettingComponent } from "../templates/news-setting/news-setting.component";
import { CustomTimePickerComponent } from "../templates/custom-time-picker/custom-time-picker.component";
import { NgbModule, NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { StickyNotesSettingComponent } from "../templates/sticky-notes-setting/sticky-notes-setting.component";
import { ConfirmPinWidgetComponent } from "../templates/confirm-pin-widget/confirm-pin-widget.component";
import { ConfirmUnpinWidgetComponent } from "../templates/confirm-unpin-widget/confirm-unpin-widget.component";
import { ConfirmDeletePageComponent } from "../templates/confirm-delete-page/confirm-delete-page.component";
import { ConfirmDeleteWidgetComponent } from "../templates/confirm-delete-widget/confirm-delete-widget.component";
import { ConfirmViewDisplayComponent } from "../templates/confirm-view-display/confirm-view-display.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { CalendarSettingComponent } from "../templates/calendar-setting/calendar-setting.component";
import { WeatherSettingComponent } from "../templates/weather-setting/weather-setting.component";
import { AgmCoreModule } from "@agm/core";
import { BackgroundImageComponent } from "../templates/background-image/background-image.component";
import { SharedModule } from "../shared/shared.module";
import { WidgetBgSettingComponent } from "../templates/widget-bg-setting/widget-bg-setting.component";
import { CalendarWidgetFormatComponent } from "../templates/calendar-widget-format/calendar-widget-format.component";
import { HealthSettingWidgetComponent } from "../templates/health-setting-widget/health-setting-widget.component";
import { ImageComponent } from "../templates/image/image.component";
import { GifStickersComponent } from "../templates/gif-stickers/gif-stickers.component";
import { WidgetlayerComponent } from "../templates/widgetlayer/widgetlayer.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CustomSortPipe } from "../pipes/custom-sort.pipe";
import { OutsideClickDirective } from "../directive/outside-click.directive";
import { GoogleDocIframelyComponent } from "../templates/google-doc-iframely/google-doc-iframely.component";
import { VideoIframelyComponent } from "../templates/video-iframely/video-iframely.component";
import { MicrosoftDocIframelyComponent } from "../templates/microsoft-doc-iframely/microsoft-doc-iframely.component";
import { AirtableIframelyComponent } from "../templates/airtable-iframely/airtable-iframely.component";
import { TrelloIframelyComponent } from "../templates/trello-iframely/trello-iframely.component";
import { AsanaIframelyComponent } from "../templates/asana-iframely/asana-iframely.component";
import { GoogleMapiframelyComponent } from "../templates/google-mapiframely/google-mapiframely.component";
import { EmbedWebsiteComponent } from "../templates/embed-website/embed-website.component";
import { EmbedHtmlComponent } from "../templates/embed-html/embed-html.component";
import { PdfDocumentComponent } from "../templates/pdf-document/pdf-document.component";
import { IcloudCalendarComponent } from "../templates/icloud-calendar/icloud-calendar.component";
import { IcsCalendarComponent } from "../templates/ics-calendar/ics-calendar.component";
import { TodoComponent } from "../templates/todo/todo.component";
import { TodoWidgetFormatComponent } from "../templates/todo-widget-format/todo-widget-format.component";
import { CountDownWidgetComponent } from "../templates/count-down-widget/count-down-widget.component";
import { ChoresComponent } from "../templates/chores/chores.component";
import { ChoresWidgetFormatComponent } from "../templates/chores-widget-format/chores-widget-format.component";
import { MealPlanComponent } from "../templates/meal-plan/meal-plan.component";
import { MealplanWidgetFormatComponent } from "../templates/mealplan-widget-format/mealplan-widget-format.component";
import { DragulaModule } from "ng2-dragula";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LayoutComponentComponent,
    QuotesComponent,
    WidgetCategoryComponent,
    ClockSettingComponent,
    NewsSettingComponent,
    CustomTimePickerComponent,
    StickyNotesSettingComponent,
    CalendarSettingComponent,
    WeatherSettingComponent,
    ConfirmPinWidgetComponent,
    ConfirmUnpinWidgetComponent,
    ConfirmDeletePageComponent,
    ConfirmDeleteWidgetComponent,
    ConfirmViewDisplayComponent,
    BackgroundImageComponent,
    WidgetBgSettingComponent,
    CalendarWidgetFormatComponent,
    HealthSettingWidgetComponent,
    ImageComponent,
    GifStickersComponent,
    WidgetlayerComponent,
    OutsideClickDirective,
    GoogleDocIframelyComponent,
    VideoIframelyComponent,
    MicrosoftDocIframelyComponent,
    AirtableIframelyComponent,
    TrelloIframelyComponent,
    AsanaIframelyComponent,
    GoogleMapiframelyComponent,
    EmbedWebsiteComponent,
    EmbedHtmlComponent,
    PdfDocumentComponent,
    IcloudCalendarComponent,
    IcsCalendarComponent,
    TodoComponent,
    TodoWidgetFormatComponent,
    CountDownWidgetComponent,
    ChoresComponent,
    ChoresWidgetFormatComponent,
    MealPlanComponent,
    MealplanWidgetFormatComponent,
    // MultiwidgetLandingPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DragulaModule,
    WidgetRoutingModule,
    AngularEditorModule,
    ModalModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AngularDraggableModule,
    NgbModule,
    NgbTimepickerModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBqEqFJHt-3IzCFOYKj1DUfL_y0p7iFrkI",
      libraries: ["places"],
    }),
    SharedModule,
    DragDropModule,
  ],
  providers: [CustomSortPipe],
})
export class WidgetModule {}
