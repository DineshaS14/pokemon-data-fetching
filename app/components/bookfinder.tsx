"use client";
import { useState, useEffect, ChangeEvent } from "react";

// Define interfaces for Book and VolumeInfo to provide type safety
interface VolumeInfo {
  title: string; // Title of the book
  authors?: string[]; // Array of author names
  description?: string; // Short description of the book
  categories?: string[]; // Categories the book belongs to
  imageLinks?: {
    thumbnail?: string; // URL for the book's thumbnail image
  };
}

interface Book {
  id: string; // Unique ID for the book
  volumeInfo: VolumeInfo; // Detailed information about the book
}

export default function Bookfinder() {
  // State hooks with type annotations
  const [query, setQuery] = useState<string>(""); // User's search query
  const [books, setBooks] = useState<Book[]>([]); // List of books fetched
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error message, if any

  // Function to fetch books from the API
  async function fetchData(filterValue: string = "") {
    setError(null); // Reset error state
    setLoading(true); // Set loading to true

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`; // API URL

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data."); // Handle non-OK responses
      }

      const data = await response.json();
      let filteredBooks: Book[] = data.items || []; // Ensure a fallback to an empty array

      // Apply category filter if specified
      if (filterValue) {
        filteredBooks = filteredBooks.filter((book) =>
          book.volumeInfo.categories?.includes(filterValue)
        );
      }

      setBooks(filteredBooks); // Update book list
      setLoading(false); // Set loading to false
    } catch (error) {
        setError((error as Error).message); // Type assertion
        setLoading(false); // Set loading to false
    }
  }

  // Effect to fetch books when the query changes
  useEffect(() => {
    if (query) {
      fetchData(); // Call fetchData when query changes
    }
  }, [query]);

  // Input change handler for the search bar
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value); // Update query state with the user's input
  }

  // Search button handler
  function handleSearch() {
    if (query) {
      fetchData(); // Fetch data based on the current query
    }
  }

  // Filter change handler for category filtering
  function handleFilterChange(event: ChangeEvent<HTMLSelectElement>) {
    const filterValue = event.target.value; // Get the selected filter value
    fetchData(filterValue); // Fetch data with the filter applied
  }

  return (
    <div className="book-finder-container">
      <h1 className="text-2xl font-bold text-center mb-4">Book Finder</h1>

      {/* Input Fields */}
      <div className="input-fields flex flex-col items-center mb-6">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for books..."
          className="border p-2 rounded-md w-80 mb-2"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>

        <div className="mt-4">
          <label htmlFor="filter" className="mr-2">
            Filter by:
          </label>
          <select
            id="filter"
            onChange={handleFilterChange}
            className="border p-2 rounded-md"
          >
            <option value="">All</option>
            <option value="Paid ebooks">Paid E-books</option>
            <option value="free-ebooks">Free E-books</option>
          </select>
        </div>
      </div>

      {/* Loading and Error Messages */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Book List */}
      <ul className="book-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <li
            key={book.id}
            className="book border rounded-md p-4 transition duration-300 hover:bg-black hover:text-white"
          >
            {/* Book Thumbnail */}
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                className="book-cover w-full h-48 object-cover mb-4"
              />
            )}
            {/* Book Info */}
            <div className="book-info">
              <h2 className="text-lg font-semibold mb-2">
                {book.volumeInfo.title}
              </h2>
              <p className="text-sm text-gray-600">
                {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
              </p>
              <p className="text-sm mt-2">
                {book.volumeInfo.description
                  ? book.volumeInfo.description
                  : "No description available"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
