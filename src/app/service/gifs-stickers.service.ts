import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { promise } from "protractor";

import { GifUtil } from "../util/gif-util";
import { getGifOptions, Gif, GifData, GifOptions } from "../model/gif-data";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GifsStickersService {
  httpOptions: { headers: HttpHeaders };
  constructor(private http: HttpClient, private _gifUtil: GifUtil) {}

  getTrendingGifs() {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      }),
    };
    return this.http.get(
      `https://api.giphy.com/v1/gifs/trending?api_key=Iwyi2zfufcWKAzSf4aeJW0MG731EmIaS&limit=10`,
      this.httpOptions
    );
  }

  // searchGIF(gif: GifOptions) {
  //   let url = this._gifUtil.buildEndPoint("search", gif);
  //   return this.http
  //     .get(url, this.httpOptions)
  //     .pipe(map((response) => this.mapResponseToGifOptions(response, gif)));
  // }

  // getTrendingGif(gif: GifOptions): Observable<Gif> {
  //   let url = this._gifUtil.buildEndPoint("trending", gif);
  //   return this.http
  //     .get(url)
  //     .pipe(map((response) => this.mapResponseToGifOptions(response, gif)));
  // }

  // private mapResponseToGifOptions(response: any, gif: GifOptions): Gif {
  //   let result: Gif = {
  //     nextPage: response.next,
  //     gifData: response.results.map((imageObj: any) => {
  //       let item: GifData = {};
  //       if (gif.type == "gif") {
  //         item.itemUrl = imageObj.media_formats.gif.url;
  //         item.gridUrl = imageObj.media_formats.tinygif.url;
  //       } else if (gif.type == "sticker") {
  //         item.itemUrl = imageObj.media_formats.gif_transparent.url;
  //         item.gridUrl = imageObj.media_formats.tinygif_transparent.url;
  //       }
  //       return item;
  //     }),
  //   };
  //   return result;
  // }
}
