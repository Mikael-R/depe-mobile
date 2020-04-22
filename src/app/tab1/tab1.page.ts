import { Component } from '@angular/core';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

	public inputValue: string = undefined;

	constructor() { }

	capitalizeFirstLetter(string) {
	    return String(string).replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
	}

	searchElement(value) {
            return
	}

	buttonClick(value) {
		alert(`Clicked, ${this.inputValue}`)
	}
}
