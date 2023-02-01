import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatSelectModule,
  MatMenuModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule,
  MatDividerModule,
  MatSnackBarModule,
  MatAutocompleteModule
} from '@angular/material';
import { OperatorComponent } from './operator/operator.component';
import { ForkliftComponent } from './forklift/forklift.component';
import { AssemblyComponent } from './assembly/assembly.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { HttpClientModule } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrscannerComponent } from './qrscanner/qrscanner.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { Qrscanner2Component } from './qrscanner2/qrscanner2.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { FilterStationPipe } from './filterstation.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    OperatorComponent,
    ForkliftComponent,
    AssemblyComponent,
    WarehouseComponent,
    QrscannerComponent,
    Qrscanner2Component,
    SupervisorComponent,
    FilterStationPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    MatButtonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTabsModule,
    ZXingScannerModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    NgQrScannerModule,
    MatDividerModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
