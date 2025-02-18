import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponentComponent } from "./layout-component/layout-component.component";
import { QuotesComponent } from "../templates/quotes-setting/quotes.component";

const routes: Routes = [
  { path: "", component: LayoutComponentComponent },
  { path: "layout", component: LayoutComponentComponent },
  { path: "layout/outlookcalendar", component: LayoutComponentComponent },
  { path: "layout/outlookTodoTask", component: LayoutComponentComponent },
  { path: "layout/TodoIst", component: LayoutComponentComponent },
  { path: "quotes", component: QuotesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WidgetRoutingModule {}
