import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RcbRecipeUpdateComponent } from '../update/rcb-recipe-update.component';
import { RcbRecipeRoutingResolveService } from './rcb-recipe-routing-resolve.service';

const rcbRecipeRoute: Routes = [
  {
    path: 'new',
    component: RcbRecipeUpdateComponent,
    resolve: {
      recipe: RcbRecipeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RcbRecipeUpdateComponent,
    resolve: {
      recipe: RcbRecipeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rcbRecipeRoute)],
  exports: [RouterModule],
})
export class RcbRecipeRoutingModule {}
