# ArcFusion Frontend

A modern React-based frontend application for ArcFusion, featuring PDF document upload and AI-powered chat functionality. Built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **PDF Document Upload**: Drag-and-drop interface for uploading PDF files
- **AI Chat Interface**: Interactive chat panel for document-based conversations
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: WebSocket integration for live chat functionality
- **File Management**: View and manage uploaded documents
- **Modern UI**: Clean, accessible interface with Lucide React icons

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Development**: ESLint, Storybook

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (optional, for containerized development)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>   
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Docker Development

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/                 # API client and WebSocket utilities
├── components/          # Reusable React components
├── pages/              # Page components (Upload, Chat)
├── store/              # Redux store configuration
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## 🎯 Usage

### Upload Page (`/`)
- Drag and drop PDF files or click to browse
- View upload progress and status
- Access uploaded files list

### Chat Page (`/chat`)
- View all uploaded documents
- Start conversations about your documents
- Real-time chat with AI assistant
- Navigate back to upload page

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

### API Configuration

The application expects a backend API running on the configured URL. The API should support:

- File upload endpoints
- WebSocket connections for real-time chat
- File management endpoints

## 🎨 Styling

This project uses Tailwind CSS for styling. The design system includes:

- Dark/light theme support
- Responsive breakpoints
- Custom color palette
- Accessible components

## 📚 Storybook

Component documentation and development is available through Storybook:

```bash
npm run storybook
```

Access Storybook at `http://localhost:6006`

## 🐳 Docker

### Development
```bash
docker-compose up --build
```

### Production Build
```bash
docker build -t arcfusion-frontend .
docker run -p 5173:5173 arcfusion-frontend
```
