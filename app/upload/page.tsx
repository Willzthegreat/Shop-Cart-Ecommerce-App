"use client";

export default function Upload() {
  async function upload() {
    await fetch("/api/products", {
      method: "POST",
    });

    alert("Uploaded");
  }

  return (
    <button onClick={upload} className="bg-green-700 text-white p-3">
      Upload Products
    </button>
  );
}
