import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaxiBookingService } from '../services/taxi-booking.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker/public_api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  form = {
    fullname: '',
    mobile: '',
    pickup: '',
    drop: '',
    email: '',
    date: '',
    time: '',
    cabType: ''
  };

  pickupSuggestions: string[] = [];
  dropSuggestions: string[] = [];
  price: number | null = null;
  distance: number = 0;

  cabTypes = [
    { name: 'Sedan', icon1: 'assets/images/sedan_yellow.png', icon2: 'assets/images/sedan_black.png', selected: false },
    { name: 'Suv', icon1: 'assets/images/suv_yellow.png', icon2: 'assets/images/suv_black.png', selected: false },
    { name: 'Innova', icon1: 'assets/images/sedan_yellow.png', icon2: 'assets/images/sedan_black.png', selected: false },
    { name: 'Innova Crysta', icon1: 'assets/images/suv_yellow.png', icon2: 'assets/images/suv_black.png', selected: false }
  ];

  constructor(private http: HttpClient, private taxiBookingService: TaxiBookingService) {

  }

  selectCabType(cab: any) {
    this.cabTypes.forEach(c => c.selected = false);
    cab.selected = true;
    this.form.cabType = cab.name;
  }

  onLocationInput(type: string, event: any) {
    const query = event.target.value;
    this.taxiBookingService.getAutocomplete(query).subscribe((response: any) => {
      const suggestions = response.predictions.map((prediction: any) => prediction.description);
      if (type === 'pickup') {
        this.pickupSuggestions = suggestions;
      } else if (type === 'drop') {
        this.dropSuggestions = suggestions;
      }
    });
  }

  selectLocation(type: string, location: string) {
    if (type === 'pickup') this.form.pickup = location;
    if (type === 'drop') this.form.drop = location;
    this.pickupSuggestions = [];
    this.dropSuggestions = [];
  }

  getEstimate() {
    const { pickup, drop } = this.form;
    this.taxiBookingService.getDistance(pickup, drop).subscribe((response: any) => {
      const distanceInKm = response.distance / 1000;
      this.distance = distanceInKm;
      this.price = distanceInKm * 10;
      this.notifyAdmin('estimate');
    });
  }

  bookTaxi() {
    this.notifyAdmin('book');
    this.notifyUser();
  }

  notifyAdmin(type: string) {
    const message = type === 'estimate'
      ? `Estimate Request: ${JSON.stringify(this.form)}`
      : `Booking Request: ${JSON.stringify(this.form)}`;

    const requestBody = {
      to: 'whatsapp:+919363764940', // Admin's WhatsApp number
      message: message
    };

    // `whatsapp:${this.phoneNumber}`

    this.http.post('http://localhost:5000/send-whatsapp', requestBody).subscribe(
      (response: any) => {
        console.log('WhatsApp message sent successfully:', response);
      },
      (error: any) => {
        console.error('Error sending WhatsApp message:', error);
      }
    );
  }

  notifyUser() {
    const message = `Thank you for booking with us! Details: ${JSON.stringify(this.form)}`;
    this.http.post(`https://api.whatsapp.com/send?phone=${this.form.mobile}&text=${message}`, {}).subscribe();
  }
}