import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() themeChange = new EventEmitter<'light' | 'dark'>();

  toggle() {
    this.themeChange.emit(this.theme === 'light' ? 'dark' : 'light');
  }
}
