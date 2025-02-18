import { Injectable } from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import * as AWS from "aws-sdk";
import { S3 } from "aws-sdk/clients/qbusiness";
import { Observable, observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CommonFunction } from "./common-function.service";
import * as bytes from "bytes";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import heic2any from "heic2any";

export const awsconfig = {
  aws: {
    region: "us-east-1",
    credentials: new AWS.Credentials(
      "abc",
      "abc"
    ),
  },
};

const S3 = new AWS.S3(awsconfig.aws);
const s3basepath = "https://test.mangodisplay.com/";

@Injectable({
  providedIn: "root",
})
export class AwsService {
  albumBucketName = "user-drive-bucket";
  currentFolder: string;
  supportedMicrosoftType: string[] = [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  constructor(
    private _commonFunction: CommonFunction,
    private http: HttpClient
  ) {}

  createS3Folder(foldername: string): Observable<any> {
    let key = this.currentFolder.concat(foldername).concat("/");
    return new Observable((observable) => {
      S3.putObject(
        {
          Bucket: this.albumBucketName,
          Key: this.currentFolder.concat(foldername).concat("/"),
        },
        (err: AWS.AWSError, data: AWS.S3.PutObjectOutput) => {
          if (err) {
            observable.error(err);
          } else {
            // this.currentFolder = key;
            observable.next(data);
          }
        }
      );
    });
  }

  async getS3FolderSize(folderPrefix: string): Promise<number> {
    let totalSize: number = 0;
    const params = {
      Bucket: this.albumBucketName,
      Prefix: folderPrefix,
      Delimiter: "/",
    };

    try {
      const data = await S3.listObjectsV2(params).promise();

      // Add the size of objects in the main folder
      if (data.Contents) {
        for (const obj of data.Contents) {
          if (obj.Size) {
            totalSize += obj.Size;
          }
        }
      }

      // Recursively add the sizes of objects in subfolders
      if (data.CommonPrefixes) {
        for (const commonPrefix of data.CommonPrefixes) {
          totalSize += await this.getS3FolderSize(commonPrefix.Prefix || "");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    return totalSize;
  }

  // getS3TotalSize(basePath:string): Observable<any> {
  //   return new Observable((observable) => {
  //     this.getS3FolderSize(basePath)
  //       .then((res) => {
  //         observable.next(res);
  //       })
  //       .catch((error) => {
  //         observable.error(error);
  //       });
  //   });
  // }

  isFolderExist(key: string): Observable<any> {
    return new Observable((observable) => {
      S3.headObject(
        {
          Bucket: this.albumBucketName,
          Key: key,
        },
        (err: AWS.AWSError, data: AWS.S3.HeadObjectOutput) => {
          if (err) {
            observable.error(err);
          } else {
            observable.next(data);
          }
        }
      );
    });
  }

  async heicToPngFile(file: File): Promise<File | null> {
    try {
      const pngBlobs: Blob | Blob[] = await heic2any({
        blob: file,
        toType: "image/png",
        quality: 1, // optional, JPEG quality between 0 and 1
      });

      const pngBlob = Array.isArray(pngBlobs) ? pngBlobs[0] : pngBlobs;
      const pngFile = new File(
        [pngBlob],
        file.name
          .substring(0, file.name.lastIndexOf("."))
          .concat("_heic")
          .concat(".png"),
        {
          type: "image/png",
        }
      );
      return pngFile;
    } catch (error) {
      console.error("Conversion error:", error);
      return null;
    }
  }

  async uploadFile(files: File[]): Promise<any[]> {
    const uploadPromises = [];

    for (let file of files) {
      if (this._commonFunction.getFileMimeType(file.name) == "image/heic") {
        let convertedFile = await this.heicToPngFile(file);
        if (convertedFile) {
          file = convertedFile; // Replace original file with converted file
        } else {
          continue; // Skip this file if conversion failed
        }
      }
      const params = {
        Bucket: this.albumBucketName,
        Key: this.currentFolder.concat(file.name),
        Body: file,
      };
      if (
        this._commonFunction.getFileMimeType(file.name) == "application/pdf"
      ) {
        params["ContentType"] = "application/pdf";
      }

      if (
        this.supportedMicrosoftType.includes(
          this._commonFunction.getFileMimeType(file.name)
        )
      ) {
        params["ContentDisposition"] = "inline";
        params["ContentType"] = this._commonFunction.getFileMimeType(file.name);
      }

      const uploadPromise = S3.upload(params).promise();
      uploadPromises.push(uploadPromise);
    }

    return Promise.all(uploadPromises);
  }

  removeFolderAndFile(keys: any[]): Observable<any> {
    return new Observable((observable) => {
      S3.deleteObjects(
        {
          Bucket: this.albumBucketName,
          Delete: { Objects: keys.map((key: any) => ({ Key: key.key })) },
        },
        (err: AWS.AWSError, data: AWS.S3.DeleteObjectsOutput) => {
          if (err) {
            observable.error(err);
          } else {
            observable.next(data);
          }
        }
      );
    });
  }

  getS3Folder(): Observable<any> {
    return new Observable((observable) => {
      S3.listObjectsV2(
        {
          Bucket: this.albumBucketName,
          Prefix: this.currentFolder.toString(),
          Delimiter: "/",
        },
        (err: AWS.AWSError, data: AWS.S3.ListObjectsV2Output) => {
          if (err) {
            observable.error(err);
          } else {
            let list: any[] = [];
            list = list.concat(
              data.CommonPrefixes.map((m) => {
                return {
                  name: m.Prefix,
                  type: "folder",
                  s3_img_url: s3basepath.concat(m.Prefix),
                  modifiedTime: null,
                  displayName: m.Prefix.replace(this.currentFolder, ""),
                  mimeType: "folder",
                  isSelected: false,
                };
              })
            );
            list = list.concat(
              data.Contents.filter(
                (file) => file.Key != this.currentFolder
              ).map((content) => {
                return {
                  name: content.Key,
                  type: "file",
                  displayName: content.Key.replace(this.currentFolder, ""),
                  modifiedTime: moment(content.LastModified).format(
                    "M/D/YYYY, h:mm A"
                  ),
                  size: bytes(content.Size),
                  mimeType: this._commonFunction.getFileMimeType(content.Key),
                  s3_img_url: this._commonFunction
                    .getFileMimeType(content.Key)
                    .includes("video")
                    ? s3basepath.concat(encodeURIComponent(content.Key))
                    : s3basepath.concat(encodeURIComponent(content.Key)),
                  isSelected: false,
                };
              })
            );
            observable.next(list);
          }
        }
      );
    });
  }

  checkSelectedImageFile(keys: any) {
    return this.http.post(
      environment.baseURL + "background/checkFileSelected",
      keys
    );
  }

  deleteSelectedFile(keys: any) {
    return this.http.put(environment.baseURL + "users/removeS3Files", keys);
  }
}
