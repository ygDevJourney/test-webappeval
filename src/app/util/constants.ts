export class MangoMirrorConstants {
  public static TENORE_API = "/tenorapi"; // proxy url
  public static Mango_Mirror_Logo =
    "https://mangomirrorimages.s3.amazonaws.com/mangomirror_icon.png";
  public static GOOGLE_PERMISSION_ERROR = "google permission error";
  public static GOOGLE_PERMISSION_ERROR_MESSAGE =
    "Account access permissions not provided. Please try again.";

  public static OUTLOOK_PERMISSION_ERROR = "outlook permission error";
  public static OUTLOOK_PERMISSION_ERROR_MESSAGE =
    "Account access permissions not provided. Please try again.";

  // public static TENOR_TRENDING_GIF_URL =
  //   "https://tenor.googleapis.com/v2/featured?key=$tenorKey&client_key=$google_clientkey&limit=$limit&random=true&media_filter=$media_filter&contentfilter=$contentfilter&searchfilter=$searchfilter&pos=$pos";
  // public static TENOR_SEARCH_GIF_URL =
  //   "https://tenor.googleapis.com/v2/search?q=$searchTerm&key=$tenorKey&client_key=$google_clientkey&limit=$limit&random=true&media_filter=$media_filter&contentfilter=$contentfilter&searchfilter=$searchfilter&pos=$pos";

  public static TENOR_TRENDING_GIF_URL =
    MangoMirrorConstants.TENORE_API +
    "/featured?key=$tenorKey&client_key=$google_clientkey&limit=$limit&random=true&media_filter=$media_filter&contentfilter=$contentfilter&searchfilter=$searchfilter&pos=$pos";
  public static TENOR_SEARCH_GIF_URL =
    MangoMirrorConstants.TENORE_API +
    "/search?q=$searchTerm&key=$tenorKey&client_key=$google_clientkey&limit=$limit&random=true&media_filter=$media_filter&contentfilter=$contentfilter&searchfilter=$searchfilter&pos=$pos";
}
