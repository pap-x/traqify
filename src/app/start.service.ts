import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class StartService {
  public user: any;
  public station: any;

  constructor() { }

  getUser() {
    var user = localStorage.getItem('operator');
    if (user) {
      this.user = JSON.parse(user);
    }
    return this.user;
  }
}
