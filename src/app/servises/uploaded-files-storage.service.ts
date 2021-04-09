import { Injectable } from '@angular/core';

@Injectable()
export class UploadedFilesStorageService {
  files:any= [];
  addFile(file: any, url: string, date: string): void{
    file.url = url;
    file.date = date;
    this.files.push(file);
  }
  deleteFile(id: string): void{
    this.files = this.files.filter(file => file.id !== id);
  }
}
