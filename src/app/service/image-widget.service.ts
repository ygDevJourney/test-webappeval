import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ImageWidgetService {
  constructor(private http: HttpClient) {}

  updateImageWidgetSettings(imageWidgetRequestData: any) {
    return this.http.put(
      environment.baseURL + "background/imageWidget",
      imageWidgetRequestData
    );
  }
  updateGifWidgetSettings(gifWidgetRequestData: any) {
    return this.http.put(
      environment.baseURL + "background/gifWidget",
      gifWidgetRequestData
    );
  }

  getLatestAlbumList(googleAlbum: any) {
    return this.http.put(
      environment.baseURL + "background/updateAlbumList",
      googleAlbum
    );
  }

  validateAppleImageUrl(requestData: any) {
    return this.http.post(
      environment.baseURL + "users/applePhotoUrl",
      requestData
    );
  }

  getGifData(requestData: any) {
    return this.http.post(
      environment.baseURL + "background/gifData",
      requestData
    );
  }
}
