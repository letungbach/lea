# Lea

A modern web application built with Next.js and styled with Tailwind CSS.

## Features

- Built with Next.js 14 for optimal performance and SEO
- Styled with Tailwind CSS for responsive design
- Automatic deployment to Vercel

## Tech Stack

- **Framework:** Next.js 14
- **Frontend:** React 18
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/letungbach/lea.git
   cd lea
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

This project is configured for automatic deployment on Vercel. Follow these steps:

### Option 1: Automatic Deployment (Recommended)

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your repository from GitHub

2. **Configure Project:**
   - Vercel will automatically detect this as a Next.js project
   - The build settings should be:
     - **Framework Preset:** Next.js
     - **Root Directory:** `./` (leave as default)
     - **Build Command:** `npm run build` (auto-detected)
     - **Output Directory:** `.next` (auto-detected)

3. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once deployed, you'll get a production URL (e.g., `lea.vercel.app`)

### Option 2: Manual Deployment

If you prefer to deploy manually:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to link your project and deploy.

### Automatic Deployments

After the initial setup, Vercel will automatically deploy new versions whenever you push changes to the `main` branch of your GitHub repository.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private.