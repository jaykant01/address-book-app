import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  isMobileMenuOpen: boolean = false; // Tracks the mobile menu state

  // Toggles the mobile menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Closes the mobile menu explicitly
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
