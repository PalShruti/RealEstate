
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { unitsService } from "@/services/unitsService";
import { useToast } from "@/hooks/use-toast";

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddUnitModal = ({ isOpen, onClose, onSuccess }: AddUnitModalProps) => {
  const [formData, setFormData] = useState({
    floor: '',
    unit_number: '',
    bhk_type: '',
    size_sqft: '',
    price: '',
    status: 'Available'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      floor: '',
      unit_number: '',
      bhk_type: '',
      size_sqft: '',
      price: '',
      status: 'Available'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      const floor = parseInt(formData.floor);
      const size_sqft = parseInt(formData.size_sqft);
      const price = parseFloat(formData.price);

      if (isNaN(floor) || floor < 1) {
        throw new Error("Floor must be a valid number greater than 0");
      }
      if (isNaN(size_sqft) || size_sqft < 1) {
        throw new Error("Size must be a valid number greater than 0");
      }
      if (isNaN(price) || price < 0) {
        throw new Error("Price must be a valid number greater than or equal to 0");
      }
      if (!formData.unit_number.trim()) {
        throw new Error("Unit number is required");
      }
      if (!formData.bhk_type) {
        throw new Error("BHK type is required");
      }

      console.log('Submitting unit data:', formData);
      
      await unitsService.addUnit({
        floor: floor,
        unit_number: formData.unit_number.trim(),
        bhk_type: formData.bhk_type,
        size_sqft: size_sqft,
        price: price,
        status: formData.status
      });

      console.log('Unit added successfully');
      
      // Reset form
      resetForm();
      
      // Call success callback which will show toast and refresh data
      onSuccess();
      
      // Close modal
      onClose();
      
    } catch (error: any) {
      console.error('Error adding unit:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to add unit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-blue-900">Add New Unit</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="floor" className="text-blue-700">Floor</Label>
            <Input
              id="floor"
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              required
              min="1"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="unit_number" className="text-blue-700">Unit Number</Label>
            <Input
              id="unit_number"
              value={formData.unit_number}
              onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
              required
              placeholder="e.g., 101, 201A"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="bhk_type" className="text-blue-700">BHK Type</Label>
            <Select 
              value={formData.bhk_type} 
              onValueChange={(value) => setFormData({ ...formData, bhk_type: value })}
              required
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Select BHK type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 BHK">1 BHK</SelectItem>
                <SelectItem value="2 BHK">2 BHK</SelectItem>
                <SelectItem value="3 BHK">3 BHK</SelectItem>
                <SelectItem value="4 BHK">4 BHK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="size_sqft" className="text-blue-700">Size (sq. ft.)</Label>
            <Input
              id="size_sqft"
              type="number"
              value={formData.size_sqft}
              onChange={(e) => setFormData({ ...formData, size_sqft: e.target.value })}
              required
              min="1"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-blue-700">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              min="0"
              step="0.01"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-blue-700">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Adding..." : "Add Unit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
