import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { RcbRecipeRoutingModule } from "./route/rcb-recipe-routing.module";
import { RcbRecipeUpdateComponent } from "./update/rcb-recipe-update.component";

@NgModule({
    imports: [SharedModule, RcbRecipeRoutingModule],
    declarations: [RcbRecipeUpdateComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class RcbRecipeModule {}