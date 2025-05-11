import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgIf, NgStyle, NgForOf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { wordToHexDictionary } from './wordToHexDictionary';

@Component({
  selector: 'app-color-selection',
  imports: [FormsModule, NgIf, NgStyle, NgForOf, TitleCasePipe],
  templateUrl: './color-selection.component.html',
  styleUrl: './color-selection.component.css'
})

export class ColorSelectionComponent implements OnInit {
  allColors: string[] = [];
  availableColors = Object.keys(wordToHexDictionary); // concert Dict to array of key names, where a key is a color name, ie "aliceblue"

  newColor: string = '';
  selectedEditColor: string = '';
  editColorValue: string = '';

  selectedDeleteColor: string | null = '';
  confirmingDelete = false;
  deleteError = false;

  ngOnInit(): void {
    const stored = sessionStorage.getItem('sharedColorList');
    if (stored) {
      this.allColors = JSON.parse(stored);
    }
  }

  private updateStorage(): void {
    sessionStorage.setItem('sharedColorList', JSON.stringify(this.allColors));
  }

  addColor(): void {
    if (this.newColor && !this.allColors.includes(this.newColor)) {
      this.allColors.push(this.newColor);
      this.updateStorage();
      this.newColor = '';
    }
  }


  getColorHex(name: string): string {
    this.newColor = name;
    return name;
  }


  editColor(): void {
    if (
      this.selectedEditColor &&
      this.editColorValue &&
      this.allColors.includes(this.selectedEditColor)
    ) {
      const index = this.allColors.indexOf(this.selectedEditColor);
      this.allColors[index] = this.editColorValue;
      this.updateStorage();

      // Reset form
      this.selectedEditColor = '';
      this.editColorValue = '';
    }
  }

  deleteColor(): void {
    if (this.allColors.length <= 2) {
      this.deleteError = true;
      this.confirmingDelete = false;
      return;
    }

    if (this.selectedDeleteColor) {
      this.allColors = this.allColors.filter(color => color !== this.selectedDeleteColor);
      this.updateStorage();

      // Reset state
      this.confirmingDelete = false;
      this.deleteError = false;
      this.selectedDeleteColor = null;
    }
  }
}
