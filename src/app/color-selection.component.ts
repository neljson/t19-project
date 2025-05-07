import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-color-selection',
  imports: [],
  templateUrl: './color-selection.component.html',
  styleUrl: './color-selection.component.css'
})
export class ColorSelectionComponent {
  newColor = { name: '', hex_value: '' };
  colors: any[] = [];

  constructor(private http: HttpClient) {}

  addColor() {
    this.http.post('https://cs.colostate.edu:4444/~your_eid/add_color.php', this.newColor)
      .subscribe((response: any) => {
        console.log('Color added: ', response);
        this.fetchColors();
      });
  }

  fetchColors() {
    this.http.get<any[]>('https://cs.colostate.edu:4444/~your_eid/get_colors.php')
      .subscribe((data: any) => this.colors = data);
  }

  selectedColor: any = null;

  editColor() {
    this.http.post('https://cs.colostate.edu:4444/~your_eid/add_color.php', this.selectedColor)
      .subscribe((response: any) => {
        console.log('Color updated:', response);
        this.fetchColors();
      });
  }
}
