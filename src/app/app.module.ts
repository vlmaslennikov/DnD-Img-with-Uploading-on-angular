import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DragNDropDirective } from './directives/drag-n-drop.directive';
import { UploadedFilesStorageService } from './servises/uploaded-files-storage.service';
import { StageStorageService } from './servises/stage-storage.service';


@NgModule({
  declarations: [
    AppComponent,
    DragNDropDirective,
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    UploadedFilesStorageService,
    StageStorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
