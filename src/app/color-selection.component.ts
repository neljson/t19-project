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
  editColorNewName: string = '';
  editColorNewHex: string = '';
  editError: string = '';

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

  addColor(): void {
    this.addError = ''; // Reset error message each time add is attempted
    const selectedNameFromDropdown = this.newColorName?.trim();
    const enteredHex = this.customHexInput?.trim().toUpperCase(); // Normalize hex to uppercase for lookup and validation
    const hexPattern = /^#([0-9A-F]{6}|[0-9A-F]{3})$/; // Stricter hex pattern

    let colorNameToAdd: string | null = null;

    if (selectedNameFromDropdown && enteredHex) {
      this.addError = "Please select a color name OR enter a hex code, not both.";
      return;
    }
    if (!selectedNameFromDropdown && !enteredHex) {
      this.addError = "Please select a color name or enter a hex code to add.";
      return;
    }

    if (selectedNameFromDropdown) {
      colorNameToAdd = selectedNameFromDropdown;
    } else if (enteredHex) {
      if (!hexPattern.test(enteredHex)) {
        this.addError = `Invalid hex code format: "${this.customHexInput}". Please use #RRGGBB or #RGB.`;
        return;
      }
    
      const nameFromHex = this.hexToNameMap[enteredHex]; // Use the reverse map
      if (nameFromHex) {
        colorNameToAdd = nameFromHex;
      } else {
        this.addError = `The hex code "${this.customHexInput}" does not have a corresponding name in the dictionary.`;
        return;
      }
    }

    // add to allColors arry (if valid and not duplicate)
    if (colorNameToAdd) {
      // no duplicates check (against the determined color name)
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

  // Gets the hex value for the current valid input (either name or hex) for preview
  getPreviewHex(): string {
    const hexPattern = /^#([0-9A-F]{6}|[0-9A-Fa-f]{3})$/i; // Case-insensitive for preview
    const lowerCaseName = this.newColorName?.toLowerCase();

    // If a name is selected and valid
    if (lowerCaseName && this.availableColors.includes(lowerCaseName)) {
      return wordToHexDictionary[lowerCaseName as keyof typeof wordToHexDictionary];
    }
    // Else if a hex is entered and valid (this is the key part for hex preview)
    else if (this.customHexInput && hexPattern.test(this.customHexInput)) {
      return this.customHexInput; // Directly return the valid hex string for styling
    }
    return ''; // No valid input for preview
  }


  getColorHex(name: string): string {
    this.newColor = name;
    return name;
  }

  onEditNameSelected(): void {
    // If a new name is selected for editing, clear the new hex input and any edit errors
    if (this.editColorNewName) {
      this.editColorNewHex = '';
      this.editError = '';
    }
  }

  onEditHexInput(): void {
    // If user types in the new hex input for editing, clear the new name selection and any edit errors
    if (this.editColorNewHex) {
      this.editColorNewName = '';
      this.editError = '';
    }
  }

  getEditPreviewHex(): string {
    const hexPattern = /^#([0-9A-F]{6}|[0-9A-Fa-f]{3})$/i;
    const lowerCaseNewName = this.editColorNewName?.toLowerCase();

    // If a new name is selected for editing and it's valid
    if (lowerCaseNewName && this.availableColors.includes(lowerCaseNewName)) {
      return wordToHexDictionary[lowerCaseNewName as keyof typeof wordToHexDictionary];
    }
    // Else if a new hex is entered for editing and it's valid
    else if (this.editColorNewHex && hexPattern.test(this.editColorNewHex)) {
      return this.editColorNewHex; // Directly return the valid hex string
    }
    return ''; // No valid input for edit preview
  }

  editColor(): void {
    this.editError = ''; // Reset edit error

    if (!this.selectedEditColor) {
      this.editError = "Please select a color to edit first.";
      return;
    }

    const originalName = this.selectedEditColor;
    const newNameFromDropdown = this.editColorNewName?.trim();
    const newHexFromInput = this.editColorNewHex?.trim().toUpperCase();
    const hexPattern = /^#([0-9A-F]{6}|[0-9A-F]{3})$/;

    let determinedNewName: string | null = null;

    if (newNameFromDropdown && newHexFromInput) {
      this.editError = "Please provide the new color by selecting a name OR entering a hex code, not both.";
      return;
    }
    if (!newNameFromDropdown && !newHexFromInput) {
      this.editError = "Please provide a new name or a new hex code for the color.";
      return;
    }

    if (newNameFromDropdown) {
      determinedNewName = newNameFromDropdown;
    } else if (newHexFromInput) {
      if (!hexPattern.test(newHexFromInput)) {
        this.editError = `Invalid new hex code format: "${this.editColorNewHex}". Please use #RRGGBB or #RGB.`;
        return;
      }
      // Convert hex to name using the dictionary
      const nameFromHex = this.hexToNameMap[newHexFromInput];
      if (nameFromHex) {
        determinedNewName = nameFromHex;
      } else {
        this.editError = `The new hex code "${this.editColorNewHex}" does not have a corresponding name in our dictionary.`;
        return;
      }
    }

    if (determinedNewName) {
      // Check if the determined new name already exists in allColors,
      // unless it's the same as the original color name (meaning no effective change of name, or changing to self)
      // or if the determinedNewName is the same as the name it would resolve to if the originalName was a hex.
      if (this.allColors.includes(determinedNewName) && determinedNewName !== originalName) {
         // Further check: if originalName was a hex in allColors (which it shouldn't be, but as a safeguard)
         // and determinedNewName is its actual name, that's fine.
         // However, allColors should only contain names. So, this mainly checks if determinedNewName is another *different* existing color.
        this.editError = `The color name "${determinedNewName}" (derived from your input) already exists in the list.`;
        return;
      }

      const index = this.allColors.indexOf(originalName);
      if (index > -1) {
        this.allColors[index] = determinedNewName;
        this.updateStorage(); // This also sorts
        // Reset form
        this.selectedEditColor = '';
        this.editColorNewName = '';
        this.editColorNewHex = '';
        this.editError = '';
      } else {
        this.editError = `Error: The original color "${originalName}" was not found in the list.`; // Should not happen
      }
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
