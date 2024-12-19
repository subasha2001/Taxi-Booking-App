import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  sideNavOpen = false; // State to toggle side navigation
  tickerMessage = 'Welcome to Drop X Taxi | We have services all over South India | One Way trip, One way tariff | Your Journey Our Priority! | 8680080666';

  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }
}