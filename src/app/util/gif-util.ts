import { Injectable, OnInit } from "@angular/core";
import { MangoMirrorConstants } from "./constants";
import { environment } from "src/environments/environment";
import { GifOptions } from "../model/gif-data";

@Injectable({
  providedIn: "root",
})
export class GifUtil implements OnInit {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  buildEndPoint(searchTerm: string, gif: GifOptions): string {
    let url: string = "";
    switch (searchTerm) {
      case "trending":
        url = MangoMirrorConstants.TENOR_TRENDING_GIF_URL;
        break;
      case "search":
        url = MangoMirrorConstants.TENOR_SEARCH_GIF_URL;
        break;
      default:
        break;
    }

    url = url
      // .replace("$tenorKey", environment.tenorKey)
      // .replace("$google_clientkey", environment.googleClientKey)
      .replace("$searchTerm", gif.searchTerm)
      .replace("$limit", gif.limit.toString())
      .replace("$contentfilter", gif.contentfilter)
      .replace("$pos", gif.pos);

    if (gif.type == "gif") {
      url = url
        .replace("$searchfilter", "")
        .replace("$media_filter", "gif,tinygif");
    }

    if (gif.type == "sticker") {
      url = url
        .replace("$searchfilter", "sticker")
        .replace("$media_filter", "gif_transparent,tinygif_transparent");
    }
    return url;
  }
}
