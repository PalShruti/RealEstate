import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bungalowsService, Bungalow } from "@/services/bungalowsService";

export interface EditBungalowModalProps {
  isOpen: boolean;
  onClose: () => void;
  bungalow: Bungalow | null;
  onSuccess: () => void;
}

export const EditBungalowModal = ({ isOpen, onClose, bungalow, onSuccess }: EditBungalowModalProps) => {
  const [form, setForm] = useState({
    plot_number: "",
    type: "",
    size_sqft: "",
    price: "",
    status: "Available" as "Available" | "Booked" | "Sold",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bungalow) {
      setForm({
        plot_number: bungalow.plot_number ?? "",
        type: bungalow.type ?? "",
        size_sqft: String(bungalow.size_sqft ?? ""),
        price: String(bungalow.price ?? ""),
        status: bungalow.status ?? "Available",
      });
    }
  }, [bungalow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!bungalow) return;
    try {
      setSaving(true);
      await bungalowsService.updateBungalow(bungalow.id, {
        plot_number: form.plot_number.trim(),
        type: form.type.trim(),
        size_sqft: Number(form.size_sqft),
        price: Number(form.price),
        status: form.status,
      });
      onSuccess();
      onClose();
    } catch (e) {
      console.error("Update bungalow failed:", e);
      alert("Failed to update bungalow");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !bungalow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bungalow</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input name="plot_number" placeholder="Plot / Unit Number" value={form.plot_number} onChange={handleChange} />
          <Input name="type" placeholder="Bungalow Type" value={form.type} onChange={handleChange} />
          <Input type="number" name="size_sqft" placeholder="Size (sq.ft)" value={form.size_sqft} onChange={handleChange} />
          <Input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-md h-10 px-3 w-full"
          >
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
            {saving ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};