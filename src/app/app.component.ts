import { Component } from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(
		overlayContainer: OverlayContainer
	) {
		overlayContainer.getContainerElement().classList.add("avant-bard-theme");
	}
}
