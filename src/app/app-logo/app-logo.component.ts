import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './app-logo.component.html',
  styleUrls: ['./app-logo.component.css']
})
export class AppLogoComponent implements OnChanges {
  @Input() theme: 'light' | 'dark' = 'dark';
  logoSrc = 'assets/light-logo.png';

  ngOnChanges() {
    this.setLogoSrc(this.theme);
  }

  setLogoSrc(theme: 'light' | 'dark') {
    this.logoSrc = theme === 'light' ? 'assets/dark-logo.png' : 'assets/light-logo.png';
  }
}
