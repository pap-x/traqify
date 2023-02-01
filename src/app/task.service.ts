import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  private klapper_server = "https://localhost:5000";
  private socket = io(this.klapper_server);

  getNextStation(id: string, current_station: string) {
    return this.http.get<{ next_station: string }>(
      this.klapper_server + '/next_station/' + id + '/' + current_station
    );
  }

  getProductList() {
    return this.http.get<{OM: string, ID: string, Order: string, DESCRIPCION: string}[]>(
      this.klapper_server + '/product_list'
    );
  }

  getStationProductList(station: string) {
    return this.http.get<any[]>(
      this.klapper_server + '/product_list/'+ station
    );
  }

  getAvailableStations(id: string) {
    return this.http.get<any>(
      this.klapper_server + '/available_stations/' + id
    );
  }

  getContainers() {
    return this.http.get<any>(
      this.klapper_server + '/containers'
    );
  }

  getContainer(id: string) {
    return this.http.get<any>(
      this.klapper_server + '/container/'+id
    );
  }

  newTask(data) {
    this.socket.emit('new_task', data);
  }

  newRequest(data) {
    this.socket.emit('new_request', data);
  }

  removeTask(data) {
    this.socket.emit('remove_task', data);
  }

  removeRequest(data) {
    this.socket.emit('remove_request', data);
  }

  newTaskReceived() {
    let observable = new Observable<{id: string, current_station: string, next_station: string, amount: number, container_id: string}>(observer=>{
      this.socket.on('new task', (data)=>{
          observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });

    return observable;
  }

  newRequestReceived() {
    let observable = new Observable<{product_id: string, amount: number}>(observer=>{
      this.socket.on('new request', (data)=>{
          observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });

    return observable;
  }

  //get current tasks without socket.io
  getCurrentTasks() {
    return this.http.get<any>(
      this.klapper_server + '/current_tasks'
    );
  }

  getCurrentRequests() {
    return this.http.get<any>(
      this.klapper_server + '/current_requests'
    );
  }

  getCurrentContainer(id: string) {
    return this.http.get<any>(
      this.klapper_server + '/current_container/' + id
    );
  }

  setCurrentStation(id: string, station: string) {
    return this.http.post<any>(
      this.klapper_server + '/current_station', {container_id: id, current_station: station}
    );
  }

  completedLandMech(completed_code: string) {
    return this.http.post<any>(
      this.klapper_server + '/completed', {code: completed_code}
    );
  }
}
