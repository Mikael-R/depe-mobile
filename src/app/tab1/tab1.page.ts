import { Component } from '@angular/core';
import { LogicService} from '../logic.service';
import { Observable } from "rxjs";
// @ts-ignore
import { IData } from '../interfaces/data.inerface';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

	public inputValue: string = undefined;

	elements: Observable<IData[]>;

	constructor(public _logic: LogicService) {}


	capitalizeFirstLetter(string) {
		return String(string).replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
	}

	searchElement(value) {
		this.elements = this._logic.getData();
		if (!isNaN(parseFloat(value))) {
			for (let elements of this.elements) {
				if (value == elements.number) {
					return {
						"properties": [
							{
								"name": elements.name,
								"symbol": elements.symbol,
								"number": elements.number,
								"atomic_mass": elements.atomic_mass,
								"density": elements.density,
								"summary": elements.summary,
								"xpos": elements.xpos,
								"ypos": elements.ypos,
								"shells": elements.shells,
								"electron_configuration": elements.electron_configuration,
								"melt": elements.melt,
								"boil": elements.boil,
								"category": elements.category,
								"phase": elements.phase,
								"appearance": elements.appearance,
								"color": elements.color,
								"discovered_by": elements.discovered_by
							}
						]
					}
				}
			}
		}
		else if (value.length > 3 && isNaN(value)) {
			for (let elements of this.elements) {
				if (value == elements.name) {
					return {
						"properties": [
							{
								"name": elements.name,
								"symbol": elements.symbol,
								"number": elements.number,
								"atomic_mass": elements.atomic_mass,
								"density": elements.density,
								"summary": elements.summary,
								"xpos": elements.xpos,
								"ypos": elements.ypos,
								"shells": elements.shells,
								"electron_configuration": elements.electron_configuration,
								"melt": elements.melt,
								"boil": elements.boil,
								"category": elements.category,
								"phase": elements.phase,
								"appearance": elements.appearance,
								"color": elements.color,
								"discovered_by": elements.discovered_by
							}
						]
					}
				}
			}
		}
		else if (value.length <= 3 && isNaN(value)) {
			console.log('Symbol')
			for (let elements of this.elements) {
				if (value == elements.symbol) {
					return {
						"properties": [
							{
								"name": elements.name,
								"symbol": elements.symbol,
								"number": elements.number,
								"atomic_mass": elements.atomic_mass,
								"density": elements.density,
								"summary": elements.summary,
								"xpos": elements.xpos,
								"ypos": elements.ypos,
								"shells": elements.shells,
								"electron_configuration": elements.electron_configuration,
								"melt": elements.melt,
								"boil": elements.boil,
								"category": elements.category,
								"phase": elements.phase,
								"appearance": elements.appearance,
								"color": elements.color,
								"discovered_by": elements.discovered_by
							}
						]
					}
				}
			}
		}
		else {
			return null
		}
	}

	buttonClick(value) {
		let element = this.searchElement(this.capitalizeFirstLetter(value))
		alert(this.elements.name[0])
		console.log("Hey")
		alert('Click')
	}
}
