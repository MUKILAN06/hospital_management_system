# Hospital Management System

A full-stack hospital management system with a Spring Boot backend and React frontend.

## Project Structure

- **/backend**: Spring Boot application (Java 17, Maven, MySQL/Aiven).
- **/frontend**: React application (Vite, React Router, Axios, Tailwind CSS).

## Deployment

- **Backend**: Deployed on **Render** (as a Docker container).
- **Frontend**: Deployed on **Vercel**.
- **Database**: Hosted on **Aiven** (MySQL).

## Getting Started

### Backend
1. Go to the `backend` folder.
2. Build the project: `./mvnw clean package`
3. Run the project: `java -jar target/demo-0.0.1-SNAPSHOT.jar`

### Frontend
1. Go to the `frontend` folder.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
