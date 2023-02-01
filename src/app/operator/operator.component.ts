import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { StartService } from '../start.service';
import { NgForm, FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit {

  products: any = [];
  filtered_products: Observable<any>;
  product: any = {id: '', station: ''};
  task: any = {product_id: '', current_station: '', container_id: '', amount: 0, next_station: ''};
  next_station = '';
  current_container: any = {product_id: '', container_id: '', amount: 0};
  stations: string[] = [];
  isLoading = true;
  productList: string[] = [];
  partList: any = [];
  button_active = false;
  button_activeReq = false;
  user: any = {name: 'User', operation: 'Machine Operator', station: 'Punching Machine'};
  scanQRView = false;
  foundQR = false;
  process_mode = false;
  productCtrl = new FormControl();

  //QR Scanner
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  constructor(private taskService: TaskService, private startService: StartService, private snackBar: MatSnackBar) {
    this.filtered_products = this.productCtrl.valueChanges
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


    this.taskService.getStationProductList(user.station).subscribe(data => {
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
      //this.partList = data.map(item => item.ID).filter((value, index, self) => self.indexOf(value) === index);
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

      //remove the check mark from container ID
      this.foundQR = false;
    });
  }

  createReqTask(form: NgForm) {
    this.isLoading = true;

    //If the request comes from the Punching Machine, the previous station is the warehouse!!
    if (this.user.station=="Punching Machine") {
      this.task.current_station = "Warehouse";
      this.task.next_station = this.user.station;
      this.task.container_id = Math.floor(Math.random() * 90000) + 10000;
      this.task.amount = 1;
      this.taskService.newTask(this.task);

      this.task = {product_id: '', current_station: '', container_id: '', amount: 0, next_station: ''};
      this.isLoading = false;
      let snackBarRef = this.snackBar.open("The task was successfully created!", "OK", {duration: 3000});
    }
    else {

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
            this.task = {product_id: '', current_station: '', container_id: '', amount: 0, next_station: ''};
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
  }

  onProductChange(productId: string) {
    this.isLoading = true;
    const parts = this.products.filter(element => element.Order == productId);
    this.partList = parts;
    this.isLoading = false;
  }

  onPartChange(partId: string, require = false) {

    (require) ? this.button_activeReq = false : this.button_active = false;

    if (partId.length > 3) {
      if (this.partList.find(o => o.ID == partId)) {
        (require) ? this.button_activeReq = true : this.button_active = true;
        this.task.product_id = partId;
      }
      else {
        this.productCtrl.reset();
        let snackBarRef = this.snackBar.open("The chosen part can't be in "+this.user.station,"OK", {duration: 3000});
      }
    }
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

  private _filterProducts(value: string): any[] {
    const filterValue = value.toString();

    return this.partList.filter(part => part.ID.toString().indexOf(filterValue) === 0);
  }
}
