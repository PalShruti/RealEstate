// src/components/BungalowAvailability.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bungalowsService, type Bungalow } from "@/services/bungalowsService";

const BungalowAvailability: React.FC = () => {
  const [bungalows, setBungalows] = useState<Bungalow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await bungalowsService.getAllBungalows();
        setBungalows(data);
      } catch (err: any) {
        console.error("Failed to fetch bungalows:", err);
        setError(err?.message ?? "Failed to fetch bungalows");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleBookVisit = () => {
    navigate("/procurement#book-visit");
  };

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-white shadow rounded">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-white shadow rounded text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Bungalow Availability</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Plot Number</th>
            <th className="border p-2">Bungalow Type</th>
            <th className="border p-2">Size (sq.ft)</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bungalows.map((b) => (
            <tr
              key={b.id}
              onClick={b.status === "Available" ? handleBookVisit : undefined}
              className={
                b.status === "Available"
                  ? "hover:bg-green-50 cursor-pointer"
                  : "bg-gray-200 cursor-not-allowed"
              }
            >
              <td className="border p-2">{b.plot_number}</td>
              <td className="border p-2">{b.type}</td>
              <td className="border p-2">
                {b.size_sqft?.toLocaleString?.("en-IN") ?? b.size_sqft}
              </td>
              <td className="border p-2">
                ₹{b.price?.toLocaleString?.("en-IN") ?? b.price}
              </td>
              <td
                className={`border p-2 font-semibold ${
                  b.status === "Available" ? "text-green-600" : "text-red-500"
                }`}
              >
                {b.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bungalows.length === 0 && (
        <div className="text-sm text-gray-500 mt-3">
          No bungalows found.
        </div>
      )}
    </div>
  );
};

export default BungalowAvailability;
