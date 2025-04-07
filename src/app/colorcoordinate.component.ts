import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'color-coordinate',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './colorcoordinate.component.html',
    styleUrls: ['./colorcoordinate.component.css']
})
export class ColorCoordinateComponent {
    title = 'Color Coordinate page';
}
