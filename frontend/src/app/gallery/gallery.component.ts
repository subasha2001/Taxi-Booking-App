import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  places = [
    { name: 'Andhra Pradesh', imageUrl: 'assets/images/gallery/andra.jpg' },
    { name: 'Chennai', imageUrl: 'assets/images/gallery/egmore.jpeg' },
    { name: 'Karnataka', imageUrl: 'assets/images/gallery/karnataka.jpg' },
    { name: 'Kerala', imageUrl: 'assets/images/gallery/kerala.jpg' },
    { name: 'Pondicherry', imageUrl: 'assets/images/gallery/pondy.jpg' },
    { name: 'Telengana', imageUrl: 'assets/images/gallery/telengana.jpg' },
  ];
}