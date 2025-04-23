import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { environment } from "../environments/environment"
import {HttpClient} from '@angular/common/http';

export interface Contact {
  _id?: string
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
  category?: string
  isFavorite: boolean
  expanded?: boolean
}

@Injectable({
  providedIn: "root",
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contacts`

  constructor(private http: HttpClient) {}

  // Get all contacts
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl)
  }

  // Get a single contact
  getContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`)
  }

  // Create a new contact
  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact)
  }

  // Update a contact
  updateContact(id: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact)
  }

  // Delete a contact
  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  // Toggle favorite status
  toggleFavorite(id: string): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/${id}/favorite`, {})
  }
}
