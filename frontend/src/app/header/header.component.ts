import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  sideNavOpen = false; // State to toggle side navigation
  tickerMessage = 'Welcome to our Taxi Booking Service! Reliable and Fast!';

  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }
}