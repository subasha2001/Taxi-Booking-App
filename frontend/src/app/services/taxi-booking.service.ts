import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxiBookingService {

  // private BaseUrl = 'https://dropxtaxi.com/api';
  private BaseUrl = 'http://localhost:3002/api';

  constructor(private http: HttpClient) {}

  sendOTP(Mobile:string){
    return this.http.post(this.BaseUrl + '/send-otp', { mobile: Mobile });
  }

  verifyOTP(body:any){
    return this.http.post(this.BaseUrl + '/verify-otp', body);
  }

  getAutocomplete(query: string): Observable<any> {
    return this.http.post(`${this.BaseUrl}/autocomplete`, { query });
  }

  getDistance(origin: string, destination: string): Observable<any> {
    return this.http.post(`${this.BaseUrl}/distance`, { origin, destination });
  }

  sendAdmin(data:any){
    return this.http.post(`${this.BaseUrl}/send-admin`, data)
  }

  sendUser(data:any){
    return this.http.post(`${this.BaseUrl}/send-user`, data)
  }

  sendMail(data:any){
    return this.http.post(`${this.BaseUrl}/send-email`, data)
  }

  sendTelegram(data:any){
    return this.http.post(`${this.BaseUrl}/sendToTelegram`, data)
  }
}