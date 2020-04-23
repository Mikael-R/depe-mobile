import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// @ts-ignore
import { IData } from 'interfaces/data.interface.ts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  private dataUrl = 'PeriodicTableJSON.json';

  constructor(private http: HttpClient) { }

  getData(): Observable<IData[]> {
    return this.http.get<IData[]>(this.dataUrl);
  }
}
