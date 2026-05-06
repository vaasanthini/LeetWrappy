# LeetWrapped

**LeetWrapped** is a modern web app that visualizes your LeetCode journey in a beautiful, Spotify-Wrapped style interface. It helps developers reflect on their coding progress, compare profiles, and explore yearly stats in a clean, interactive way.

---

##  Features

-  **LeetCode Profile Visualization**
  - Total problems solved
  - Difficulty breakdown (Easy / Medium / Hard)
  - Progress over time

-  **Single User Mode**
  - Enter a LeetCode username
  - Generate a personalized coding “wrapped”

-  **Compare Mode**
  - Compare stats between two users side-by-side

-  **Year Selection**
  - View stats for different years (e.g., 2024, 2025, 2026)

-  **Modern UI**
  - Dark themed, responsive interface
  - Smooth animations and interactive charts

---

## Tech Stack

- **Next.js** – React framework for frontend + API routes
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **Recharts / Charting Library** – Data visualization
- **LeetCode API (unofficial / scraping layer)** – Fetching user stats

---

##  Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/leetwrapped.git
cd leetwrapped

2. Install dependencies
npm install

3. Run development server
npm run dev

4. Open in browser
http://localhost:3000

Project Structure

app/              # Next.js app router pages
lib/              # Utility functions and API services
models/           # Data models / types
services/         # API service layer (LeetCode fetching logic)
public/           # Static assets