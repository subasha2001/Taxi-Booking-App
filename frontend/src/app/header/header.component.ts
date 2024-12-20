import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  sideNavOpen = false;
  newsItems:string[] = [
    'Welcome to Drop X Taxi!',
    'We have services in Tamil Nadu, Pondichery, Karnataka, Kerala, Andhra Pradesh and Telengana',
    'One Way trip, One way tariff!',
    'We have experienced drivers',
    'Neat and Clean Cabs',
    'All Over South India Available',
    '24x7 Taxi Service Available',
    'Your Journey Our Priority',
    'www.dropxtaxi.com',
    'Call - 8680080666'
  ]
  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }
  closeSideNav(): void {
    this.sideNavOpen = false;
  }
}