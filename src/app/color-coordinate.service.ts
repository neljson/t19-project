// This service shares the color state across TableOne and TableTwo components
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ColorCoordinateService {
    private currentColor: string = '';
    // sets initial index to nothing selected
    private selectedRowIndex: number = -1;
    private rowCoordinates: { [rowIndex: number]: string[] } = {};
    // tracks TableTwo cell colors
    private cellColors: { [key: string]: string } = {};

    // clears state when user triggers new renders of table one and two
    reset(): void {
        this.cellColors = {};
        this.rowCoordinates = {};
        this.currentColor = '';
        this.selectedRowIndex = -1;
    }


    addCoordinateToRow(rowIndex: number, coordinate: string): void {

        // Remove the coordinate from all other rows, no two rows can have the same coordinate
        for (const [key, coords] of Object.entries(this.rowCoordinates)) {
            const idx = coords.indexOf(coordinate);
            if (idx !== -1) {
                coords.splice(idx, 1);
            }
        }
        // Check if the row index exists in the object, if not, initialize it   
        if (!this.rowCoordinates[rowIndex]) {
            this.rowCoordinates[rowIndex] = [];
        }
        // Check if the coordinate already exists in the row, don't push duplicates
        if (!this.rowCoordinates[rowIndex].includes(coordinate)) {
            this.rowCoordinates[rowIndex].push(coordinate);
        }
    }

    getCoordinatesForRow(rowIndex: number): string[] {
        return this.rowCoordinates[rowIndex] || [];
    }

    // tracks which row in TableOne is active
    setTableOneRowIndex(index: number): void {
        this.selectedRowIndex = index;
    }

    getTableOneRowIndex(): number {
        return this.selectedRowIndex;
    }

    setColor(color: string) {
        this.currentColor = color;
    }

    getColor(): string {
        return this.currentColor;
    }

    setCellColor(cell: string, color: string) {
        this.cellColors[cell] = color;
    }


    getCellColor(cell: string): string | undefined {
        return this.cellColors[cell];
    }

    updateRowColor(rowIndex: number, newColor: string, oldColor: string): void {
        console.log('Updating row color for row:', rowIndex, 'to color:', newColor);
        const coordinatesArray = this.rowCoordinates[rowIndex] || [];
        console.table("array: " + coordinatesArray)

        for (const coordinates of coordinatesArray) {
            const normalizedCoordinates = this.convertAlphaCoordToIndex(coordinates);
            console.log(`Updating ${normalizedCoordinates} to ${newColor}`);
            console.log("coordinates: " + coordinates + " normalized: " + normalizedCoordinates)
            this.cellColors[normalizedCoordinates] = newColor;
        }
        console.table(this.cellColors);
    }

    private convertAlphaCoordToIndex(cell: string): string {
        const match = cell.match(/^([A-Z]+)(\d+)$/i);
        if (!match) return cell; // fallback if already in 'row,col' format

        const [, colLetters, rowStr] = match;
        const row = parseInt(rowStr, 10);

        // Convert A = 0, B = 1, ..., AA = 26, etc.
        let col = 0;
        for (let i = 0; i < colLetters.length; i++) {
            col *= 26;
            col += colLetters.charCodeAt(i) - 65 + 1;
        }

        return `${row},${col}`;
    }



}
