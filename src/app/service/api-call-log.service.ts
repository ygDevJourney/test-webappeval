import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { stringify } from "querystring";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiCallLogService {
  constructor(private http: HttpClient) {}

  private apiLog: any[] = [];
  private maxLogSize: number = 10;

  addLog(apiCall: HttpRequest<any>, status?: string, error?: any): void {
    let log = {
      timestamp: new Date(),
      body: apiCall.body,
      url: apiCall.url,
      status: status,
      error: error || null,
    };

    // Add the log to the array
    this.apiLog.push(log);

    // Ensure we only keep the last 10 logs
    if (this.apiLog.length > this.maxLogSize) {
      this.apiLog.shift();
    }
  }

  // Function to send the logs to the backend
  sendLogsToBackend() {
    return this.http.post(environment.baseURL + "users/apilog", {
      body: JSON.stringify(this.apiLog),
    });
  }
}
