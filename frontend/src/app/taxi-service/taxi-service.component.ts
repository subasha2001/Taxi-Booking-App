import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-taxi-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taxi-service.component.html',
  styleUrl: './taxi-service.component.css'
})
export class TaxiServiceComponent {
  services = [
    {
      name: 'Airport Pickup and Drop',
      image: 'assets/images/airport-pickup.jpg'
    },
    {
      name: 'Outstation Travel',
      image: 'assets/images/outstation-travel.jpg'
    },
    {
      name: 'Pick and Drop location is of your choice',
      image: 'assets/images/hourly-rentals.jpg'
    },
    {
      name: '24x7 service available',
      image: 'assets/images/wedding-transport.jpg'
    },
    {
      name: 'Service across TN, Pondicherry, Telengana, Andhra Pradesh, Karnataka, Kerala',
      image: 'assets/images/corporate-booking.jpg'
    },
    {
      name: 'Transparent and Reasonable Pricing',
      image: 'assets/images/corporate-booking.jpg'
    }
  ];
}
