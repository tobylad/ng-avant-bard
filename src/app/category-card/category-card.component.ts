import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'category-card',
	templateUrl: './category-card.component.html',
	styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {
	@Input() categoryName: string;

	constructor() { }

	ngOnInit(): void {
	}

}
