import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TabsPage } from './tabs.page'

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'distribution',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../distribution/distribution.module').then(
                m => m.DistributionPageModule
              ),
          },
        ],
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../search/search.module').then(m => m.SearchPageModule),
          },
        ],
      },
      {
        path: 'info',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../info/info.module').then(m => m.InfoPageModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/distribution',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/distribution',
    pathMatch: 'full',
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
