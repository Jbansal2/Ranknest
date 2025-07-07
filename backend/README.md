# Rankify Backend

A backend and dashboard for managing student results, statistics, and email notifications.

## Features

- **Dashboard**: Visualizes branch distribution, quick stats, and top rankers.
- **Student Management**: Search, filter, and view detailed student results.
- **Email**: Send emails to subscribers and individual students.
- **Subscription**: Manage email subscribers.

## Tech Stack

- **Frontend**: HTML, Tailwind CSS, Chart.js, Toastify.js, Axios
- **Backend**: Node.js, Express.js (API endpoints)
- **Database**: MongoDB (assumed from API structure)

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/rankify-backend.git
   cd rankify-backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file and add your MongoDB URI, JWT secret, and email credentials.

4. **Run the backend server**
   ```sh
   npm start
   ```
   The backend runs on `http://localhost:3000`.

5. **Access the dashboard**
   - Open `backend/public/dashboard.html` in your browser.

## API Endpoints

- `GET /api/auth/user` - Get current user info
- `GET /api/auth/students` - List all students
- `GET /api/auth/students/count` - Get student count by branch
- `GET /api/auth/students/search` - Search students by name or enrollment
- `GET /api/auth/students/branch` - Filter students by branch
- `GET /api/auth/students/enroll_no` - Get student by enrollment number
- `POST /api/auth/email/send-result` - Email result to a student
- `POST /api/auth/email/send-subscribed` - Email all subscribers
- `GET /api/auth/subscribe` - List subscribers
- `POST /api/auth/subscribe` - Add a subscriber
- `DELETE /api/auth/subscribe/delete/:id` - Remove a subscriber

## License

MIT

---

**Note:** Update URLs and instructions as per your deployment and configuration.
