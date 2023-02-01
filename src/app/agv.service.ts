import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AgvService {

  constructor(private http: HttpClient) { }

  summon() {
    return this.http.get<any>(
      "https://localhost:4040/summon"
    );
  }

  send() {
    this.http.get<any>(
      "https://localhost:4040/send"
    ).subscribe((data) => {console.log(data); });

  }

  unloadedAgv() {
    this.http.get<any>(
      "https://localhost:4040/unload"
    ).subscribe((data)=>{console.log(data); });
  }

  counter() {
    this.http.get<any>(
      "https://localhost:4040/counter"
    ).subscribe((data)=>{ console.log(data);});
  }

}
