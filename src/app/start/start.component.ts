import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StartService } from '../start.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  operator: any = {name: '', operation: '', station: ''};
  operation_types: string[] = ['Forklift Driver', 'Station Operator', 'Warehouse Worker', 'Supervisor'];
  stations: string[] = ['Punching Machine', 'Cleaning Station', 'Bending Machine', 'Painting Line', 'Assembly Line'];

  constructor( private router: Router, private startservice: StartService ) { }

  ngOnInit() {
  }

  proceed() {
    if (this.operator.station != 'Assembly Line') {
      switch (this.operator.operation) {
        case 'Forklift Driver':
          this.router.navigate(['/forklift']);
          break;
        case 'Station Operator':
          this.router.navigate(['/operator']);
          break;
        case 'Assembly Worker':
          this.router.navigate(['/assembly']);
          break;
        case 'Warehouse Worker':
          this.router.navigate(['/warehouse']);
          break;
        case 'Supervisor':
          this.router.navigate(['/supervisor']);
          break;
      }
    }
    else {
      this.router.navigate(['/assembly']);
    }
  }

  ngOnDestroy() {
    this.startservice.user = this.operator;
    localStorage.setItem('operator', JSON.stringify(this.operator));
  }
}
