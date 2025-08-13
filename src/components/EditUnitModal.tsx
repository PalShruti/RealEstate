import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { unitsService } from "@/services/unitsService";
import { useToast } from "@/hooks/use-toast";

interface Unit {
  id: string;
  floor: number;
  unit_number: string;
  bhk_type: string;
  size_sqft: number;
  price: number;
  status: string;
}

interface EditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  unit: Unit | null;
}

export const EditUnitModal = ({ isOpen, onClose, onSuccess, unit }: EditUnitModalProps) => {
  const [formData, setFormData] = useState({
    floor: unit?.floor?.toString() || "",
    unit_number: unit?.unit_number || "",
    bhk_type: unit?.bhk_type || "",
    size_sqft: unit?.size_sqft?.toString() || "",
    price: unit?.price?.toString() || "",
    status: unit?.status || "Available"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Update form data when unit prop changes
  useEffect(() => {
    if (unit) {
      setFormData({
        floor: unit.floor?.toString() || "",
        unit_number: unit.unit_number || "",
        bhk_type: unit.bhk_type || "",
        size_sqft: unit.size_sqft?.toString() || "",
        price: unit.price?.toString() || "",
        status: unit.status || "Available"
      });
    }
  }, [unit]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit) return;

    setIsSubmitting(true);
    
    try {
      const updateData = {
        floor: parseInt(formData.floor),
        unit_number: formData.unit_number,
        bhk_type: formData.bhk_type,
        size_sqft: parseInt(formData.size_sqft),
        price: parseFloat(formData.price),
        status: formData.status
      };

      await unitsService.updateUnit(unit.id, updateData);
      
      // Only call onSuccess to trigger parent component's success handling
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating unit:', error);
      toast({
        title: "Error",
        description: "Failed to update unit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!unit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor}
                onChange={(e) => handleInputChange("floor", e.target.value)}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="unit_number">Unit Number</Label>
              <Input
                id="unit_number"
                value={formData.unit_number}
                onChange={(e) => handleInputChange("unit_number", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bhk_type">BHK Type</Label>
            <Select value={formData.bhk_type} onValueChange={(value) => handleInputChange("bhk_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select BHK Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 BHK">1 BHK</SelectItem>
                <SelectItem value="2 BHK">2 BHK</SelectItem>
                <SelectItem value="3 BHK">3 BHK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="size_sqft">Size (sq ft)</Label>
              <Input
                id="size_sqft"
                type="number"
                value={formData.size_sqft}
                onChange={(e) => handleInputChange("size_sqft", e.target.value)}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Unit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};