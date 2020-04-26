import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ISearch {
	activeCategory: string;
	searchValue: string;
	results: any[];
}

@Component({
	selector: 'search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
	public defaultValues = {
		activeCategory: "",
		searchValue: "",
		results: []
	}
	public state$: BehaviorSubject<ISearch> = new BehaviorSubject<ISearch>(this.defaultValues);
	public noMatches: boolean;
	public categories: string[] = [
		"Synonyms",
		"Antonyms",
		"Rhymes",
		"Homophones"
	];


	constructor() { }

	ngOnInit(): void {
		this.addSearchOnEnter();
	}

	public setCategory(category): void {
		this.set("activeCategory", category);
		this.set("searchValue", "");
		this.set("results", []);
		this.noMatches = false;
	}

	public setSearchText($event): void {
		this.noMatches = false;
		this.set("searchValue", $event.target.value);
	}

	public async search(): Promise<void> {
		if (this.isSearchReady) {
			const queryString = this.setQuery();
			const datamuseAPIResults = await fetch(`https://api.datamuse.com/words?rel_${queryString}`);
			const resultsJSON = await datamuseAPIResults.json();
			this.set("results", resultsJSON);

			if (!this.get("results").length) {
				this.noMatches = true;
			}
		}
	}

	private isSearchReady() {
		return this.get("activeCategory") && this.get("searchValue");
	}

	private setQuery(): string {
		const categoryFetchMap = {
			"Synonyms": "syn",
			"Antonyms": "ant",
			"Rhymes": "rhy",
			"Homophones": "hom"
		}

		return categoryFetchMap[this.get("activeCategory")] + "=" + this.get("searchValue");
	}

	private addSearchOnEnter() {
		document.addEventListener("keyup", ($e) => {
			if (this.get("activeCategory") && this.get("searchValue") && $e.keyCode === 13) {
				this.search();
			}
		});
	}

	private get(property) {
		return this.state$.value[property];
	}

	private set(property, value) {
		const currentState = this.state$.value;
		const newState = { ...currentState, [property]: value };
		this.state$.next(newState);
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
