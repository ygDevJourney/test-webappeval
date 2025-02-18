import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class AppSettings {

  public static DEVICE_ID_INITIALS = 'MD';
  public static DEVICE_TYPE_BROWSER = 'Linked Browser';
  public static STORAGE_DEVICE_ID = 'deviceId';
  public static RANDOM_NUMBER = 'randomNumber';
  public static ACTIVE_FLAG_INTERVAL = 5000;
}
