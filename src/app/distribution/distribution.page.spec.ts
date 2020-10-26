import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { DistributionPage } from './distribution.page'

describe('DistributionPage', () => {
  let component: DistributionPage
  let fixture: ComponentFixture<DistributionPage>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DistributionPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(DistributionPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
