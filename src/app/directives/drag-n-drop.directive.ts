import {Directive, ElementRef, Renderer2, Input, HostListener, OnChanges} from '@angular/core';
import { UploadedFilesStorageService } from '../servises/uploaded-files-storage.service';
import { StageStorageService } from '../servises/stage-storage.service';

@Directive({
  selector: '[appDragNDropCombo]'
})
export class DragNDropDirective implements OnChanges  {

@Input('appDragNDropCombo') dragNDropCombo: string;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    public filesStorage: UploadedFilesStorageService,
    public stageStorage: StageStorageService,
   ) {}

  ngOnChanges(): void {
    switch (this.dragNDropCombo){
      case 'UploadFile':
      this.elementRef.nativeElement.childNodes.forEach(
        (element: ElementRef) => this.renderer.setAttribute(element, 'draggable', 'false')
      );
      this.elementRef.nativeElement.querySelectorAll('img').forEach(
        (element: ElementRef) => this.renderer.setAttribute(element, 'draggable', 'false')
      );
      break;

      case 'DnDFile':
      this.elementRef.nativeElement.childNodes.forEach(
       (element: ElementRef) => this.renderer.setAttribute(element, 'draggable', 'false')
      );
      this.elementRef.nativeElement.querySelectorAll('img').forEach(
        (element: ElementRef) => this.renderer.setAttribute(element, 'draggable', 'true')
      );
      break;

      case 'DnDRow':
      this.elementRef.nativeElement.childNodes.forEach(
        (element: ElementRef) => this.renderer.setAttribute(element, 'draggable', 'true')
      );
      this.elementRef.nativeElement.querySelectorAll('img').forEach(
        (element: ElementRef) => this.renderer.setAttribute(element, 'draggable', 'false')
      );
      break;

      case 'Delete':
      this.elementRef.nativeElement.childNodes.forEach(
        (element: ElementRef) => this.renderer.setAttribute(element, 'draggable', 'false')
      );
      this.elementRef.nativeElement.querySelectorAll('img').forEach(
        (element: ElementRef) => this.renderer.setAttribute(element, 'draggable', 'false')
      );
      break;
    }
  }

  @HostListener('dragstart', ['$event']) onDragstart(event: DragEvent): void{
    switch (this.dragNDropCombo) {
      case 'DnDFile':
        this.stageStorage.curentElement = event.target;
        break;

      case 'DnDRow':
        this.stageStorage.curentElement = event.target;
        this.renderer.addClass(event.target, 'enable');
        break;
      }
    }

  @HostListener('dragover', ['$event']) onDragOver(event: any): void{
    event.preventDefault();
    event.stopPropagation();
    switch (this.dragNDropCombo) {
      case 'UploadFile':
        this.stageStorage.lowerElement = event.target;
        if (this.stageStorage.lowerElement.tagName === 'TD'){
          this.renderer.addClass(event.target, 'dropable');
        }
        break;

      case 'DnDFile':
        this.stageStorage.lowerElement = event.target;
        if (this.stageStorage.lowerElement.tagName === 'TD'){
          this.renderer.addClass(event.target, 'dropable');
        }
        break;

      case 'DnDRow':
        this.stageStorage.lowerElement = event.target.parentElement;
        break;
    }
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent): void{
    event.preventDefault();
    event.stopPropagation();
    switch (this.dragNDropCombo) {
      case 'UploadFile':
        this.renderer.removeClass(event.target, 'dropable');
        break;

      case 'DnDFile':
        this.renderer.removeClass(event.target, 'dropable');
        break;

      case 'DnDRow':
        break;
    }
  }

  @HostListener('dragend') onDragend(): void{
    switch (this.dragNDropCombo) {
      case 'DnDRow':
        if (this.stageStorage.lowerElement.tagName !== 'TR'){
          this.stageStorage.lowerElement = this.stageStorage.lowerElement.parentElement;
        }
        const selectedElementIndex = this.stageStorage.curentElement.rowIndex;
        const elementUnderIndex = this.stageStorage.lowerElement.rowIndex;

        if (selectedElementIndex > elementUnderIndex){
           this.renderer.insertBefore(this.elementRef.nativeElement, this.stageStorage.curentElement, this.stageStorage.lowerElement);
        }else if (selectedElementIndex < elementUnderIndex){
          this.renderer.insertBefore(
          this.elementRef.nativeElement, this.stageStorage.curentElement, this.stageStorage.lowerElement.nextSibling);
        }
        this.renderer.removeClass(this.stageStorage.curentElement, 'enable');
        break;
    }
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent): void{
    event.preventDefault();
    event.stopPropagation();
    if (this.stageStorage.lowerElement.tagName === 'TD'){
      switch (this.dragNDropCombo) {
      case 'UploadFile':
        const dropedFile = this.renderer.createElement('img');
        const file = event.dataTransfer.files[0];
        const url = URL.createObjectURL(file);
        const date = String(Date.now());
        this.renderer.removeClass(event.target, 'dropable');
        this.renderer.appendChild(event.target, dropedFile);
        this.renderer.setAttribute(dropedFile, 'src', url);
        this.renderer.setAttribute(dropedFile, 'alt', file.name);
        this.renderer.setAttribute(dropedFile, 'id', date);
        this.renderer.setAttribute(dropedFile, 'draggable', 'false');
        this.filesStorage.addFile(file, url , date);
        break;

      case 'DnDFile':
        this.renderer.removeClass(event.target, 'dropable');
        this.renderer.appendChild(event.target, this.stageStorage.curentElement);
        break;
      }
    }else { return; }
  }

  @HostListener('click', ['$event']) delete(event:any): void{
    switch (this.dragNDropCombo) {
      case 'Delete':
       if (event.target.tagName === 'IMG'){
         this.filesStorage.deleteFile(event.target.id);
         event.target.remove();
       }
       break;
    }
  }
}
