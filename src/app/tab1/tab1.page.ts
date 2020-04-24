import { Component } from '@angular/core';
import * as data from 'src/app/PeriodicTable.json';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

	public inputValue: string = undefined;

	constructor() {}

	capitalizeFirstLetter(string) {
		return String(string).replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
	}

	searchElement(value) {
		alert('searchElement')
		if (!isNaN(parseFloat(value))) {
			alert('Number')
			for (let elements of data.elements) {
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
			alert('Name')
			for (let elements of data.elements) {
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
			alert('Symbol')
			for (let elements of data.elements) {
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
		let element = this.searchElement(this.capitalizeFirstLetter(value)).properties[0]
		alert(`
Name: ${element.name}
Number: ${element.number}
Symbol: ${element.symbol}
Mass: ${element.atomic_mass}
Density: ${element.density}
Summary: ${element.summary}
Xpos: ${element.xpos}
Ypos${element.ypos}
Sheels: ${element.shells}
Electron_Configuration: ${element.electron_configuration}
`)
	}
}
