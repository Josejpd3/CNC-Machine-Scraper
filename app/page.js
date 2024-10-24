'use client'
import ScraperControl from "../components/ScraperControl";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CNC Scraper</h1>
      <ScraperControl />
    </main>
  );
}
