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
  newColorName: string = '';
  newColorHex: string = '';
  addError: string = '';  
  customHexInput: string = '';


  private hexToNameMap: { [hex: string]: string } = {};

  ngOnInit(): void {
    this.buildHexToNameMap(); // Create the reverse map on initialization
    const stored = sessionStorage.getItem('sharedColorList');
    if (stored) {
      this.allColors = JSON.parse(stored);
    } else {
      this.allColors = [
        'red', 'orange', 'yellow', 'green', 'blue',
        'purple', 'grey', 'brown', 'black', 'teal'
      ];
      this.updateStorage(); // Important to store defaults if nothing was there
    }
  }

  private buildHexToNameMap(): void {
    for (const name in wordToHexDictionary) {
      if (Object.prototype.hasOwnProperty.call(wordToHexDictionary, name)) {
        const hex = wordToHexDictionary[name as keyof typeof wordToHexDictionary].toUpperCase();
        this.hexToNameMap[hex] = name;
      }
    }
  }

  private updateStorage(): void {
    sessionStorage.setItem('sharedColorList', JSON.stringify(this.allColors.sort())); // Store sorted
  }

  // --- ADD COLOR LOGIC ---
  addColor(): void {
    this.addError = ''; // Reset error message each time add is attempted
    const selectedNameFromDropdown = this.newColorName?.trim();
    const enteredHex = this.customHexInput?.trim().toUpperCase(); // Normalize hex to uppercase for lookup and validation
    const hexPattern = /^#([0-9A-F]{6}|[0-9A-F]{3})$/; // Stricter hex pattern

    let colorNameToAdd: string | null = null;

    // 1. MUTUALLY EXCLUSIVE INPUT VALIDATION
    if (selectedNameFromDropdown && enteredHex) {
      this.addError = "Please select a color name OR enter a hex code, not both.";
      return;
    }
    if (!selectedNameFromDropdown && !enteredHex) {
      this.addError = "Please select a color name or enter a hex code to add.";
      return;
    }

    // DETERMINE THE COLOR NAME TO ADD
    if (selectedNameFromDropdown) {
      colorNameToAdd = selectedNameFromDropdown;
    } else if (enteredHex) {
      if (!hexPattern.test(enteredHex)) {
        this.addError = `Invalid hex code format: "${this.customHexInput}". Please use #RRGGBB or #RGB.`;
        return;
      }
      // 2. HEX TO NAME CONVERSION
      const nameFromHex = this.hexToNameMap[enteredHex]; // Use the reverse map
      if (nameFromHex) {
        colorNameToAdd = nameFromHex;
      } else {
        this.addError = `The hex code "${this.customHexInput}" does not have a corresponding name in the dictionary.`;
        return;
      }
    }

    // 3. add to allColors arry (if valid and not duplicate)
    if (colorNameToAdd) {
      // 4. no duplicates check (against the determined color name)
      if (this.allColors.includes(colorNameToAdd)) {
        this.addError = `The color "${colorNameToAdd}" already exists in the list.`;
      } else {
        this.allColors.push(colorNameToAdd);
        this.updateStorage(); // This now also sorts
        // Reset inputs for the next entry
        this.newColorName = '';
        this.customHexInput = '';
      }
    } else {
      // This case should ideally not be reached if logic above is correct
      this.addError = "Could not determine a color to add. Please try again.";
    }
  }

  // --- INPUT INTERACTION HANDLERS ---
  onNameDropdownChange(): void {
    // If a name is selected from the dropdown, clear the hex input and any errors
    if (this.newColorName) {
      this.customHexInput = '';
      this.addError = '';
    }
  }

  onHexInputChange(): void {
    // If user types in the hex input, clear the name dropdown selection and any errors
    if (this.customHexInput) {
      this.newColorName = '';
      this.addError = '';
    }
  }

  // --- COLOR PREVIEW LOGIC ---
  // Gets the hex value for the current valid input (either name or hex) for preview
  getPreviewHex(): string {
    const hexPattern = /^#([0-9A-F]{6}|[0-9A-Fa-f]{3})$/i;
    const lowerCaseName = this.newColorName?.toLowerCase(); // Use optional chaining for safety

    // Check if the lowerCaseName is a valid key from our dictionary
    if (lowerCaseName && this.availableColors.includes(lowerCaseName)) {
      // If it's a valid key, we can safely access the dictionary.
      // The 'as keyof typeof wordToHexDictionary' cast tells TypeScript
      // that we've confirmed 'lowerCaseName' is a valid key.
      return wordToHexDictionary[lowerCaseName as keyof typeof wordToHexDictionary];
    } else if (this.customHexInput && hexPattern.test(this.customHexInput)) {
      return this.customHexInput;
    }
    return ''; // Return empty string if no valid color for preview
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
