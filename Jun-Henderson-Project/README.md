# FlatFinder

A web application to connect **landlords** and **renters** by listing, searching and managing rental flats. It also includes an **admin** role for user management.

## Table of Contents
- [About](#about)
- [Features](#features)
- [Data Model](#data-model)
- [Validation Rules](#validation-rules)
- [Tech Stack](#tech-stack)
- [Authentication & Authorization](#authentication--authorization)
- [Navigation](#navigation)
- [Getting Started](#getting-started)

## About
**FlatFinder** helps landlords publish their available flats and renters discover the best match through a friendly, responsive website.  
Admins can view all users, edit/remove their profiles, and grant admin permissions.

## Features
- **Landlords / Renters**
  - Create, view, edit and manage flats (owner only)
  - Global search with filtering and sorting
  - Mark/Unmark favourite flats
  - View flat details
- **Messages**
  - Non-owners can send a message to the flat owner within a flat context
  - Owner sees all messages sent to their flat (one-way messaging for simplicity)
- **Admin**
  - View all users, edit/remove profiles
  - Grant admin permissions

## Data Model

### User
- `Email: string` — required; valid email  
- `Password: string` — required; ≥ 6; must contain letters, numbers and a special char  
- `FirstName: string` — required; min length 2  
- `LastName: string` — required; min length 2  
- `BirthDate: Date` — required; derived age 18–120

### Flat
- `City: string` — required  
- `StreetName: string` — required  
- `StreetNumber: number` — required  
- `AreaSize: number` — required  
- `HasAC: boolean` — required  
- `YearBuilt: number` — required  
- `RentPrice: number` — required  
- `DateAvailable: Date` — required

### Message
- `CreationTime: Date` — required  
- `Content: string` — required; non-empty

## Validation Rules

### User
- All fields required  
- Email in valid email format  
- FirstName and LastName: at least 2 characters each  
- Derived age from BirthDate: between 18 and 120  
- Password: at least 6 characters and must contain:
  - letters
  - numbers
  - a character that is neither a letter nor a number

### Flat
- All fields required  
- Data type check for every field

### Message
- Content cannot be an empty string

## Tech Stack
- **Framework:** Angular  
- **Language:** TypeScript  
- **UI:** HTML, CSS  
- **Backend/Services:** Firebase (Firestore, Authentication)  
- **Tooling:** Angular CLI, npm  
- **Targets:** Responsive (Desktop, Tablets, Smartphones)

## Authentication & Authorization

**Owner: Developer B**

- **Auth provider:** Firebase Authentication (email/password)  
- **Session policy:** re-login required after **60 minutes**  
- **Roles:** Admin, Regular user

### Access control
- **Admin**
  - View all users
  - Edit/remove user profiles
  - Grant admin permissions to a regular user
- **Flats**
  - Only the owner can create, update and delete their own flats
  - Non-owners: can send a message to the owner within the context of a flat
  - Owner: sees all messages for their flat; owner **does not reply**
- **Favourites**
  - Each user can mark/unmark flats as favourite

## Navigation
Header includes:
- **Company Logo**
- **Greetings:** `Hello, <User Full Name>`
- Links/Buttons:
  - **Home (Search Flats)**
  - **MyProfile**
  - **MyFlats**
  - **Favourites**
  - **All Users** *(admin only)*
  - **Delete Account**
  - **Logout**

## Getting Started

### Prerequisites
- Node.js (LTS) and npm installed  
- Angular CLI installed globally

```bash
node -v
npm -v
npm install -g @angular/cli
```