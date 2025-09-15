import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { get } from "./api/client";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/dashboard/admin")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!data) return <div>Loading Admin Dashboard...</div>;

  return (
    <div>
      <h2>Admin Dashboard 🛠️</h2>
      <p>{data.message}</p>
      <pre>{JSON.stringify(data.user, null, 2)}</pre>
    </div>
  );
}