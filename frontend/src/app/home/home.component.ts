import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OneWayComponent } from "../one-way-form/one-way-form.component";
import { RoundTripComponent } from "../round-trip-form/round-trip-form.component";
import { TariffsComponent } from "../tarrifs/tarrifs.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, OneWayComponent, RoundTripComponent, TariffsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'

})
export class HomeComponent {
  isOneWay: boolean = true;
  showFormToggle: boolean = true;

  toggleForm(isOneWay: boolean) {
    this.isOneWay = isOneWay;
  }

  toggleDiv(isOneWay:boolean){
    this.showFormToggle = !isOneWay;
  }
}