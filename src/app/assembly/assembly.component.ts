import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { StartService } from '../start.service';
import { NgForm, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {map, startWith} from 'rxjs/operators';
import { AgvService } from '../agv.service';

@Component({
  selector: 'app-assembly',
  templateUrl: './assembly.component.html',
  styleUrls: ['./assembly.component.css']
})
export class AssemblyComponent implements OnInit {

  products: any = [];
  product: any = {id: '', station: ''};
  list_products: Observable<any[]>;
  task: any = {product_id: '', current_station: '', container_id: '', amount: 0, next_station: ''};
  next_station = '';
  current_container: any = {product_id: '', container_id: '', amount: 0};
  stations: string[] = [];
  isLoading = true;
  productList: string[] = [];
  partList: {OM: string, ID: string, Order: string, DESCRIPCION: string}[] = [];
  button_active = true;
  user: any = {name: 'User', operation: 'Assembly Worker', station: 'Assembly Line'};
  scanQRView = false;
  foundQR = false;
  process_mode = false;
  request: any = {product_id: '', amount: ''};
  productCtrl = new FormControl();
  completed: any = {landmech_id: ''};

  //QR Scanner
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  constructor(private taskService: TaskService, private startService: StartService, private snackBar: MatSnackBar, private agvService: AgvService) {
    this.list_products = this.productCtrl.valueChanges
      .pipe(
        startWith(''),
        map(part => part ? this._filterProducts(part) : this.partList.slice())
      );
  }

  ngOnInit() {
    var user = this.startService.getUser();
    if (user) {
      this.user = user;
    }

    this.taskService.getProductList().subscribe(data => {
      this.products = data;

      let flags = {};
      this.partList = this.products.filter(data => {
          if (flags[data.ID]) {
              return false;
          }
          flags[data.ID] = true;
          return true;
      });
      this.productList = data.map(item => item.Order).filter((value, index, self) => self.indexOf(value) === index);
      this.isLoading = false;
    });
  }

  scanQR(mode: string) {
    if (mode=='process') {
      this.process_mode = true;
    }
    else {
      this.process_mode = false;
    }
    this.scanQRView = true;
    setTimeout(()=>{
      this.currentDevice = this.availableDevices[1];
    }, 2000);
  }

  createTask(form: NgForm) {
    this.isLoading = true;

    this.task.current_station = this.user.station;
    this.taskService.getNextStation(this.task.product_id, this.task.current_station).subscribe(data => {
      this.task.next_station = data.next_station;
      this.taskService.newTask(this.task);
      this.isLoading = false;
      form.reset();
      let snackBarRef = this.snackBar.open("The task was successfully created!", "OK", {duration: 3000});
    });
  }

  createReqTask(form: NgForm) {
    this.isLoading = true;

    this.task.current_station = this.user.station + " Buffer";
    this.task.next_station = this.user.station;

    this.taskService.getContainer(this.task.product_id).subscribe(data => {
      let containers = data;
      let found_container = false;
      for (let i = 0; i < containers.length; i++) {
        if (containers[i].current_station == this.task.current_station) {
          this.task.container_id = containers[i].container_id;
          this.task.amount = containers[i].amount;
          this.taskService.newTask(this.task);
          this.isLoading = false;
          form.reset();
          let snackBarRef = this.snackBar.open("The task was successfully created!", "OK", {duration: 3000});
          found_container = true;
          break;
        }
      }
      if (!found_container) {
        let snackBarRef = this.snackBar.open("The chosen part is not in the buffer yet!", "OK", {duration: 3000});
      }
      this.isLoading = false;
    });
  }

  onProductChange(productId: string) {
    this.isLoading = true;
    const parts = this.products.filter(element => element.Order == productId);
    this.partList = parts;
    this.isLoading = false;
  }

  onPartChange(partId: string) {
    this.request.product_id = partId;
  }

  trackID() {

    this.isLoading = true;

    this.taskService.getNextStation(this.product.id, this.product.station).subscribe(data => {
      this.isLoading = false;
      this.next_station = data.next_station;
    });
  }

  processContainer() {
    this.taskService.setCurrentStation(this.current_container.container_id, this.user.station).subscribe(data => {
      if (!(data.message=='success')) {
        alert('There was a problem with your request');
      }
    });
  }

  requestRaw(form: NgForm) {
    this.taskService.newRequest(this.request);
    form.reset();
  }

  //QR Scanner
  onCodeResult(resultString: string) {
    this.scanQRView = false;
    if (this.process_mode) {
      this.taskService.getCurrentContainer(resultString).subscribe(data => {
        this.current_container = data[0];
      });
    }
    else {
      this.task.container_id = resultString;
      this.foundQR = true;
    }
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
  }

  completedLandMech() {
    this.isLoading = true;
    this.taskService.completedLandMech(this.completed.landmech_id).subscribe(data => {
      console.log(data.message);
      let snackBarRef = this.snackBar.open(data.message, "OK", {duration: 4000});
      this.agvService.counter();
    });
    this.isLoading = false;
  }

  unloadedAgv() {
    this.agvService.unloadedAgv();
    let snackBarRef = this.snackBar.open("AGV is unloaded!", "OK", {duration: 4000}); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  }

  private _filterProducts(value: string): any[] {
    const filterValue = value.toString();

    return this.partList.filter(part => part.ID.toString().indexOf(filterValue) === 0);
  }

}
