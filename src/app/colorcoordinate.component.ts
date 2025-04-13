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
            let colorInput: HTMLInputElement = document.getElementById('color') as HTMLInputElement;

            const error = document.getElementById('error') as HTMLDivElement;

            const handleInputError = (fn: () => void) => {
                try {
                    fn();
                    error.textContent = '';
                } catch (err) {
                    if (err instanceof InputError) {
                        error.textContent = err.message;
                    } else {
                        console.error(err);
                    }
                }
            };

            rowInput.addEventListener('input', () => {
                handleInputError(() => {
                    const rowNum: number = parseInt(rowInput.value);
                    if (!Number.isInteger(rowNum) || rowNum < 1 || rowNum > 1000) {
                        throw new InputError('Row value must be between 1 and 1000');
                    }
                });
            });
            
            colInput.addEventListener('input', () => {
                handleInputError(() => {
                    const colNum: number = parseInt(colInput.value);
                    if (!Number.isInteger(colNum) || colNum < 1 || colNum > 702) {
                        throw new InputError('Column value must be between 1 and 702');
                    }
                });
            });

            colorInput.addEventListener('input', () => {
                handleInputError(() => { 
                    const colorNum: number = parseInt(colorInput.value);
                    if (!Number.isInteger(colorNum) || colorNum < 1 || colorNum > 10) {
                        throw new InputError('Color value must be between 1 and 10');
                    }
                });
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

