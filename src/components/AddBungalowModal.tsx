import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { bungalowsService } from "@/services/bungalowsService";

export interface AddBungalowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // you already call refetchBungalows in InventoryPage
}

export const AddBungalowModal = ({ isOpen, onClose, onSuccess }: AddBungalowModalProps) => {
  const [form, setForm] = useState({
    plot_number: "",
    type: "",
    size_sqft: "",
    price: "",
    status: "Available" as "Available" | "Booked" | "Sold",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await bungalowsService.addBungalow({
        plot_number: form.plot_number.trim(),
        type: form.type.trim(),
        size_sqft: Number(form.size_sqft),
        price: Number(form.price),
        status: form.status,
      });
      onSuccess();
      onClose();
      setForm({ plot_number: "", type: "", size_sqft: "", price: "", status: "Available" });
    } catch (e) {
      console.error("Add bungalow failed:", e);
      alert("Failed to add bungalow");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Bungalow</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="plot_number" className="text-blue-700">Plot / Unit Number</Label>
            <Input
              id="plot_number"
              name="plot_number"
              placeholder="Plot / Unit Number"
              value={form.plot_number}
              onChange={handleChange}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="type" className="text-blue-700">Bungalow Type</Label>
            <Input
              id="type"
              name="type"
              placeholder="Bungalow Type (e.g., 3 BHK Duplex)"
              value={form.type}
              onChange={handleChange}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="size_sqft" className="text-blue-700">Size (sq.ft)</Label>
            <Input
              id="size_sqft"
              type="number"
              name="size_sqft"
              placeholder="Size (sq.ft)"
              value={form.size_sqft}
              onChange={handleChange}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-blue-700">Price</Label>
            <Input
              id="price"
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-blue-700">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value as "Available" | "Booked" | "Sold" })}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
