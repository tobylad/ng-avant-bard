import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { first, debounceTime, debounce} from "rxjs/operators";

@Component({
	selector: "search",
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"]
})

export class SearchComponent implements OnInit {
	public searchedValue: string;
	public searchedCategory: string;
	public noMatches: boolean;
	public autocompleteActive: boolean;
	public newSearchStarted: boolean;
	
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

	public async setSearchText($event: any): Promise<void> {
		if ($event.key === "Enter") {
			this.autocompleteActive = false;
		} else {
			this.newSearchStarted = false;
			this.autocompleteActive = true;
		}

		this.noMatches = false;
		this.searchValueSubject$.next($event.target.value);

		this.searchValue$.pipe(
			debounceTime(200)
		).subscribe(
			(value: string) => {
				console.log('%cval', 'color: lime; font-size: 16px;', value) 
				this.setAutocompleteOptions(value)
			}
		);
	}

	public async search(): Promise<void> {
		if (this.newSearchStarted) return;


		if (this.isSearchReady) {
			const queryString = await this.setQuery();
			const datamuseAPIResults = await fetch(`https://api.datamuse.com/words?rel_${queryString}`);
			const resultsJSON = await datamuseAPIResults.json();
			this.resultsSubject$.next(resultsJSON);
			this.newSearchStarted = true;

			if (!resultsJSON.length) {
				this.noMatches = true;
			}
		}
	}

	private get isSearchReady() {
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
		document.addEventListener("keyup", ($event: KeyboardEvent) => {
			if (!!this.category$ && !!this.searchValue$ && $event.key === "Enter") {
				this.search();
			}
		});
	}

	private async setAutocompleteOptions(searchValue: string): Promise<void> {
		if (!searchValue) {
			this.autocompleteWordsSubject$.next([]);
		} else {
			const datamuseAPIResults = await fetch(`https://api.datamuse.com/sug?s=${searchValue}`);
			const autocompleteResultsJSON = await datamuseAPIResults.json();
			const options = autocompleteResultsJSON.map((result: IAutoCompleteResult) => {
				return result.word;
			});
			const filteredOptions: string[] = options.filter((option: string) => {
				return option.includes(searchValue);
			});

			
			this.autocompleteWordsSubject$.next(filteredOptions);
		}
	}
}
