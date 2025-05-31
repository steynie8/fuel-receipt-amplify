import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { uploadData } from '@aws-amplify/storage';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { AppLogoComponent } from './app-logo/app-logo.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    AmplifyAuthenticatorModule,
    ThemeToggleComponent,
    AppLogoComponent,
    FileUploadComponent,
    NavBarComponent
  ],
})
export class AppComponent {
  title = 'amplify-angular-template';
  selectedFile: File | null = null;
  uploadStatus: string = '';
  theme: 'light' | 'dark' = 'dark';

  constructor(public authenticator: AuthenticatorService) {
    // Only call Amplify.configure once in the app's lifecycle
    // Amplify.configure(outputs);
    // Set initial theme to dark mode by default
    this.theme = 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadStatus = '';
      this.displayFile();
    }
  }

  displayFile() {
    if (!this.selectedFile) return;
    const file = this.selectedFile;
    const fileDisplay = document.getElementById('file-display');
    if (!fileDisplay) return;
    // Clear previous content
    fileDisplay.innerHTML = '';
    // Accept common image types: jpeg, png, gif, bmp, webp, svg, avif, tiff
    const imageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
      'image/avif',
      'image/tiff',
    ];
    if (imageTypes.includes(file.type)) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = '400px';
      img.style.maxHeight = '400px';
      img.style.display = 'block';
      img.style.margin = '0 auto';
      fileDisplay.appendChild(img);
    } else {
      const p = document.createElement('p');
      p.textContent = file.name;
      p.style.textAlign = 'center';
      fileDisplay.appendChild(p);
    }
  }

  async uploadFile() {
    if (!this.selectedFile) return;
    this.uploadStatus = 'Uploading...';
    try {
      const result = await uploadData({
        key: this.selectedFile.name,
        data: this.selectedFile,
      });
      this.uploadStatus = 'Upload successful!';
    } catch (error) {
      this.uploadStatus = 'Upload failed.';
      console.error('S3 upload error:', error);
    }
  }
}
