import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgForOf, TitleCasePipe, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorCoordinateService } from './color-coordinate.service';


@Component({
    selector: 'app-table1',
    standalone: true,
    imports: [NgForOf, FormsModule, TitleCasePipe, NgIf, NgStyle],
    templateUrl: './tableOne.component.html',
    styleUrls: ['./tableOne.component.css']
})
export class TableOneComponent implements OnChanges, OnInit {
    @Input() inputData!: number[]; // Will receive [rows, columns, colors] from parent component ColorCoordinate
    @Input() allColors: string[] = []; // Will receive the list of colors from parent component ColorCoordinate

    // Simulate user input — number of rows to create
    numberOfRows: number = 0;

    // A list that we'll use to build our rows
    rowsToDisplay: number[] = [];


    // Tracks the selected row index
    selectedRow: number | null = null;

    // Each row has a color and unique index
    rows: {
        index: number,
        selectedColor: string
    }[] = [];

    constructor(public colorCoordinateService: ColorCoordinateService) { }


    ngOnInit(): void {

        const stored = sessionStorage.getItem('sharedColorList');
        this.allColors = stored ? JSON.parse(stored) : [
            'red', 'orange', 'yellow', 'green', 'blue',
            'purple', 'grey', 'brown', 'black', 'teal'
        ];

        // Generate the row list of color drop down when the component is created
        this.createRowList(this.numberOfRows);
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['inputData'] && this.inputData?.length === 3) {
            this.numberOfRows = this.inputData[2];
            this.createRowList(this.numberOfRows);
        }
    }

    createRowList(count: number): void {
        this.selectedRow = null;
        this.colorCoordinateService.setColor('');

        this.rows = [];

        for (let i = 0; i < count; i++) {
            this.rows.push({
                index: i,
                selectedColor: this.allColors[i] // Default to a unique color
            });
        }

    }

    getAvailableColors(currentIndex: number): string[] {
        const selectedColors = this.rows
            .filter(row => row.index !== currentIndex)
            .map(row => row.selectedColor);

        return this.allColors.filter(color => !selectedColors.includes(color));
    }

    setSelectedRow(index: number): void {
        this.selectedRow = index;

        const selectedColor = this.rows[index].selectedColor;
        this.colorCoordinateService.setColor(selectedColor);
        this.colorCoordinateService.setTableOneRowIndex(index); // tracks active row
    }

    getRowIndex(): number {
        return this.selectedRow ?? -1; // Default to -1 if selectedRow is null
    }

    onColorChange(index: number, newColor: string): void {
        const row = this.rows[index];
        const oldColor = row.selectedColor;
        row.selectedColor = newColor;

        // Update only if this row has coordinates
        // const affectedCoords = this.colorCoordinateService.getCoordinatesForRow(index);
        this.colorCoordinateService.updateRowColor(index, newColor, oldColor);

        this.rows[index].selectedColor = newColor;

        if (this.selectedRow === index) {
            console.log('Selected row color changed:', newColor);
            this.colorCoordinateService.setColor(newColor);
        }
    }


}
