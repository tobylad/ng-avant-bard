import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

@Component({
	selector: 'search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
	public searchedValue: string = "";
	public searchedCategory: string = "";
	public noMatches: boolean = false;
	public showAutoComplete: boolean = true;
	
	
	public categorySubject$: BehaviorSubject<string> = new BehaviorSubject<string>("");
	public category$: Observable<string> = this.categorySubject$.asObservable();
	public searchValueSubject$: BehaviorSubject<string> = new BehaviorSubject<string>("");
	public searchValue$: Observable<string> = this.searchValueSubject$.asObservable();
	public resultsSubject$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
	public results$: Observable<string[]> = this.resultsSubject$.asObservable();
	public autocompleteWordsSubject$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
	public autocompleteWords$: Observable<string[]> = this.autocompleteWordsSubject$.asObservable();

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
		this.categorySubject$.next(category);
		this.searchValueSubject$.next("");
		this.resultsSubject$.next([]);
		this.noMatches = false;
		this.searchedCategory = "";
		this.searchedValue = "";
	}

	public setSearchText($event): void {
		this.noMatches = false;
		this.searchValueSubject$.next($event.target.value);
      	this.setAutocompleteOptions();
	}

	public async search(): Promise<void> {
		if (this.isSearchReady) {
			const queryString = await this.setQuery();
			const datamuseAPIResults = await fetch(`https://api.datamuse.com/words?rel_${queryString}`);
			const resultsJSON = await datamuseAPIResults.json();
			this.resultsSubject$.next(resultsJSON);

			if (!resultsJSON.length) {
				this.noMatches = true;
			}
		}
	}

	private isSearchReady() {
		return !!this.category$ && !!this.searchValue$;
	}

	private async setQuery(): Promise<string> {
		const categoryFetchMap = {
			"Synonyms": "syn",
			"Antonyms": "ant",
			"Rhymes": "rhy",
			"Homophones": "hom"
		}

		const category = await this.category$.pipe(first()).toPromise();
		const currentSearchValue = await this.searchValue$.pipe(first()).toPromise();
		this.searchedCategory = category;
		this.searchedValue = currentSearchValue;

		return categoryFetchMap[category] + "=" + currentSearchValue;
	}

	private addSearchOnEnter() {
		document.addEventListener("keyup", ($e) => {
			if (!!this.category$ && !!this.searchValue$ && $e.keyCode === 13) {
				this.showAutoComplete = false;
				this.search();
			}
		});
	}

	private async setAutocompleteOptions() {
		const searchValue = await this.searchValue$.pipe(
			tap(() => this.showAutoComplete = true),
			debounceTime(500),
			first(),
		).toPromise();

		const datamuseAPIResults = await fetch(`https://api.datamuse.com/sug?s=${searchValue}`);
		const autocompleteResultsJSON = await datamuseAPIResults.json();
		const options = autocompleteResultsJSON.map((result) => {
			return result.word;
        });
        const filteredOptions = options.filter((option) => {
            return !!searchValue && option.includes(searchValue);
		});
		
		this.autocompleteWordsSubject$.next(filteredOptions);
    }
}
