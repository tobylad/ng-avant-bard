import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
	public activeCategory: string;
	public searchValue: string;
	public categories: string[] = [
		"Synonyms",
		"Rhymes",
		"Scrabble",
		"Dad Joke"
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
		}
	}
}
