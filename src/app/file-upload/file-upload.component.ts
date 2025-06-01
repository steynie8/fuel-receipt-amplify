import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { uploadData } from '@aws-amplify/storage';

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
  @Input() theme: 'light' | 'dark' = 'dark';
  defaultImageSrc = 'assets/light-default-image.png';
  filePreviewUrl: string | null = null;
  isDragOver = false;
  dropIconSrc = 'assets/light-drop-icon.png';
  fileInputLabel: string = 'Browse files';

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
      this.fileInputLabel = 'Browse files';
    }
  }

  ngOnDestroy() {
    if (this.filePreviewUrl) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
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

  async uploadFile() {
    if (!this.selectedFile) {
      this.uploadStatus = 'No file selected.';
      return;
    }
    this.uploadStatus = 'Uploading...';
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.selectedFile);
    fileReader.onload = async (event) => {
      try {
        await uploadData({
          data: event.target?.result as ArrayBuffer,
          path: `incoming/${this.selectedFile!.name}`,
          options: {
            bucket: {
                bucketName: 'automated-fuel-receipts',
                region: 'eu-west-1'
            },
            contentType: this.selectedFile!.type
          }
        });
        this.uploadStatus = 'Upload successful!';
      } catch (error) {
        this.uploadStatus = 'Upload failed.';
        console.error('S3 upload error:', error);
      }
    };
    fileReader.onerror = () => {
      this.uploadStatus = 'File read failed.';
    };
  }

}
