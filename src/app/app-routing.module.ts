import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StartComponent } from './start/start.component';
import { OperatorComponent } from './operator/operator.component';
import { ForkliftComponent } from './forklift/forklift.component';
import { AssemblyComponent } from './assembly/assembly.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { QrscannerComponent } from './qrscanner/qrscanner.component';

const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: '', component: StartComponent },
  { path: 'forklift', component: ForkliftComponent },
  { path: 'operator', component: OperatorComponent },
  { path: 'assembly', component: AssemblyComponent },
  { path: 'warehouse', component: WarehouseComponent },
  { path: 'supervisor', component: SupervisorComponent},
  { path: 'scan', component: QrscannerComponent}
  //{ path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
