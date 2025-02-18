import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  // service key
  static Proximity_Service = '7fd2d904-0c86-11e6-a148-3e1d05defe78';
  static MangoMirror_Service = '81984674-3d24-11e6-ac61-9e71128cae77';
  static DeviceInformation_Service = 'c7ba6552-27d9-11e6-b67b-9e71128cae77';
  static WifiConfiguration_Service = '6d1e5d08-180f-11e6-b6ba-3e1d05defe78';
  static BLENaming_Service  = '6d1e6118-180f-11e6-b6ba-3e1d05defe78';
  static FactoryResetMirror_Service = 'be3e5ba4-d702-11e6-bf26-cec0c932ce01';

  // characteristics key
  static DeviceInformation   = 'c7ba6553-27d9-11e6-b67b-9e71128cae77';
  static WifiName            = '6d1e5d09-180f-11e6-b6ba-3e1d05defe78';
  static WifiPassword        = '6d1e5d0a-180f-11e6-b6ba-3e1d05defe78';
  static WifiKeyEncription   = '6d1e5d0b-180f-11e6-b6ba-3e1d05defe78';
  static BLEAdvertisingName  = '6d1e6119-180f-11e6-b6ba-3e1d05defe78';
  static BLEMajor            = '6d1e611a-180f-11e6-b6ba-3e1d05defe78';
  static BLEMinor            = '6d1e611b-180f-11e6-b6ba-3e1d05defe78';
  static ResetMirror         = 'e3ffed9e-d702-11e6-bf26-cec0c932ce01';
  static GetWifiList         = 'e6dee8b4-d8c2-11e6-bf26-cec0c932ce01';

  constructor() {}

  
  
}
