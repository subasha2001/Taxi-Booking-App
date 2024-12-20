import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'tarrifs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarrifs.component.html',
  styleUrl: './tarrifs.component.css'
})
export class TariffsComponent {
  isOneWay: boolean = true;
  
  oneWayCabs = [
    { image: '/assets/images/cab1.png', name: 'Sedan', rsPerKm: 14, betta:400, waiting:150 },
    { image: '/assets/images/cab2.png', name: 'SUV', rsPerKm: 19, betta:500, waiting:200 },
    { image: '/assets/images/cab3.png', name: 'Innova', rsPerKm: 20, betta:500, waiting:200 },
    { image: '/assets/images/cab4.png', name: 'Innova Crysta', rsPerKm: 26, betta:600, waiting:250 }
  ];
  roundTripCabs = [
    { image: '/assets/images/cab1.png', name: 'Sedan', rsPerKm: 13, betta:400, waiting:150 },
    { image: '/assets/images/cab2.png', name: 'SUV', rsPerKm: 18, betta:500, waiting:200 },
    { image: '/assets/images/cab3.png', name: 'Innova', rsPerKm: 19, betta:500, waiting:200 },
    { image: '/assets/images/cab4.png', name: 'Innova Crysta', rsPerKm: 23, betta:400, waiting:250 }
  ];

  // Toggle between One Way and Round Trip
  toggleForm(isOneWay: boolean): void {
    this.isOneWay = isOneWay;
  }
}