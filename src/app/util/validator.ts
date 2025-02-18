import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class Validator {
  constructor() {}

  isValidEmail(email: string) {
    // if (/(\.)\1|(\-)\1|(\_)\1+/g.test(email)) {
    //   return false;
    // } else {
    //   var re = /^(([a-zA-Z0-9]+)|([0-9]*[a-zA-Z]+))+([a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]*)@(([a-zA-Z\.\-]+)+(\.+)+[a-zA-Z]{2,})$/;
    //   return re.test(email);
    // }

    // var re = /^(([a-zA-Z0-9]+)|([0-9]*[a-zA-Z]+))+([a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]*)@(([a-zA-Z\.\-]+)+(\.+)+[a-zA-Z]{2,})$/;
    // if (re.test(email)) {
    //   return true;
    // } else {
    //   return false;
    // }
    // return true;

    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  isValidPassword(password: string): boolean {
    if (password.length < 6 || password.length > 20) {
      return false;
    } else {
      return true;
    }
  }

  isEmptyField(value: string) {
    if (
      value === "" ||
      value.trim() === "" ||
      value === undefined ||
      value === null
    ) {
      return true;
    } else {
      return false;
    }
  }

  isValidDisplayName(name: string) {
    // var re = /^([a-zA-Z]+[a-zA-Z\ ]*)$/;
    // return re.test(name);
    return true;
  }

  isValidMirrorName(mirrorName: string): boolean {
    if (mirrorName.length < 1 || mirrorName.length > 50) {
      return false;
    } else {
      return true;
    }
  }

  checkIcloudImageUrlValidation(): boolean {
    return true;
  }

  isMobile(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isPhone = /android|iphone|ipod|blackberry|iemobile|opera mini/.test(
      userAgent
    );
    return isPhone;
  }
}
