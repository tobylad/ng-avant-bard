import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit, OnChanges {
	@Input() results: string[];

	public displayedResults: string[] = [];
	public copyMessage: string;

	private displayedResults$: Subject<string[]> = new Subject();
	private copyMessage$: Subject<string> = new Subject();
	private sortOrder: any = {
		abc: "",
		length: ""
	};


	constructor() { }

	ngOnInit(): void {
		this.displayedResults$.subscribe((results: string[]) => {
			this.displayedResults = results;
		});

		this.copyMessage$.subscribe((word: string) => {
			this.copyMessage = word;
		});
		
		this.displayedResults$.next(this.results);
		this.copyMessage$.next("");
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.results) {
			this.displayedResults$.next(this.results);
		}
	}

	sortAbc(): void {
		if (this.sortOrder.abc === "" || this.sortOrder.abc === "descending") {
			this.sortOrder.abc = "ascending";
			this.displayedResults$.next(this.results.sort());
		} else {
			this.sortOrder.abc = "descending";
			this.displayedResults$.next(this.results.sort().reverse());
		}		
	}

	sortByLength(): void {
		const compareAscending = (a: string, b: string) => a.length - b.length;
		const compareDescending = (a: string, b: string) => b.length - a.length;

		if (this.sortOrder.length === "" || this.sortOrder.length === "descending") {
			this.sortOrder.length = "ascending";
			this.displayedResults$.next(this.results.sort(compareAscending));
		} else {
			this.sortOrder.length = "descending";
			this.displayedResults$.next(this.results.sort(compareDescending));
		}
	}

	updateCopyMessage(word: string): void {
		let message: string;

		if (word === "copied") {
			message = "Copied!";
		} else if (!!word) {
			message = `Click to copy <strong>${word}</strong>`;
		} else {
			message = "";
		}

		this.copyMessage$.next(message);
	}
}
