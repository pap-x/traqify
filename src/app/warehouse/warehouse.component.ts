import { Component, OnInit } from '@angular/core';
import { StartService } from '../start.service';
import { TaskService } from '../task.service';
import { AgvService } from '../agv.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {

  user: any = {name: 'User', operation: 'Assembly Worker'};
  requests: any = [];

  constructor(private startService: StartService, private taskService: TaskService, private agvService: AgvService, private snackBar: MatSnackBar) {
    this.taskService.newRequestReceived().subscribe((data)=>{
      this.requests.push(data);
      console.log(this.requests);
    });

    this.taskService.getCurrentRequests().subscribe((data)=>{
      this.requests.push(...data);
    });
  }

  ngOnInit() {
    var user = this.startService.getUser();
    if (user) {
      this.user = user;
    }
  }

  completeRequest(index: number) {
    this.requests.splice(index, 1);
    this.taskService.removeRequest(index);
  }

  summonAGV() {
    this.agvService.summon().subscribe((data) => {
      console.log(data);
      let snackBarRef = this.snackBar.open(data.message, "OK", {duration: 3000});
    });
  }

  sendAGV() {
    this.agvService.send();
  }

}
