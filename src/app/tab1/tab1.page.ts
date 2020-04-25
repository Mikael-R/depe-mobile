import { Component } from '@angular/core';
import * as data from 'src/app/PeriodicTable.json';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

	public input_value_tab1: string = undefined;
	public element_name_label_tab1: string = undefined;
	public element_symbol_label_tab1: string = undefined;
	public element_number_label_tab1: string = undefined;
	public element_mass_label_tab1: string = undefined;
	public element_density_label_tab1: string = undefined;
	public element_shells_label_tab1: string = undefined;
	public element_electron_configuration_label_tab1: string = undefined;

	constructor() {}

	updateLabel(element) {
		if (element == null) {
			alert('Element not found!')
			this.input_value_tab1 = undefined;
			this.element_name_label_tab1 = undefined;
			this.element_symbol_label_tab1 = undefined;
			this.element_number_label_tab1 = undefined;
			this.element_mass_label_tab1 = undefined;
			this.element_density_label_tab1 = undefined;
			this.element_shells_label_tab1 = undefined;
			this.element_electron_configuration_label_tab1 = undefined;
		}
		else {
			this.element_name_label_tab1 = element.name;
			this.element_symbol_label_tab1 = element.symbol;
			this.element_number_label_tab1 = element.number;
			this.element_mass_label_tab1 = element.atomic_mass;
			this.element_density_label_tab1 = element.density;
			this.element_shells_label_tab1 = element.shells;
			this.element_electron_configuration_label_tab1 = element.electron_configuration;
		}
	}

	formatString(string) { // Capitalize the first letter and remove the blanks from the beginning and end
		return String(string).trim().replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
	}

	searchElement(value) {
		if (!isNaN(parseFloat(value))) {
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
								"shells": elements.shells,
								"electron_configuration": elements.electron_configuration
							}
						]
					}
				}
			}
		}
		else if (value.length > 3 && isNaN(value)) {
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
								"shells": elements.shells,
								"electron_configuration": elements.electron_configuration
							}
						]
					}
				}
			}
		}
		else if (value.length <= 3 && isNaN(value)) {
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
								"shells": elements.shells,
								"electron_configuration": elements.electron_configuration
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
		let element = this.searchElement(this.formatString(value));

		if (element == null) {
			this.updateLabel(element);
		}
		else {
			this.updateLabel(element.properties[0]);
		}
	}
}
