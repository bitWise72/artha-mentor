# Artha Mentor: AI Finance Mentor

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://artha-ai-mentor.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)](https://nextjs.org)
[![Intelligence](https://img.shields.io/badge/AI-Architecture-cyan?style=for-the-badge)](./AI_ARCHITECTURE.md)

Artha is a high-end financial simulation platform built for professional financial planning. It integrates real-time market news from **The Economic Times**, powerful **FIRE (Financial Independence, Retire Early)** simulation math, and a multi-agent AI fallback system for 100% uptime.

**[Read the Full AI Architecture & Technical Workflow Here](./AI_ARCHITECTURE.md)**

![Artha Logo](public/images/artha_logo.png)

![Artha Game Engine](public/images/og-image.png)

## Getting Started

Follow these precise steps to run Artha Mentor seamlessly on your local machine.

1. Ensure you have Node.js version 18 or above installed.
2. Clone this repository and configure your local `.env` to include:
   - `GEMINI_API_KEY`
   - `FALL_BACK_API_1` & `FALL_BACK_API_2`
   - `TAVILY_API_KEY` (for live market news)
3. Open your terminal in the root directory.
4. Execute `npm install` to download all strict dependencies.
5. Execute `npm run dev` to launch the Next.js local development server.
6. Open your web browser and navigate to `http://localhost:3000`.
