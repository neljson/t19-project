import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgForOf, TitleCasePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-table2',
    standalone: true,
    imports: [NgForOf, FormsModule, TitleCasePipe, NgIf],
    templateUrl: './tableTwo.component.html',
    styleUrls: ['./tableTwo.component.css']
})
export class TableTwoComponent implements OnChanges {
    @Input() inputData!: number[]; // Will receive [rows, columns, colors]
    rowCount: number = 0;
    colCount: number = 0;
    rows: number[] = [];
    cols: string[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (this.inputData && this.inputData.length >= 2) {
            const [rows, columns] = this.inputData;

            this.rowCount = rows;
            this.colCount = columns;

            // Rows: 0 = header row, rows 1+ = data rows
            this.rows = Array.from({ length: rows + 1 }, (_, i) => i);

            // Columns: 0 = header column, columns 1+ = Excel letter headers
            this.cols = Array.from({ length: columns + 1 }, (_, i) =>
                i === 0 ? '' : this.columnName(i - 1)
            );
        }
    }

    private columnName(index: number): string {
        // Converts 0 → A, 1 → B, ..., 25 → Z, 26 → AA, ..., 701 → ZZ
        let name = '';
        while (index >= 0) {
            name = String.fromCharCode((index % 26) + 65) + name;
            index = Math.floor(index / 26) - 1;
        }
        console.log('Rows:', this.rows); // should be [0, 1, 2, ...]
        console.log('Cols:', this.cols); // should be ['', 'A', 'B', 'C', ...]

        return name;
    }

    selectedCell: string = ''; // Holds the selected cell label (e.g., "AB20")
    // Method to handle the cell click and update the selected cell message
    selectCell(rowIndex: number, colIndex: number): void {
        const colLabel = this.cols[colIndex];
        this.selectedCell = `${colLabel}${rowIndex}`; // Set message like "AB20"
    }

}