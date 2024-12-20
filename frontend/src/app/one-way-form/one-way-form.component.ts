import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaxiBookingService } from '../services/taxi-booking.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'one-way-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaterialTimepickerModule],
  templateUrl: './one-way-form.component.html',
  styleUrl: './one-way-form.component.css'
})
export class OneWayComponent {
  form = {
    fullname: '',
    mobile: '',
    otp: '',
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
  duration:number = 0;
  fareVisible: boolean = false;
  selectedCab:string='';
  @Output() formSubmitted = new EventEmitter<void>();

  cabTypes = [
    { name: 'Sedan', betta: 400, icon1: 'assets/images/sedan_black.png', icon2: 'assets/images/sedan_yellow.png', img:'/assets/images/cab1.png', fare: 14 },
    { name: 'SUV', betta: 500, icon1: 'assets/images/suv_black.png', icon2: 'assets/images/suv_yellow.png', img:'/assets/images/cab2.png', fare: 19 },
    { name: 'Innova', betta: 500, icon1: 'assets/images/innova_black.png', icon2: 'assets/images/innova_yellow.png', img:'/assets/images/cab3.png', fare: 20 },
    { name: 'Innova-Crysta', betta: 600, icon1: 'assets/images/crysta_black.png', icon2: 'assets/images/crysta_yellow.png', img:'/assets/images/cab4.png', fare: 26 }
  ];

  constructor(private taxiBookingService: TaxiBookingService, private router: Router) { }

  selectCab(cab: any) {
    this.selectedCab = cab;
    this.form.cabType = cab;
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
    const { fullname, mobile, date, time, email, pickup, drop, cabType } = this.form;

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
      this.price = this.calculateTotalPrice(cabType);
      this.fareVisible = true;
      this.formSubmitted.emit();
      // this.notifyAdmin('enquiry');
    });
  }

  calculateTotalPrice(cab: any): number {
    const totalPrice = this.distance * cab.fare + cab.betta;
    this.price = totalPrice;
    return totalPrice;
  }
  

  bookCab(cabName: string) {
    this.form.cabType = cabName;
    alert(`You have selected ${cabName} cab.`);
    this.notifyAdmin('booking');
    this.notifyUser();
    window.location.reload();
  }

  notifyAdmin(type: string) {
    const { fullname, mobile, date, time, pickup, drop, cabType, email } = this.form;
    let message = '';
    if (type === 'booking') {
      message = 
    `Trip Type: One Way (Booking)\n` +
    `Customer Name: ${fullname}\n` +
    `Customer Contact: ${mobile}\n` +
    `Customer Email: ${email}\n` +
    `PickUp Location: ${pickup}\n` +
    `Drop Location: ${drop}\n` +
    `Booking Date: ${date}\n` +
    `Booking Time: ${time}\n` +
    `Cab Type: ${cabType}\n` +
    `Distance: ${this.distance} km\n` +
    `Duration: ${this.duration} km\n`

    } else if (type === 'enquiry') {
      message = 
    `Trip Type: One Way (Enquiry)\n` +
    `Customer Name: ${fullname}\n` +
    `Customer Contact: ${mobile}\n` +
    `Customer Email: ${email}\n` +
    `PickUp Location: ${pickup}\n` +
    `Drop Location: ${drop}\n` +
    `Booking Date: ${date}\n` +
    `Booking Time: ${time}\n` +
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
        
      }
    })
  }

  notifyUser() {
    const { fullname, date, time, pickup, drop, email, mobile, cabType } = this.form;
    const message = 
      `Welcome to Drop X Taxi\n\n` +
      `Booking Details(Confirmation):\n` +
      `Name: ${fullname}\n` +
      `Mobile No: ${mobile}\n` +
      `PickUp: ${pickup}\n` +
      `Drop: ${drop}\n` +
      `Date: ${date}\n` +
      `Time: ${time}\n` +
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

      }
    })

    const whatsappUrl = `https://wa.me/916382584853?text=${encodeURIComponent(whatsappmsg)}`;
    window.open(whatsappUrl, '_blank');
  }
}