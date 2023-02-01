import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {QrScannerComponent} from 'angular2-qrscanner';

@Component({
  selector: 'app-qrscanner2',
  templateUrl: './qrscanner2.component.html',
  styleUrls: ['./qrscanner2.component.css']
})
export class Qrscanner2Component implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;

  ngOnInit() {
      this.qrScannerComponent.getMediaDevices().then(devices => {
          console.log(devices);
          const videoDevices: MediaDeviceInfo[] = [];
          for (const device of devices) {
            alert(device.kind.toString());
              if (device.kind.toString() === 'videoinput') {
                  videoDevices.push(device);
              }
          }
          if (videoDevices.length > 0){
              let choosenDev;
              for (const dev of videoDevices){
                  if (dev.label.includes('front')){
                      choosenDev = dev;
                      break;
                  }
              }
              if (choosenDev) {
                  this.qrScannerComponent.chooseCamera.next(choosenDev);
              } else {
                  this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
              }
          }
      });

      this.qrScannerComponent.capturedQr.subscribe(result => {
          console.log(result);
      });
  }

  read(event: any) {
    alert("Success!");
  }
}
