import { Component} from '@angular/core';
import { StageStorageService } from './servises/stage-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  case: string;
  constructor(private storage: StageStorageService){}

    changeCase(event: any): void{
      this.case = event.target.value;
    }
 }
