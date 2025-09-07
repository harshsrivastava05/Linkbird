# LinkBird - Full-Stack Dashboard

This project is a complete, full-stack dashboard application built with Next.js, mirroring the functionality and design of a professional SaaS product. It features a secure authentication system, a data-rich dashboard, and detailed management pages for campaigns and leads.

## Features

-   **Authentication**: Secure user login and registration with both email/password (credentials) and Google OAuth.
-   **Protected Routes**: Middleware ensures that only authenticated users can access the dashboard pages.
-   **Collapsible Sidebar**: A fully interactive and responsive navigation sidebar with active-state linking.
-   **Campaigns Page**: A feature-rich data table to display and manage campaigns, including:
    -   Status badges and progress bars.
    -   Server-side filtering and searching.
    -   Actions for deleting and updating campaign status.
-   **Leads Page**: An advanced, infinite-scrolling table to display leads, featuring:
    -   Debounced, server-side search.
    -   A detailed side sheet that opens to show lead information.
-   **Database Seeding**: A script to populate the database with realistic demo data for easy development and testing.

## Tech Stack

-   **Framework**: Next.js 15+ (App Router)
-   **Styling**: Tailwind CSS + shadcn/ui
-   **Database**: PostgreSQL
-   **ORM**: Drizzle ORM
-   **Authentication**: NextAuth.js
-   **Server State Management**: TanStack Query (React Query)
-   **Client State Management**: Zustand
-   **Form Handling**: React Hooks

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   A local PostgreSQL database (e.g., running via Docker)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/harshsrivastava05/Linkbird.git](https://github.com/harshsrivastava05/Linkbird.git)
    cd Linkbird
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the necessary variables:
    ```env
    # Database URL
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # NextAuth.js secret and Google credentials
    AUTH_SECRET="your-super-secret-key"
    AUTH_GOOGLE_ID="your-google-client-id"
    AUTH_GOOGLE_SECRET="your-google-client-secret"
    ```

4.  **Push the schema to your database:**
    ```bash
    npm run db:push
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running on [http://localhost:3000](http://localhost:3000).