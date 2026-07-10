"use client";

export default function AuthorPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Author</h1>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Author Name"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Slug"
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          className="w-full border p-2 rounded"
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Author
        </button>
      </form>
    </div>
  );
}