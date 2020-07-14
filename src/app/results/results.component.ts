import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() items: any[];
  @Input() searchedValue: string;
  @Input() searchedCategory: string;

  public displayedColumns: string[] = ["word"];
  public view: string = "grid";

  constructor() { }

  public ngOnInit(): void {
  }

  public setView(viewType: string): void {
		this.view = viewType;
	}

}
