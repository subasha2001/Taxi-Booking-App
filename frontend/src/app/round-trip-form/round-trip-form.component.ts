import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaxiBookingService } from '../services/taxi-booking.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'round-trip-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaterialTimepickerModule],
  templateUrl: './round-trip-form.component.html',
  styleUrl: './round-trip-form.component.css'
})
export class RoundTripComponent {
  form = {
    fullname: '',
    mobile: '',
    otp: '',
    pickup: '',
    drop: '',
    email: '',
    date: '',
    time: '',
    days:'',
    cabType: ''
  };

  pickupSuggestions: string[] = [];
  dropSuggestions: string[] = [];
  price: number | null = null;
  distance: number = 0;
  duration:number = 0;
  book: boolean = false;
  fareVisible: boolean = false;
  showCabDetails: boolean = true;
  selectedCab:string='';

  cabTypes = [
    { name: 'Sedan-Dzire', betta: 400, icon1: 'assets/images/sedan_black.png', icon2: 'assets/images/sedan_yellow.png', img:'/assets/images/cab1.png', fare: 13 },
    { name: 'SUV', betta: 500, icon1: 'assets/images/suv_black.png', icon2: 'assets/images/suv_yellow.png', img:'/assets/images/cab2.jpg', fare: 18 },
    { name: 'Innova', betta: 500, icon1: 'assets/images/innova_black.png', icon2: 'assets/images/innova_yellow.png', img:'/assets/images/cab3.png', fare: 19 },
    { name: 'Innova-Crysta', betta: 600, icon1: 'assets/images/crysta_black.png', icon2: 'assets/images/crysta_yellow.png', img:'/assets/images/cab4.jpg', fare: 23 }
  ];

  constructor(private taxiBookingService: TaxiBookingService) { }

  selectCab(cab: any) {
    this.selectedCab = cab;
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

  // sendOTP() {
  //   if (!this.form.mobile) {
  //     console.log('Please enter a valid mobile number');
  //     return;
  //   }

  //   this.taxiBookingService.sendOTP(this.form.mobile).subscribe((response) => {
  //     this.otpSent = true;
  //   })
  // }

  // verifyOTP() {
  //   if (!this.form.otp) {
  //     alert('Please enter the OTP');
  //     return;
  //   }

  //   const requestBody = {
  //     mobile: this.form.mobile,
  //     otp: this.form.otp,
  //   };

  //   this.taxiBookingService.verifyOTP(requestBody).subscribe(
  //     (response) => {
  //       if (response) {
  //         alert('OTP verified successfully!');
  //         this.otpVerified = true;
  //       } else {
  //         alert('Invalid OTP. Please try again.');
  //       }
  //     },
  //     (err: any) => {
  //       console.log(err);
  //       alert('Error verifying OTP: ' + err);
  //     }
  //   )
  // }

  viewPrice() {
    const { fullname, mobile, date, time, email, pickup, drop } = this.form;

    if (!fullname || !mobile || !date || !time || !email || !pickup || !drop) {
      alert('Please fill in all the required fields before viewing the fare.');
      return;
    }

    this.taxiBookingService.getDistance(pickup, drop).subscribe((response: any) => {
      const distanceInKm = response.distance;
      const duration = response.duration;
      if (distanceInKm < 130) {
        alert('Note: The minimum distance is 130 kms.');
      }
      this.distance = Math.max(distanceInKm, 130);
      this.duration = duration;
      this.fareVisible = true;
    });
  }

  showCabDetailsView() { this.showCabDetails = true }
  showTripDetailsView() { this.showCabDetails = false }

  calculateTotalPrice(cab: any): number {
    return this.distance * cab.fare + cab.betta;
  }

  getEstimate() {
    const { fullname, mobile, date, time, pickup, drop, email } = this.form;

    if (!fullname || !mobile || !date || !time || !pickup || !drop || !email) {
      alert('Please fill all the fields to get an estimate.');
      return;
    }
    this.taxiBookingService.getDistance(pickup, drop).subscribe((response: any) => {
      const distanceInKm = response.distance / 1000;
      if (distanceInKm < 250) {
        alert('Note: The minimum distance is 130 kms.');
      }
      this.distance = Math.max(distanceInKm, 130);
      this.price = this.distance * 10;
      this.notifyAdmin('enquiry');
    });
    this.book = true;
  }

  bookCab(cabName: string) {
    this.form.cabType = cabName;
    alert(`You have selected ${cabName} cab.`);
    this.notifyAdmin('booking');
    this.notifyUser();
    window.location.reload();
  }

  notifyAdmin(type: string) {
    const { fullname, mobile, date, days, time, pickup, drop, cabType } = this.form;
    let message = '';
    if (type === 'booking') {
      message = 
    `Trip Type: One Way (Booking)\n` +
    `Customer Name: ${fullname}\n` +
    `Customer Contact: ${mobile}\n` +
    `PickUp Location: ${pickup}\n` +
    `Drop Location: ${drop}\n` +
    `Booking Date: ${date}\n` +
    `Booking Time: ${time}\n` +
    `No Of Days: ${days}\n` +
    `Cab Type: ${cabType}\n` +
    `Distance: ${this.distance} km\n` +
    `Duration: ${this.duration} km\n` +
    `Total Fare: ₹${this.price}\n`

    } else if (type === 'enquiry') {
      message = 
    `Trip Type: One Way (Enquiry)\n` +
    `Customer Name: ${fullname}\n` +
    `Customer Contact: ${mobile}\n` +
    `PickUp Location: ${pickup}\n` +
    `Drop Location: ${drop}\n` +
    `Booking Date: ${date}\n` +
    `Booking Time: ${time}\n` +
    `No Of Days: ${days}\n` +
    `Cab Type: ${cabType}\n` +
    `Distance: ${this.distance} km\n` +
    `Total Fare: ₹${this.price}\n`
    }

    const requestBody = {
      to: 'whatsapp:+916382584853', // Admin's WhatsApp number
      message
    };

    this.taxiBookingService.sendAdmin(requestBody).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        alert('Error sending form: ' + error.message);
      }
    })
  }

  notifyUser() {
    const { fullname, date, time, pickup, days, drop, email, mobile, cabType } = this.form;
    const message = 
      `Welcome to Drop X Taxi\n\n` +
      `Booking Details(Confirmation):\n` +
      `Name: ${fullname}\n` +
      `Mobile No: ${mobile}\n` +
      `PickUp: ${pickup}\n` +
      `Drop: ${drop}\n` +
      `Date: ${date}\n` +
      `Time: ${time}\n` +
      `No Of Days: ${days}\n` +
      `Cab Type: ${cabType}\n` +
      `Trip Type: One Way\n` +
      `Distance: ${this.distance} km\n` +
      `Duration: ${this.duration}\n` +
      `Total Fare: ₹${this.price}\n` +
      `Extra Charges: Toll + Parking & permit + HillStation}\n\n` +
      `Customer Care: 8680080666\n\n` +
      `Thanks for choosing Drop X Taxi!\n` +
      `For more details, visit: https://dropxtaxi.com/`;

    const whatsappmsg =
      `Taxi Booking Details(Confirmation)\n\n` +
      `Hello! I have just booked a taxi with Dropxtaxi, and here are my booking details:\n\n` +
      `One Way(Confirmation)\n` +
      `My Name : ${fullname}\n` +
      `Contact Number : ${mobile}\n` +
      `Pickup Location : ${pickup}\n` +
      `Drop-off Location : ${drop}\n` +
      `Booking Date : ${date}\n` +
      `Booking Time : ${time}\n` +
      `Cabe Type : ${cabType}\n\n` +
      `Please confirm the booking and let me know if you need any further information. Looking forward to my ride!\n\n` +
      `Thank you!`

    const userRequestBody = {
      to: email,
      message
    };

    this.taxiBookingService.sendUser(userRequestBody).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        alert('Error sending form: ' + error.message);
      }
    })

    const whatsappUrl = `https://wa.me/916382584853?text=${encodeURIComponent(whatsappmsg)}`;
    window.open(whatsappUrl, '_blank');
  }
}