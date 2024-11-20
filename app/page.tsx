'use client';
import Link from "next/link";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-4xl font-bold mb-6">Choose Your Path</h1>
      <div className="flex space-x-4">
        {/* Pokedex Button */}
        <Link href="/pokedex" 
        className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-semibold hover:bg-red-600"
        >Pokemon</Link>

        {/* BookFinder Button */}
        <Link href="/bookfinder"
        className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-semibold hover:bg-yellow-600"
        >Bookfinder</Link>
      </div>
    </div>
  );
} // App


