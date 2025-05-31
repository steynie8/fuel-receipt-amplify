import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @Input() selectedFile: File | null = null;
  @Input() uploadStatus: string = '';
  @Input() onFileSelectedInput!: (event: Event) => void;
  @Input() uploadFile!: () => void;
  @Input() theme: 'light' | 'dark' = 'dark';
  defaultImageSrc = 'assets/light-default-image.png';
  filePreviewUrl: string | null = null;
  isDragOver = false;
  dropIconSrc = 'assets/light-drop-icon.png';
  fileInputLabel: string = 'No file chosen';

  ngOnChanges() {
    this.setDefaultImageSrc(this.theme);
    this.setDropIconSrc(this.theme);
    this.updateFilePreviewUrl();
    this.updateFileInputLabel();
  }

  setDefaultImageSrc(theme: 'light' | 'dark') {
    this.defaultImageSrc = theme === 'light' ? 'assets/dark-default-image.png' : 'assets/light-default-image.png';
  }

  setDropIconSrc(theme: 'light' | 'dark') {
    this.dropIconSrc = theme === 'light' ? 'assets/dark-drop-icon.png' : 'assets/light-drop-icon.png';
  }

  isImage(file: File | null): boolean {
    if (!file) return false;
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
    return imageTypes.includes(file.type);
  }

  updateFilePreviewUrl() {
    if (this.selectedFile && this.isImage(this.selectedFile)) {
      this.filePreviewUrl = URL.createObjectURL(this.selectedFile);
    } else {
      this.filePreviewUrl = null;
    }
  }

  updateFileInputLabel() {
    if (this.selectedFile) {
      this.fileInputLabel = this.selectedFile.name;
    } else {
      this.fileInputLabel = 'No file chosen';
    }
  }

  // Optionally, clean up object URLs when component is destroyed
  ngOnDestroy() {
    if (this.filePreviewUrl) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
  }

  // Drag-and-drop logic
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      // Only accept images (optional: you can allow all files if desired)
      if (this.isImage(file)) {
        this.selectedFile = file;
        this.uploadStatus = '';
        this.updateFilePreviewUrl();
        this.updateFileInputLabel();
      } else {
        this.uploadStatus = 'Please drop a valid image file.';
      }
      event.dataTransfer.clearData();
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onFileSelected(event: Event) {
    if (this.onFileSelectedInput) {
      this.onFileSelectedInput(event);
    }
    this.updateFileInputLabel();
  }
}
