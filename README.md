
# Invoice Management System

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg" alt="Laravel Logo" width="100"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" alt="Next.js Logo" width="120"/>
</p>

A web-based invoicing and client management system built using **Laravel** (backend) and **Next.js** (frontend). The system is designed to help users easily manage and track their invoices and clients. It features an intuitive interface with detailed analytics and real-time updates.

## Features

- **User Authentication**: Secure login and registration pages for user authentication.
- **Invoice Management**: Track, manage, and update invoices and their statuses.
- **Client Management**: Add, edit, and delete clients.
- **Statistics & Analytics**: View dynamic charts with invoice and client data (using Chart.js).
- **Responsive Design**: Built with **Tailwind CSS** for a fast and modular design that works on all screen sizes.

## Tech Stack

- **Frontend**: 
  - **Next.js**: Fast rendering, SEO-friendly.
  - **Tailwind CSS**: For fast and flexible styling.
  - **Chart.js**: For dynamic charts on the statistics and analytics page.
  - **React**: For handling frontend state management.

- **Backend**:
  - **Laravel**: PHP framework for the backend logic and API endpoints.
  - **MySQL**: Relational database to store user, client, and invoice data.
  - **Axios**: For making API requests from the frontend.

## Installation

### Backend (Laravel)
1. Clone the repository:
   ```bash
   git clone https://github.com/andrelaurits11/invoice_system.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd invoice_system/backend
   ```
3. Install dependencies:
   ```bash
   composer install
   ```
4. Set up your `.env` file by copying the `.env.example` file and configuring your database settings:
   ```bash
   cp .env.example .env
   ```
5. Run database migrations:
   ```bash
   php artisan migrate
   ```
6. Start the Laravel server:
   ```bash
   php artisan serve
   ```

### Frontend (Next.js)
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

- **Your frontend will now be accessible at** `http://localhost:3000`.

## Usage

- Register or log in as a user.
- Manage your invoices and clients from the dashboard.
- Track the status of each invoice and generate reports in real-time.

## Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit a pull request. Please make sure to follow the code style used in the project and write tests for new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
