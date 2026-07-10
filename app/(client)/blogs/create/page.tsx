"use client";

import { useState } from "react";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });
  }

  return (
    <form onSubmit={handleSubmit}>

      <input
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        placeholder="Blog title"
      />

      {/* Rich Text Editor goes here */}

      <button>
        Save
      </button>

    </form>
  );
}