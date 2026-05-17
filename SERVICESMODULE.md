# Services Module Documentation

## Overview
The Services module allows students to offer and discover campus-based services like tutoring, design, programming, and more. It follows a peer-to-peer model similar to the Marketplace.

## Data Model (Service)
- `providerId`: Reference to the User (Provider)
- `title`: String
- `description`: String
- `category`: Enum ["Tutoring", "Design", "Programming", "Writing", "Marketing", "Others"]
- `pricingType`: Enum ["fixed", "hourly"]
- `price`: Number
- `skills`: Array of Strings (Tags)
- `images`: Array of Objects { url, public_id }
- `availability`: String (e.g., "Mon-Fri, 4pm-8pm")
- `views`: Number (Auto-incremented)

## API Endpoints

### Public Access
- `GET /api/services`: Get all services (with filters)
- `GET /api/services/:id`: Get single service details

### Protected Access (Logged-in Users)
- `POST /api/services`: Create a new service
- `GET /api/services/user/me`: Get services created by the current user
- `PUT /api/services/:id`: Update a service (owner only)
- `DELETE /api/services/:id`: Delete a service (owner only)

## Filtering & Search
The `GET /api/services` endpoint supports:
- `search`: Search in title, description, and skills.
- `category`: Filter by service category.
- `pricingType`: Filter by "fixed" or "hourly".
- `minPrice` / `maxPrice`: Filter by price range.
- `page` / `limit`: Pagination support.

## Cloudinary Integration
- Images are uploaded to the `services` folder in Cloudinary.
- Signatures are generated via `GET /api/upload/sign?folder=services`.
