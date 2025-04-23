import { Component, type OnInit, type OnDestroy, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { environment } from "../environments/environment"
import type { Subscription } from "rxjs"

import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {Contact, ContactService} from '../services/contact.service';

type Category = "Family" | "Friends" | "Office" | "Other"

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
  private contactsSubscription: Subscription | null = null

  // Sub-tabs for filtering contacts
  contactsTab: "All Contacts" | "Favorites" | "Recent" | "Groups" = "All Contacts"

  // Search input model
  searchQuery = ""

  // Contact being edited
  editingContact: Contact | null = null

  // Contact list
  contacts: Contact[] = []

  // New contact form
  isAddingContact = false
  newContact: Contact = this.getEmptyContact()

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private contactService: ContactService,
  ) {}

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

    // Load contacts from the API
    this.loadContacts()
  }

  loadContacts() {
    this.contactsSubscription = this.contactService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts.map((contact) => ({
          ...contact,
          expanded: false,
        }))
      },
      error: (err) => {
        console.error("Error loading contacts", err)
        this.errorMessage = "Could not load contacts"
      },
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    if (this.contactsSubscription) {
      this.contactsSubscription.unsubscribe()
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
    if (contact._id) {
      this.contactService.toggleFavorite(contact._id).subscribe({
        next: (updatedContact) => {
          const index = this.contacts.findIndex((c) => c._id === contact._id)
          if (index !== -1) {
            this.contacts[index].isFavorite = updatedContact.isFavorite
          }
        },
        error: (err) => {
          console.error("Error toggling favorite", err)
        },
      })
    }
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
    if (this.editingContact && this.editingContact._id) {
      this.contactService.updateContact(this.editingContact._id, this.editingContact).subscribe({
        next: (updatedContact) => {
          const index = this.contacts.findIndex((c) => c._id === updatedContact._id)
          if (index !== -1) {
            this.contacts[index] = { ...updatedContact, expanded: this.contacts[index].expanded }
          }
          this.editingContact = null
        },
        error: (err) => {
          console.error("Error updating contact", err)
        },
      })
    }
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingContact = null
  }

  // Delete a contact
  deleteContact(contact: Contact): void {
    if (contact._id && confirm("Are you sure you want to delete this contact?")) {
      this.contactService.deleteContact(contact._id).subscribe({
        next: () => {
          this.contacts = this.contacts.filter((c) => c._id !== contact._id)
        },
        error: (err) => {
          console.error("Error deleting contact", err)
        },
      })
    }
  }

  // Show add contact form
  showAddContactForm(): void {
    this.isAddingContact = true
    this.newContact = this.getEmptyContact()
  }

  // Cancel adding contact
  cancelAddContact(): void {
    this.isAddingContact = false
  }

  // Add new contact
  addContact(): void {
    this.contactService.createContact(this.newContact).subscribe({
      next: (contact) => {
        this.contacts.push({ ...contact, expanded: false })
        this.isAddingContact = false
      },
      error: (err) => {
        console.error("Error adding contact", err)
      },
    })
  }

  // Get empty contact object for new contact form
  getEmptyContact(): Contact {
    return {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phone: "",
      isFavorite: false,
    }
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
      // Get the 5 most recent contacts (assuming they're sorted by creation date)
      filtered = filtered.slice(0, 5)
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

