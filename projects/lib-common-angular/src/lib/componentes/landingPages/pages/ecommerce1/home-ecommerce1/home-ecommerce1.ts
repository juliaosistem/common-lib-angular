import { Component } from '@angular/core';
import { HeroSectionEcommerce1 } from "../../../molecules/hero-section-ecommerce1/hero-section-ecommerce1";
import { SectionFiltersCategoriesProductos } from "../../../../shared/molecules/section-filters-categories-productos/section-filters-categories-productos";

@Component({
  selector: 'lib-home-ecommerce1',
  imports: [HeroSectionEcommerce1, SectionFiltersCategoriesProductos],
  templateUrl: './home-ecommerce1.html',
  styleUrl: './home-ecommerce1.css'
})
export class HomeEcommerce1 {

}
