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

    addCoordinateToRow(rowIndex: number, coordinate: string): void {
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

    updateColorForCells(oldColor: string, newColor: string, coordinates: string[]) {
        for (const coord of coordinates) {
            if (this.cellColors[coord] === oldColor) {
                console.log("updating color to :" + newColor + "for coord: " + coord);
                this.cellColors[coord] = newColor;
            }
        }
    }


}
