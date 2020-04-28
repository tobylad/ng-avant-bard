import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ISearch {
	activeCategory: string;
	searchValue: string;
	results: any[];
    autocompleteOptions: string[];
    noMatches: boolean;
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
		results: [],
        autocompleteOptions: [],
        noMatches: false
	}

	public state$: BehaviorSubject<ISearch> = new BehaviorSubject<ISearch>(this.defaultValues);
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
        this.set("noMatches", false)
	}

	public setSearchText($event): void {
		this.set("noMatches", false);
    	this.set("searchValue", $event.target.value);
      	this.setAutocompleteOptions();
	}

	public async search(): Promise<void> {
		if (this.isSearchReady) {
			const queryString = this.setQuery();
			const datamuseAPIResults = await fetch(`https://api.datamuse.com/words?rel_${queryString}`);
			const resultsJSON = await datamuseAPIResults.json();
			this.set("results", resultsJSON);

			if (!this.get("results").length) {
				this.set("noMatches", true);
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

	private async setAutocompleteOptions() {
		const searchValue = this.get("searchValue");
		const datamuseAPIResults = await fetch(`https://api.datamuse.com/sug?s=${searchValue}`);
		const resultsJSON = await datamuseAPIResults.json();
		const options = resultsJSON.map((result) => {
			return result.word;
        });
        const filteredOptions = options.filter((option) => {
            return option.includes(searchValue);
        });

        this.set("autocompleteOptions", filteredOptions);
    }

	private get(property) {
		return this.state$.value[property];
	}

	private set(property, value) {
		const currentState = this.state$.value;
		const newState = { ...currentState, [property]: value };
		this.state$.next(newState);
	}
}
