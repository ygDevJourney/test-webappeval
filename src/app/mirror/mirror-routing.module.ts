import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MirrorComponent } from './mirror.component';

const routes: Routes = [{ path: '', component: MirrorComponent },
{ path: 'setup', loadChildren: () => import('./mirror-setup/mirror-setup.module').then(m => m.MirrorSetupModule) },
{ path: 'setting', loadChildren: () => import('./mirrorsetting/mirrorsetting.module').then(m => m.MirrorsettingModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MirrorRoutingModule { }
