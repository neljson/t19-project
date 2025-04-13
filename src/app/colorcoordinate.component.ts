import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'color-coordinate',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './colorcoordinate.component.html',
    styleUrls: ['./colorcoordinate.component.css']
})

//https://angular.dev/api/core/AfterViewInit#ngAfterViewInit
export class ColorCoordinateComponent {
    title = 'Color Coordinate page';
    
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            let rowInput: HTMLInputElement = document.getElementById('rows') as HTMLInputElement;
            let colInput: HTMLInputElement = document.getElementById('columns') as HTMLInputElement;

            rowInput.addEventListener('input', () => {
                const rowNum: number = parseInt(rowInput.value);
                if (rowNum < 1 || rowNum > 1000) {
                    throw new InputError('Row value must be between 1 and 1000');
                }
            });
            
            rowInput.addEventListener('input', () => {
                const colNum: number = parseInt(colInput.value);
                if (colNum < 1 || colNum > 1000) {
                    throw new InputError('Column value must be between 1 and 702');
                }
            });
        }
    }
}

class InputError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'InputError';
    }
  }

