import { Component, type OnInit, type OnDestroy, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { environment } from "../environments/environment"
import type { Subscription } from "rxjs"
import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';

type Category = "Family" | "Friends" | "Office" | "Other"

interface Contact {
  id: number
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone: string
  dob?: string
  address?: string
  country?: string
  state?: string
  city?: string
  pincode?: string
  category?: Category
  isFavorite: boolean
  avatar?: string
  expanded?: boolean
  isEditing?: boolean
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {


  // User profile data
  userData: any = null
  errorMessage = ""
  isProfileMenuOpen = false
  private subscription: Subscription | null = null

  // Sub-tabs for filtering contacts
  contactsTab: "All Contacts" | "Favorites" | "Recent" | "Groups" = "All Contacts"

  // Search input model
  searchQuery = ""

  // Contact being edited
  editingContact: Contact | null = null

  // Contact list (mock data)
  contacts: Contact[] = [
    {
      id: 1,
      firstName: "Alex",
      lastName: "Johnson",
      middleName: "",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      dob: "1985-06-15",
      address: "123 Main St",
      country: "United States",
      state: "California",
      city: "San Francisco",
      pincode: "94105",
      category: "Friends",
      isFavorite: false,
      expanded: false,
    },
    {
      id: 2,
      firstName: "Samantha",
      lastName: "Williams",
      middleName: "Rose",
      email: "samantha.w@example.com",
      phone: "+1 (555) 987-6543",
      dob: "1990-03-22",
      address: "456 Oak Avenue",
      country: "United States",
      state: "New York",
      city: "Brooklyn",
      pincode: "11201",
      category: "Family",
      isFavorite: false,
      expanded: false,
    },
    {
      id: 3,
      firstName: "Michael",
      lastName: "Brown",
      middleName: "",
      email: "michael.brown@example.com",
      phone: "+1 (555) 456-7890",
      dob: "1982-11-08",
      address: "789 Pine Road",
      country: "United States",
      state: "Texas",
      city: "Austin",
      pincode: "73301",
      category: "Office",
      isFavorite: true,
      expanded: false,
    },
    {
      id: 4,
      firstName: "Emily",
      lastName: "Davis",
      middleName: "Jane",
      email: "emily.davis@example.com",
      phone: "+1 (555) 234-5678",
      dob: "1988-07-30",
      address: "321 Maple Drive",
      country: "United States",
      state: "Illinois",
      city: "Chicago",
      pincode: "60601",
      category: "Friends",
      isFavorite: false,
      expanded: false,
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Wilson",
      middleName: "Thomas",
      email: "david.wilson@example.com",
      phone: "+1 (555) 876-5432",
      dob: "1979-02-14",
      address: "654 Cedar Lane",
      country: "United States",
      state: "Washington",
      city: "Seattle",
      pincode: "98101",
      category: "Office",
      isFavorite: false,
      expanded: false,
    },
  ]



  constructor(private authService: AuthService,private  http: HttpClient) {}

  ngOnInit() {
    this.subscription = this.http.get(environment.apiUrl + "/home").subscribe({
      next: (response: any) => {
        this.userData = response.user
        this.errorMessage = ""
      },
      error: (err: any) => {
        console.error("Error getting home data", err)
        this.errorMessage = "Could not load profile data"
      },
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    // Close the profile menu when clicking outside of it
    const profileMenuElement = (event.target as HTMLElement).closest(".relative")
    if (!profileMenuElement && this.isProfileMenuOpen) {
      this.isProfileMenuOpen = false
    }
  }

  onLogout() {
    this.authService.logout()
    this.isProfileMenuOpen = false
  }

  // Set the current sub-tab filter
  setContactsTab(tab: "All Contacts" | "Favorites" | "Recent" | "Groups"): void {
    this.contactsTab = tab
  }

  // Toggle favorite status
  toggleFavorite(contact: Contact): void {
    contact.isFavorite = !contact.isFavorite
  }

  // Toggle expanded state
  toggleExpanded(contact: Contact): void {
    contact.expanded = !contact.expanded
  }

  // Start editing a contact
  editContact(contact: Contact): void {
    this.editingContact = { ...contact }
  }

  // Save edited contact
  saveContact(): void {
    if (this.editingContact) {
      const index = this.contacts.findIndex((c) => c.id === this.editingContact!.id)
      if (index !== -1) {
        this.contacts[index] = { ...this.editingContact }
      }
      this.editingContact = null
    }
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingContact = null
  }

  // Get category color class
  getCategoryColor(category?: string): string {
    switch (category) {
      case "Family":
        return "bg-green-100 text-green-800"
      case "Friends":
        return "bg-blue-100 text-blue-800"
      case "Office":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get filtered and searched contacts
  get filteredContacts(): Contact[] {
    let filtered = [...this.contacts]

    // Filter by sub-tab
    if (this.contactsTab === "Favorites") {
      filtered = filtered.filter((c) => c.isFavorite)
    } else if (this.contactsTab === "Recent") {
      // Simulating recent with first 2
      filtered = filtered.slice(0, 2)
    } else if (this.contactsTab === "Groups") {
      // Group view would be implemented here
      filtered = filtered.filter((c) => c.category !== undefined)
    }

    // Filter by search query
    if (this.searchQuery.trim() !== "") {
      const q = this.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q),
      )
    }

    return filtered
  }
}
