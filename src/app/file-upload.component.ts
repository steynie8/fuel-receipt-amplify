import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  template: `
    <div class="upload-container">
      <h2>Upload a File to S3</h2>
      <input type="file" (change)="onFileSelected($event)" />
      <button (click)="uploadFile()" [disabled]="!selectedFile">Add File</button>
      <div *ngIf="selectedFile" style="width: 100%;">
        <h3>Selected File:</h3>
        <div id="file-display"></div>
      </div>
      <div *ngIf="uploadStatus" class="upload-status">
        {{ uploadStatus }}
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class FileUploadComponent {
  @Input() selectedFile: File | null = null;
  @Input() uploadStatus: string = '';
  @Input() onFileSelected!: (event: Event) => void;
  @Input() uploadFile!: () => void;
}
