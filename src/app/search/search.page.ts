import { Component } from '@angular/core'
import { elements } from 'src/app/PeriodicTable.json'

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage {
  public input_value: string = null
  public element: any = ''

  constructor() {}

  async presentToast(message: string) {
    const toast = document.createElement('ion-toast')
    toast.message = message
    toast.duration = 2000
    toast.position = 'top'

    document.body.appendChild(toast)
    return toast.present()
  }

  updateLabel(element) {
    if (element == null) {
      this.presentToast('The value does not belong to any element!')
      this.element = ''
    } else {
      this.element = element
    }
  }

  formatString(string: string) {
    // Capitalize the first letter and remove the blanks
    return String(string)
      .replace(/ /g, '')
      .replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
  }

  searchElement(value) {
    let element = null

    if (!isNaN(value)) {
      element = elements.find(el => Number(value) === el.number)
    } else if (isNaN(value)) {
      if (value.length > 3) {
        element = elements.find(el => String(value) === el.name)
      } else {
        element = elements.find(el => String(value) === el.symbol)
      }
    }

    return element
  }

  buttonClick(value) {
    const element = this.searchElement(this.formatString(value))

    this.updateLabel(element)
  }
}
