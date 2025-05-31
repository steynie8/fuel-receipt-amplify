import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() themeChange = new EventEmitter<'light' | 'dark'>();
  @Input() signOut!: () => void;

  logoSrc = 'assets/light-logo.png';

  ngOnChanges() {
    this.setLogoSrc(this.theme);
  }

  setTheme(theme: 'light' | 'dark') {
    this.themeChange.emit(theme);
    this.setLogoSrc(theme);
  }

  setLogoSrc(theme: 'light' | 'dark') {
    this.logoSrc = theme === 'light' ? 'assets/dark-logo.png' : 'assets/light-logo.png';
  }
}
