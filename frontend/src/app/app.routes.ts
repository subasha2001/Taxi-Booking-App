import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { GalleryComponent } from './gallery/gallery.component';
import { TaxiBookingService } from './services/taxi-booking.service';
import { TaxiServiceComponent } from './taxi-service/taxi-service.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path:'contact', component: ContactComponent},
    {path:'gallery', component: GalleryComponent},
    {path:'services', component: TaxiServiceComponent}
];