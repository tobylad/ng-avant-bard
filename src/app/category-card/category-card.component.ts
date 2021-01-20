import { Component, Input } from "@angular/core";

@Component({
	selector: "category-card",
	templateUrl: "./category-card.component.html",
	styleUrls: ["./category-card.component.scss"]
})

export class CategoryCardComponent {
	@Input() categoryName: string;
	@Input() isActive: string;
}
