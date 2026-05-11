# Marketplace Listings Module Documentation

## Overview
The Marketplace Listings module enables students to buy and sell items within the CampusHub ecosystem. It handles item creation, discovery through filtering/searching, and listing management.

## Data Model (Mongoose)
The `Listing` model includes:
- `sellerId`: Reference to the `User` who created the listing.
- `title`: Name of the item.
- `description`: Detailed information about the item.
- `price`: Numeric value.
- `category`: Enum (Books, Laptops, Accessories, Hostel Items, Furniture, Others).
- `condition`: Enum (New, Like New, Used).
- `images`: Array of objects:
    - `url`: The secure URL of the image.
    - `public_id`: The Cloudinary identifier (needed for deletions).
- `location`: Specific campus area/hostel.
- `status`: Enum (available, sold).
- `views`: Counter for tracking engagement.

## API Specification

### 1. Create Listing
- **Endpoint**: `POST /api/listings`
- **Auth**: Protected (Logged-in users)
- **Body**: `{ title, description, price, category, condition, location, images }`
- **Response**: `201 Created` with the listing object.

### 2. Get All Listings (Discovery)
- **Endpoint**: `GET /api/listings`
- **Query Parameters**:
  - `category`: Filter by category name.
  - `search`: Full-text search on title/description.
  - `minPrice` / `maxPrice`: Range filtering.
  - `condition`: Filter by item condition.
  - `page` / `limit`: Pagination support.
- **Response**: `200 OK` with an array of listings and pagination metadata.

### 3. Get Single Listing
- **Endpoint**: `GET /api/listings/:id`
- **Logic**: Increments the `views` counter on each hit.
- **Response**: `200 OK` with the detailed listing object including seller info.

### 4. Update Listing
- **Endpoint**: `PUT /api/listings/:id`
- **Auth**: Protected (Owner Only)
- **Response**: `200 OK` with the updated listing.

### 5. Delete Listing
- **Endpoint**: `DELETE /api/listings/:id`
- **Auth**: Protected (Owner Only)
- **Response**: `200 OK` confirming deletion.

### 6. Get My Listings
- **Endpoint**: `GET /api/listings/my`
- **Auth**: Protected (Logged-in user)
- **Purpose**: Returns all listings created by the authenticated user.

## Design References (Stitch)
- **Student Home**: Displaying featured/recommended listings.
- **Marketplace**: Grid view with robust filtering sidebar and search bar.
- **Listing Details**: High-fidelity view with image gallery and seller contact.
