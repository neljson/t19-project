import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgForOf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-table1',
    standalone: true,
    imports: [NgForOf, FormsModule, TitleCasePipe],
    templateUrl: './tableOne.component.html',
    styleUrls: ['./tableOne.component.css']
})
export class TableOneComponent implements OnChanges {
    @Input() inputData!: number[]; // Will receive [rows, columns, colors]

    // Simulate user input — number of rows to create
    numberOfRows: number = 0;

    // A list that we'll use to build our rows
    rowsToDisplay: number[] = [];

    allColors: string[] = [
        'red', 'orange', 'yellow', 'green', 'blue',
        'purple', 'grey', 'brown', 'black', 'teal'
    ];

    // Tracks the selected row index
    selectedRow: number | null = null;

    // Each row has a color and unique index
    rows: { index: number, selectedColor: string }[] = [];

    constructor() {
        // Generate the row list when the component is created
        this.createRowList(this.numberOfRows);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['inputData'] && this.inputData?.length === 3) {
            this.numberOfRows = this.inputData[2];
            this.createRowList(this.numberOfRows);
        }
    }

    createRowList(count: number): void {

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
    }

    onColorChange(index: number, newColor: string): void {
        this.rows[index].selectedColor = newColor;
    }
}
