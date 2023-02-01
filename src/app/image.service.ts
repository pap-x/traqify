import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  private image_server = "https://localhost:4000";

  uploadImage(image: File): Observable<any> {

    const formData = new FormData();

    formData.append('image', image);

    return this.http.post(this.image_server + '/scan_qr', formData);
  }
}
