import { Component } from '@angular/core';
import * as data from 'src/app/PeriodicTable.json';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
	public input_value: string = null
    public element: any = ''

	constructor() {}

	updateLabel(element) {
		if (element == null) {
			alert('The value does not belong to any element!')
			this.element = ''
		}
		else {
			this.element = element
		}
	}

	formatString(string) { // Capitalize the first letter and remove the blanks
		return String(string).replace(/ /g, '').replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
	}

	searchElement(value) {
        let elements = null

        if (!isNaN(value)) {
            elements = data.elements.filter(el => Number(value) === el.number)
        }
        else if (isNaN(value)) {

            if (value.length > 3) {
                elements = data.elements.filter(el => String(value) === el.name)
            } else {
                elements = data.elements.filter(el => String(value) === el.symbol)
            }
		}

        return elements
    }

	buttonClick(value) {
		let element = this.searchElement(this.formatString(value));

		this.updateLabel(element[0])
	}
}