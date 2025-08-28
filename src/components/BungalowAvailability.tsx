import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Bungalow {
  id: number;
  plot_number: string;
  bungalow_type: string;
  size_sqft: number;
  price: number;
  status: "Available" | "Booked";
}

const BungalowAvailability: React.FC = () => {
  const [bungalows, setBungalows] = useState<Bungalow[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/bungalows")
      .then((res) => res.json())
      .then((data) => setBungalows(data));
  }, []);

  const handleBookVisit = () => {
  navigate("/procurement#book-visit");
};

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
              className={`${
                b.status === "Booked"
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-green-50 cursor-pointer"
              }`}
            >
              <td className="border p-2">{b.plot_number}</td>
              <td className="border p-2">{b.bungalow_type}</td>
              <td className="border p-2">{b.size_sqft}</td>
              <td className="border p-2">₹{b.price}</td>
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
    </div>
  );
};

export default BungalowAvailability;