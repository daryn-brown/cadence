
# Cadence

![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-f7df1e?logo=javascript&logoColor=black&style=for-the-badge)
![SQL](https://img.shields.io/badge/SQL-336791?logo=postgresql&logoColor=white&style=for-the-badge)


# Cadence

**Cadence** is a modern contract management and performance tracking platform built with Next.js, Prisma, and a robust PostgreSQL backend. It streamlines the contractor-manager relationship by providing structured, transparent, and actionable workflows for contract cycles, goal setting, feedback, and performance reviews.

## 🚀 Key Features

- **Contract Lifecycle Management:**  
  Track contracts from initiation to completion, including start/end dates, status, and participant roles (Manager/Contractor).

- **Connect Cycles:**  
  Structured touchpoints (Initial, Midpoint, Final) for contractors and managers to align on goals, progress, and feedback. Each cycle supports reflections, comments, and status tracking.

- **Goal Setting & Tracking:**  
  Define, update, and monitor contract goals with clear metrics and statuses (On Track, At Risk, Completed).

- **Peer Feedback & Comments:**  
  Enable transparent, contextual feedback and discussion throughout the contract period.

- **Role-Based Portals:**
  - **Contractor Portal:** Submit cycle reflections, track goals, and view manager feedback.
  - **Manager Portal:** Review submissions, provide feedback, and manage multiple contracts.

- **Modern UI:**  
  Built with Radix UI, Tailwind CSS, and Lucide icons for a clean, accessible, and responsive experience.

- **Authentication & Security:**  
  Integrated with NextAuth and Prisma Adapter for secure, role-based access.

## 🏆 Why Cadence?

- **Transparency:**  
  Both contractors and managers have a clear, shared view of progress, expectations, and feedback.

- **Accountability:**  
  Structured cycles and goal tracking ensure everyone stays aligned and responsible.

- **Scalability:**  
  Designed to support organizations managing multiple contracts and users.

- **Extensibility:**  
  Built with modern, open-source technologies for easy customization and integration.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Radix UI, Lucide Icons
- **Backend:** Prisma ORM, PostgreSQL
- **Authentication:** NextAuth.js with Prisma Adapter
- **Email & Notifications:** Nodemailer, Resend
- **TypeScript:** End-to-end type safety

## 🗂️ Project Structure

- `src/app/contract/` – Contractor cadence workflows and UI
- `src/app/manager/` – Manager portal for contract oversight
- `src/app/api/` – RESTful API endpoints for contracts, cycles, comments, and authentication
- `prisma/schema.prisma` – Database schema (users, contracts, cycles, goals, comments, feedback)
- `src/components/ui/` – Reusable UI components

## 🚦 Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up your database:**
   - Configure your PostgreSQL connection in `.env` (`DATABASE_URL`)
   - Run migrations:
     ```bash
     npx prisma migrate deploy
     ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Visit:**  
    [http://localhost:3000](http://localhost:3000)


## 📈 Value Proposition

Cadence transforms contract management from a static, document-driven process into a dynamic, collaborative journey. By structuring communication, feedback, and goal tracking, it empowers organizations to maximize contractor performance, foster trust, and drive successful outcomes.
