import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'about',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']

})
export class AboutComponent {
    title = 'About page';
}
