import { isPlatformBrowser, NgIf, NgStyle } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableOneComponent } from './tableOne.component';
import { TableTwoComponent } from './tableTwo.component';
import { FormsModule } from '@angular/forms';
import { ColorCoordinateService } from './color-coordinate.service';

@Component({
    selector: 'color-coordinate',
    standalone: true,
    imports: [RouterOutlet, FormsModule, TableOneComponent, TableTwoComponent, NgIf, NgStyle],
    templateUrl: './colorcoordinate.component.html',
    styleUrls: ['./colorcoordinate.component.css']
})

//https://angular.dev/api/core/AfterViewInit#ngAfterViewInit
export class ColorCoordinateComponent implements OnInit {
    @ViewChild('tableTwoRef') tableTwoComponent!: TableTwoComponent;
    title = 'Color Coordinate page';
    allColors: string[] = [];
    constructor(@Inject(PLATFORM_ID) private platformId: Object, private colorCoordinateService: ColorCoordinateService) { }

    ngOnInit(): void {
        const stored = sessionStorage.getItem('sharedColorList');
        this.allColors = stored ? JSON.parse(stored) : [
            'red', 'orange', 'yellow', 'green', 'blue',
            'purple', 'grey', 'brown', 'black', 'teal'
        ];
    }
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

        }
    }


    tableData: number[] | null = null;

    formData = {
        rows: 1,
        columns: 1,
        colors: 1
    };

    submitForm(): void {
        this.colorCoordinateService.reset();

        this.tableData = [
            this.formData.rows,
            this.formData.columns,
            this.formData.colors
        ];
    }

    printPage(): void {
        window.print();
    }
}

class InputError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InputError';
    }
}
