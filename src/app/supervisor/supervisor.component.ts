import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { StartService } from '../start.service';
import { NgForm, FormControl, Form } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent implements OnInit {

  user: any = {name: 'User', operation: 'Supervisor'};
  containers: any = [];
  products: any = [];
  productList: any = [];
  list_products: any = [];
  isLoading = false;
  partList: any = [];
  product_id: string = "";
  found_container: any = {};
  productCtrl = new FormControl;

  constructor(private taskService: TaskService, private startService: StartService) {
    this.list_products = this.productCtrl.valueChanges
    .pipe(
      startWith(''),
      map(part => part ? this._filterProducts(part) : this.partList.slice())
    );
  }

  ngOnInit() {
    this.taskService.getContainers().subscribe(data => {
      this.containers = [...data];
    });

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

  searchID() {
    this.taskService.getContainer(this.product_id).subscribe(data => {
      if (data[0]) {
        this.found_container = data[0];
      }
      else {
        this.found_container.current_station = "Product wasn't found in any station"
      }
    });
  }

  onPartChange(productId: string) {
    this.product_id = productId;
  }

  private _filterProducts(value: string): any[] {
    const filterValue = value.toString();

    return this.partList.filter(part => part.ID.toString().indexOf(filterValue) === 0);
  }
}
