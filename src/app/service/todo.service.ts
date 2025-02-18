import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  constructor(private http: HttpClient) {}

  updateToDoWidgetFormat(payload: any) {
    return this.http.put(environment.baseURL + "todo/todoFormat", payload);
  }

  addGoogleTodoAccount() {
    return this.http.get(environment.baseURL + "todo/google/login");
  }

  updateGoogleTodoCredentials(payload: any) {
    return this.http.post(
      environment.baseURL + "todo/google/updateCredentials",
      payload
    );
  }

  updateOutlookTaskCredentials(payload: any) {
    return this.http.post(
      environment.baseURL + "todo/outlook/updateCredentials",
      payload
    );
  }

  addOutlookTodoAccount() {
    return this.http.get(environment.baseURL + "todo/outlook/login");
  }

  updateTodoiasCredentials(payload: any) {
    return this.http.post(
      environment.baseURL + "todo/todoist/updateCredentials",
      payload
    );
  }

  addTodoistAccount() {
    return this.http.get(environment.baseURL + "todo/todoist/login");
  }

  deleteTodoAccount(accountId) {
    return this.http.delete(environment.baseURL + "todo/" + accountId);
  }

  getLatestTodoProjectList(payload: any) {
    return this.http.post(
      environment.baseURL + "todo/todoProjectList",
      payload
    );
  }

  getLatestTodoLabels(payload: any) {
    return this.http.post(environment.baseURL + "todo/labels", payload);
  }

  updateSelectedLabels(payload: any) {
    return this.http.put(environment.baseURL + "todo/labels", payload);
  }

  updateSelectedProject(payload: any) {
    return this.http.put(environment.baseURL + "todo/todoProjectList", payload);
  }

  updateProjectColor(payload: any, widgetSettingId: number) {
    return this.http.put(
      environment.baseURL + "todo/updateTodoColor/" + widgetSettingId,
      payload
    );
  }
}
