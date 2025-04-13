import { Component } from '@angular/core';
import { NgForOf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-table1',
    standalone: true,
    imports: [NgForOf, FormsModule, TitleCasePipe],
    templateUrl: './tableOne.component.html',
    styleUrls: ['./tableOne.component.css']
})
export class TableOneComponent {
    // Simulate user input — number of rows to create
    numberOfRows: number = 4;

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

    /**
  * Creates an array of numbers starting from 0 up to (but not including) the number passed in
  * If numberOfRows = 4 → creates [0, 1, 2, 3]
  */
    createRowList(count: number): void {
        // const rowList: number[] = [];

        // for (let i = 0; i < count; i++) {
        //     rowList.push(i); // Add each number to the list
        // }

        // this.rowsToDisplay = rowList;

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
