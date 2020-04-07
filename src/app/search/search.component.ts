import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
	public activeCategory: string;
	public searchValue: string;
	public results: any[];
	public noMatches: boolean;
	public categories: string[] = [
		"Synonyms",
		"Antonyms",
		"Rhymes",
		"Homophones"
	];

	constructor() { }

	ngOnInit(): void {
	}

	public setCategory(category): void {
		this.activeCategory = category;
		this.results = [];
		this.searchValue = "";
		this.noMatches = false;
	}

	public setSearchText($event): void {
		this.noMatches = false;
		this.searchValue = $event.target.value;
	}

	public async search(): Promise<void> {
		if (this.activeCategory && this.searchValue) {
			const queryString = this.setQuery();
			const datamuseAPIResults = await fetch(`https://api.datamuse.com/words?rel_${queryString}`);
			const resultsJSON = await datamuseAPIResults.json();
			this.results = resultsJSON;

			if (!this.results.length) {
				this.noMatches = true;
			}
		}
	}

	private setQuery(): string {
		const categoryFetchMap = {
			"Synonyms": "syn",
			"Antonyms": "ant",
			"Rhymes": "rhy",
			"Homophones": "hom"
		}

		return categoryFetchMap[this.activeCategory] + "=" + this.searchValue;
	}






	// Current state (stored in behavior subject)
	// {
	// 	activeCategory: "Synonym",
	// 	searchValue: "Word",
	// 	results: ["result", "result"]
	// }

	// To change results:
	
	// Make API call
	// Set results variable
	// const currentState = behaviorSubject.value;
	// const newState = { ...currentState, results: results };
	// behaviorSubject.next(newState)
}
