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
	}

	public setSearchText(event): void {
		this.searchValue = event.target.value;
	}

	public search(): void {
		if (this.activeCategory && this.searchValue) {
			console.log(`Now searching for '${this.searchValue}' in ${this.activeCategory}`)


			fetch(`https://api.datamuse.com/words?ml=${this.searchValue}`)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					console.log(data);
					this.results = data;
				});
		}
	}


}
