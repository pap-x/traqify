import { Component, OnInit } from '@angular/core';
import { StartService } from '../start.service';
import { TaskService } from '../task.service';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-forklift',
  templateUrl: './forklift.component.html',
  styleUrls: ['./forklift.component.css']
})
export class ForkliftComponent implements OnInit {

  user: any = {name: 'User', operation: 'Forklift Driver'};
  current_task: any = {product_id: '', current_station: '', next_station: '', amount: '', container_id: ''};
  tasks: any = [];
  qr_search = 0;
  completed_btn = false;
  tookPhoto = false;
  photo: any = null;
  scan_result: any = null;
  img_ratio = 1;
  isLoading = false;

  scanQRView = false;
  foundQR = false;

  //QR Scanner
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  constructor(private startService: StartService, private taskService: TaskService, private imageService: ImageService) {
    this.taskService.newTaskReceived().subscribe((data)=>{
      this.tasks.push(data);
      console.log(this.tasks);
    });

    this.taskService.getCurrentTasks().subscribe((data)=>{
      this.tasks.push(...data);
    });
  }

  ngOnInit() {
    var user = this.startService.getUser();
    if (user) {
      this.user = user;
    }
  }

  acceptTask(index: number) {
    this.current_task = this.tasks[index];
    this.tasks.splice(index, 1);
    this.taskService.removeTask(this.current_task);

    //If the container is from the warehouse then no QR scan
    if (this.current_task.container_id>10000) {
      this.completed_btn = true;
    }
  }

  scanQR() {
    this.isLoading = true;
    this.imageService.uploadImage(this.photo).subscribe(data => {
      this.scan_result = data;
      console.log(data);
      this.scanDraw();
      this.isLoading = false;
    });
  }

  complete() {
    this.qr_search = 0;
    this.completed_btn = false;
    this.current_task = {};
  }

  //QR Scanner
  /*onCodeResult(resultString: string) {
    if (resultString==this.current_task.container_id) {
      //this.scanQRView = false;
      if (this.qr_search!=2) {
        this.qr_search = 2;
        this.completed_btn = true;
        setTimeout(()=>{
          this.qr_search = 0;
        }, 1500);
      }
    }
    else {
      if (this.qr_search!=1) {
        this.qr_search = 1;
        setTimeout(()=>{
          this.qr_search = 0;
        }, 1500);
      }
    }
  }*/

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
  }

  closeCamera() {
    this.scanQRView = false;
  }

  onImageTaken(event) {
    this.photo = event.target.files[0];
    this.tookPhoto = true;
    this.imageDraw();
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
              if (img.width>500) {
                outer_this.img_ratio = 500/img.width;
              }
              else if (img.height>375) {
                outer_this.img_ratio = 375/img.height;
              }
              const width = img.width * outer_this.img_ratio;
              const height = img.height * outer_this.img_ratio;
              ctx.drawImage(img, 0, 0, width, height);
            });
            img.src = <string> FR.result;
        };
        FR.readAsDataURL( this.photo );
    }
  }

  scanDraw() {
    const c = <HTMLCanvasElement> document.getElementById("scanned-image");
    const ctx = c.getContext("2d");
    if (this.scan_result.length > 0) {
      for (let scan of this.scan_result) {
        console.log(this.current_task.container_id);
        if (scan.data == this.current_task.container_id) {
          ctx.strokeStyle = '#0f0';
          console.log('found correct!');
          this.completed_btn = true;
        }
        else {
          ctx.strokeStyle = '#f00';
          console.log('wrong data');
        }
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(scan.point[0][0] * this.img_ratio, scan.point[0][1] * this.img_ratio);
        ctx.lineTo(scan.point[1][0] * this.img_ratio, scan.point[1][1] * this.img_ratio);
        ctx.lineTo(scan.point[2][0] * this.img_ratio, scan.point[2][1] * this.img_ratio);
        ctx.lineTo(scan.point[3][0] * this.img_ratio, scan.point[3][1] * this.img_ratio);
        ctx.closePath();
        ctx.stroke();
      }
    }
    else {
      alert("No QR tags found, please try again!");
    }
  }
}
