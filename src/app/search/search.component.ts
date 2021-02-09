import { Component, OnInit, ViewChild } from "@angular/core";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
	selector: "search",
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"]
})

export class SearchComponent implements OnInit {
	@ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

	public currentCategory: CategoryCard = null;
	public currentSearchValue: string;
	public currentResults: string[] = [];
	public currentAutocompleteWords: DatamuseResult[] = [];
	
	public categories: CategoryCard[] = [
		{title: "Synonyms", abbv: "syn"},
		{title: "Antonyms", abbv: "ant"},
		{title: "Rhymes", abbv: "rhy"},
		{title: "Homophones", abbv: "hom"}
	];
	
	public currentResultsTitle: string;
	public noMatches: boolean;
	public autocompleteActive: boolean;
	public newSearchStarted: boolean;
	public searchReady: boolean;
	
	private category$: Subject<CategoryCard> = new Subject();
	private searchValue$: Subject<string> = new Subject<string>();
	private results$: Subject<DatamuseResult[]> = new Subject<DatamuseResult[]>();
	private autocompleteWords$: Subject<DatamuseResult[]> = new Subject<DatamuseResult[]>();

	ngOnInit(): void {
		this.addSearchOnEnter();

		this.category$.subscribe((category: CategoryCard) => {
			this.currentCategory = category
		});

		this.searchValue$.subscribe((value: string) => {
			if (value) {
				this.searchReady = true;
				this.noMatches = false;
				this.newSearchStarted = true;
			} else {
				this.searchReady = false;
			}
 
			this.currentSearchValue = value
		});

		this.searchValue$.pipe(
			debounceTime(250)
		).subscribe((value: string) => {
			if (value) {
				this.setAutocompleteOptions(value);
			}
		});

		this.results$.subscribe((results: DatamuseResult[]) => {
			this.currentResults = results.map((result) => result.word);
		});

		this.autocompleteWords$.subscribe((words: DatamuseResult[]) => {
			this.currentAutocompleteWords = words;
		});
	}

	public setCategory(categoryToSet: string): void {
		const newCategory = this.categories.find((cat) => cat.title === categoryToSet);
		this.category$.next(newCategory);
		this.searchValue$.next("");
		this.results$.next([]);
		this.noMatches = false;
	}

	public async setSearchText($event: any): Promise<void> {
		this.searchValue$.next($event.target.value);
	}

	public async search(): Promise<void> {
		if (!this.newSearchStarted) return;

		const queryString = await this.setQuery();
		const datamuseAPIResults = await fetch(`https://api.datamuse.com/words?rel_${queryString}`);
		const resultsJSON = await datamuseAPIResults.json();
		this.results$.next(resultsJSON);
		this.currentResultsTitle = this.currentSearchValue;
		this.newSearchStarted = false;

		if (!resultsJSON.length) {
			this.noMatches = true;
		}
	
		this.autocomplete.closePanel();
	}

	private async setQuery(): Promise<any> {
		const query =  this.currentCategory.abbv + "=" + this.currentSearchValue;
		return query;
	}

	private addSearchOnEnter() {
		document.addEventListener("keyup", ($event: KeyboardEvent) => {
			if (this.searchReady && $event.key === "Enter") {
				this.search();
				this.autocompleteActive = false;
			}
		});
	}

	private async setAutocompleteOptions(searchValue: string): Promise<void> {
		if (!searchValue) {
			this.autocompleteActive = false;
			this.autocompleteWords$.next([]);
		} else {
			this.autocompleteActive = true;
			const datamuseAPIResults = await fetch(`https://api.datamuse.com/sug?s=${searchValue}`);
			const autocompleteResultsJSON = await datamuseAPIResults.json();
			this.autocompleteWords$.next(autocompleteResultsJSON);
		}
	}
}
