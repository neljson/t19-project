import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';
import { ColorCoordinateComponent } from './colorcoordinate.component';

export const routes: Routes = [
    { path: '', redirectTo: 'about', pathMatch: 'full' }, // default routes to About page
    { path: 'about', component: AboutComponent },
    { path: 'color-coordinate', component: ColorCoordinateComponent }
];
