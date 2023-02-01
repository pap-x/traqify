import { Component, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { ImageService } from '../image.service';
//import { FormatsDialogComponent } from './formats-dialog/formats-dialog.component';
//import { AppInfoDialogComponent } from './app-info-dialog/app-info-dialog.component';

@Component({
  selector: 'app-qrscanner',
  templateUrl: 'qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css']
})
export class QrscannerComponent implements AfterViewInit {

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  photo: any = null;
  scan_result: any = null;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;

  constructor(private readonly _dialog: MatDialog, private imageService: ImageService) { }

  clearResult(): void {
    this.qrResultString = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
    //this.currentDevice = this.availableDevices[1];
    console.log(this.availableDevices);
    this.currentDevice = this.availableDevices[1];
    console.log(this.currentDevice);
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
    console.log(this.currentDevice);
  }

  openFormatsDialog() {
    const data = {
      formatsEnabled: this.formatsEnabled,
    };

    /*this._dialog
      .open(FormatsDialogComponent, { data })
      .afterClosed()
      .subscribe(x => { if (x) { this.formatsEnabled = x; } });*/
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  openInfoDialog() {
    const data = {
      hasDevices: this.hasDevices,
      hasPermission: this.hasPermission,
    };

    /*this._dialog.open(AppInfoDialogComponent, { data });*/
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

  ngAfterViewInit() {
    //alert("test!!!!");
    //this.currentDevice = this.availableDevices[1];
  }

  scanQR() {
    this.imageService.uploadImage(this.photo).subscribe(data => {
      this.scan_result = data;
      console.log(data);
      this.imageDraw();
    });
    //2. draw image on canvas
    //3. draw rectangles on image

    /*this.scanQRView = true;
    setTimeout(()=>{
      this.currentDevice = this.availableDevices[1];
    }, 2000);*/
  }

imageDraw() {
  const c = <HTMLCanvasElement> document.getElementById("scanned-image");
  const ctx = c.getContext("2d");
  if ( this.photo ) {
      var FR= new FileReader();
      const outer_this = this;
      FR.onload = function(e) {
          var img = new Image();
          img.addEventListener("load", function() {
            var ratio = 1;
            if (img.width>640) {
              ratio = 640/img.width;
            }
            else if (img.height>480) {
              ratio = 480/img.height;
            }
            const width = img.width*ratio;
            const height = img.height*ratio;
            ctx.drawImage(img, 0, 0, width, height);
            if (outer_this.scan_result.length > 0) {
              for (let scan of outer_this.scan_result) {
                if (scan.data === '0500') {
                  ctx.strokeStyle = '#0f0';
                  console.log('found correct!');
                }
                else {
                  ctx.strokeStyle = '#f00';
                  console.log('wrong data');
                }
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(scan.point[0][0] * ratio, scan.point[0][1] * ratio);
                ctx.lineTo(scan.point[1][0] * ratio, scan.point[1][1] * ratio);
                ctx.lineTo(scan.point[2][0] * ratio, scan.point[2][1] * ratio);
                ctx.lineTo(scan.point[3][0] * ratio, scan.point[3][1] * ratio);
                ctx.closePath();
                ctx.stroke();
              }
            }
            else {
              alert("No QR tags found, please try again!");
            }
          });
          img.src = <string> FR.result;
      };
      FR.readAsDataURL( this.photo );
  }
}

  onImageTaken(event) {
    this.photo = event.target.files[0];
  }
}
