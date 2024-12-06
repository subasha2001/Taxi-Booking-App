import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxiBookingService {

  private apiUrl = 'http://localhost:5000'; // Backend URL

  constructor(private http: HttpClient) {}

  getAutocomplete(query: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/autocomplete`, { query });
  }

  getDistance(origin: string, destination: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/distance`, { origin, destination });
  }
}