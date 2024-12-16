import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaxiBookingService } from '../services/taxi-booking.service';

@Component({
  selector: 'round-trip-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    days: '',
    cabType: ''
  };

  pickupSuggestions: string[] = [];
  dropSuggestions: string[] = [];
  price: number | null = null;
  distance: number = 0;

  cabTypes = [
    { name: 'Sedan Dzire', icon1: 'assets/images/sedan_yellow.png', icon2: 'assets/images/sedan_black.png', selected: false, fare: 14 },
    { name: 'SUV Xylo', icon1: 'assets/images/suv_yellow.png', icon2: 'assets/images/suv_black.png', selected: false, fare: 19 },
    { name: 'Innova', icon1: 'assets/images/sedan_yellow.png', icon2: 'assets/images/sedan_black.png', selected: false, fare: 20 },
    { name: 'Innova Crysta', icon1: 'assets/images/suv_yellow.png', icon2: 'assets/images/suv_black.png', selected: false, fare: 26 }
  ];

  constructor(private http: HttpClient, private taxiBookingService: TaxiBookingService) { }

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

  getEstimate() {
    const { fullname, mobile, date, time, pickup, drop, email, days } = this.form;

    if (!fullname || !mobile || !date || !time || !pickup || !drop || !email || !days) {
      alert('Please fill all the fields to get an estimate.');
      return;
    }
    this.taxiBookingService.getDistance(pickup, drop).subscribe((response: any) => {
      const distanceInKm = response.distance / 1000;
      if (distanceInKm < 250) {
        alert('Note: The minimum distance is 250 kms.');
        return;
      }
      this.distance = Math.max(distanceInKm, 250);
      this.price = this.distance * 10;
      this.notifyAdmin('enquiry');
    });
  }

  notifyAdmin(type: string) {
    const { fullname, mobile, date, time, pickup, drop, cabType, email, days } = this.form;
    let message = '';
    if (type === 'booking') {
      message =
        `Dear Admin,\n\n` +
        `Type: Round Trip (Booking)\n` +
        `A new taxi booking has been successfully placed🚖. Below are the booking details for your reference:\n\n` +
        `Customer Name: ${fullname}\n` +
        `Customer Contact: ${mobile}\n` +
        `Booking Date: ${date}\n` +
        `Booking Time: ${time}\n` +
        `PickUp location: ${pickup}\n` +
        `Drop location: ${drop}\n` +
        `No Of Days: ${days}\n` +
        `Distance: ${this.distance} km\n` +
        `Estimated Price: ₹${this.price}\n` +
        `Cab Type: ${cabType}`;

    } else if (type === 'enquiry') {
      message =
        `New Enquiry Received 🚨\n` +
        `Type: Round Trip (Enquiry)\n\n` +
        `Dear Admin,\n` +
        `A new enquiry has been submitted via the contact form. Below are the details for your review:\n\n` +
        `Name: ${fullname}\n` +
        `Email: ${email}\n` +
        `Phone: ${mobile}\n` +
        `PickUp: ${pickup}\n` +
        `Drop: ${drop}\n` +
        `No Of Days: ${days}\n` +
        `Cab Type: ${cabType}`;
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

  bookTaxi() {
    this.notifyAdmin('booking');
    this.notifyUser();
  }

  notifyUser() {
    const { fullname, date, time, pickup, drop, email, mobile, cabType, days } = this.form;
    const message =
      `Dear ${fullname},\n\n` +
      `Thank you for choosing Dropxtaxi🚖! We're delighted to confirm your taxi booking. Here are the details of your trip:\n` +
      `Round Trip(Confirmation)\n`+
      `Booking Date: ${date}\n` +
      `Booking Time: ${time}\n` +
      `PickUp location: ${pickup}\n` +
      `Drop location: ${drop}\n` +
      `No Of Days: ${days}\n` +
      `Distance: ${this.distance} km\n` +
      `Estimated Price: ₹${this.price}\n\n` +
      `Please be ready at the pickup location 5 minutes before your scheduled time.\n` +
      `If you need any assistance, feel free to contact our support team at 6382584853 or subashayyanar1@gmail.com.\n\n` +
      `We hope you enjoy a safe and comfortable journey!\n` +
      `Best regards,\n` +
      `Dropxtaxi\n` +
      `6382584853\n` +
      `www.dropxtaxi.com`;

    const whatsappmsg =
      `Taxi Booking Details\n\n` +
      `Hello! I have just booked a taxi with Dropxtaxi, and here are my booking details:\n\n` +
      `Round Trip(Confirmation)\n` +
      `My Name : ${fullname}\n` +
      `Contact Number : ${mobile}\n` +
      `Pickup Location : ${pickup}\n` +
      `Drop-off Location : ${drop}\n` +
      `NO Of Days : ${days}\n` +
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
