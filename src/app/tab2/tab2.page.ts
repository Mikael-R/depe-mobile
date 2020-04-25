import { Component } from '@angular/core';
import * as data from 'src/app/PeriodicTable.json';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

	public input_value_tab2: string = undefined;
	public element_name_label_tab2: string = undefined;
	public element_symbol_label_tab2: string = undefined;
	public element_number_label_tab2: string = undefined;
	public element_mass_label_tab2: string = undefined;
	public element_density_label_tab2: string = undefined;
	public element_summary_label_tab2: string = undefined;
	public element_category_label_tab2: string = undefined;
	public element_phase_label_tab2: string = undefined;
	public element_appearance_label_tab2: string = undefined;
	public element_discovered_by_label_tab2 = undefined;
	public element_melt_label_tab2 = undefined;
	public element_boil_label_tab2 = undefined;
	public element_xpos_label_tab2 = undefined;
	public element_ypos_label_tab2 = undefined;

	constructor() {}

	updateLabel(element) {
		if (element == null) {
			alert('Element not found!')
			this.input_value_tab2 = undefined;
			this.element_name_label_tab2 = undefined;
			this.element_symbol_label_tab2 = undefined;
			this.element_number_label_tab2 = undefined;
			this.element_mass_label_tab2 = undefined;
			this.element_density_label_tab2 = undefined;
			this.element_summary_label_tab2 = undefined;
			this.element_category_label_tab2 = undefined;
			this.element_phase_label_tab2 = undefined;
			this.element_appearance_label_tab2 = undefined;
			this.element_discovered_by_label_tab2 = undefined;
			this.element_melt_label_tab2 = undefined;
			this.element_boil_label_tab2 = undefined;
			this.element_xpos_label_tab2 = undefined;
			this.element_ypos_label_tab2 = undefined;
		}
		else {
			this.element_name_label_tab2 = element.name;
			this.element_symbol_label_tab2 = element.symbol;
			this.element_number_label_tab2 = element.number;
			this.element_mass_label_tab2 = element.atomic_mass;
			this.element_density_label_tab2 = element.density;
			this.element_summary_label_tab2 = element.summary;
			this.element_category_label_tab2 = element.category;
			this.element_phase_label_tab2 = element.phase;
			this.element_appearance_label_tab2 = element.appearance;
			this.element_discovered_by_label_tab2 = element.discovered_by;
			this.element_melt_label_tab2 = element.melt;
			this.element_boil_label_tab2 = element.boil;
			this.element_xpos_label_tab2 = element.xpos;
			this.element_ypos_label_tab2 = element.ypos;
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
								"summary": elements.summary,
								"category": elements.category,
								"phase": elements.phase,
								"appearance": elements.appearance,
								"discovered_by": elements.discovered_by,
								"melt": elements.melt,
								"boil": elements.boil,
								"xpos": elements.xpos,
								"ypos": elements.ypos	
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
								"summary": elements.summary,
								"category": elements.category,
								"phase": elements.phase,
								"appearance": elements.appearance,
								"discovered_by": elements.discovered_by,
								"melt": elements.melt,
								"boil": elements.boil,
								"xpos": elements.xpos,
								"ypos": elements.ypos
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
								"summary": elements.summary,
								"category": elements.category,
								"phase": elements.phase,
								"appearance": elements.appearance,
								"discovered_by": elements.discovered_by,
								"melt": elements.melt,
								"boil": elements.boil,
								"xpos": elements.xpos,
								"ypos": elements.ypos
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