import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Martyr } from 'src/app/_models/Martyr';
import { environment } from 'src/environments/environment';
import { Region } from 'src/app/_models/Region';
import { File } from 'src/app/_models/File';

@Injectable({
  providedIn: 'root'
})
export class MartyrService {

  constructor(
    private http: HttpClient
  ) { }


  // submit Martyr service
  setMartyr(martyr: Martyr): Observable<any> {
    return this.http.post<any>(`${environment.baseApiUrl}form`, martyr);
  }

  // get regions
  getRegions(): Observable<any> {
    return this.http.get<any>(`${environment.baseApiUrl}form`);
  }

  // upload file
  uploadFile(file: any): Observable<File> {
    return this.http.post<File>(`${environment.baseApiUrl}file/photo`, file);
  }
}
