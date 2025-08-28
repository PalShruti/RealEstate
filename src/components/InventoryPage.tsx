import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { unitsService } from "@/services/unitsService";
import { bungalowsService } from "@/services/bungalowsService";
import { FloorPlanModal } from "./FloorPlanModal";
import { AddUnitModal } from "./AddUnitModal";
import { EditUnitModal } from "./EditUnitModal";
import { AddBungalowModal } from "./AddBungalowModal";
import { EditBungalowModal } from "./EditBungalowModal";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface InventoryPageProps {
  isAdminLoggedIn?: boolean;
}

export const InventoryPage = ({ isAdminLoggedIn = false }: InventoryPageProps) => {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Units
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  // Bungalows
  const [isAddBungalowModalOpen, setIsAddBungalowModalOpen] = useState(false);
  const [isEditBungalowModalOpen, setIsEditBungalowModalOpen] = useState(false);
  const [selectedBungalow, setSelectedBungalow] = useState<any>(null);

  const { toast } = useToast();

  // Fetch units
  const {
    data: unitsData = [],
    isLoading: isLoadingUnits,
    refetch: refetchUnits,
  } = useQuery({
    queryKey: ["units"],
    queryFn: unitsService.getAllUnits,
  });

  // Fetch bungalows
  const {
    data: bungalowsData = [],
    isLoading: isLoadingBungalows,
    refetch: refetchBungalows,
  } = useQuery({
    queryKey: ["bungalows"],
    queryFn: bungalowsService.getAllBungalows,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Booked":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Sold":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  


  // ✅ FIXED: set row before opening edit modal
  const handleEditUnit = (unit: any) => {
    setSelectedUnit(unit);
    setIsEditUnitModalOpen(true);
  };

  const handleDeleteUnit = async (unitId: string, unitNumber: string) => {
    try {
      await unitsService.deleteUnit(unitId);
      refetchUnits();
      toast({
        title: "Success",
        description: `Unit ${unitNumber} deleted successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete unit.",
        variant: "destructive",
      });
    }
  };

  // ✅ FIXED: set row before opening edit modal
  const handleEditBungalow = (bungalow: any) => {
    setSelectedBungalow(bungalow);
    setIsEditBungalowModalOpen(true);
  };

  const handleDeleteBungalow = async (bungalowId: string, plotNumber: string) => {
    try {
      await bungalowsService.deleteBungalow(bungalowId);
      refetchBungalows();
      toast({
        title: "Success",
        description: `Bungalow ${plotNumber} deleted successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bungalow.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingUnits || isLoadingBungalows) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-600">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ============ Units Table ============ */}
        <Card className="mb-12 shadow-xl border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-blue-900">
              Floor-wise Unit Availability
            </CardTitle>
            {isAdminLoggedIn && (
              <Button
                onClick={() => setIsAddUnitModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Unit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <th className="border px-4 py-3">Floor</th>
                    <th className="border px-4 py-3">Unit Number</th>
                    <th className="border px-4 py-3">BHK Type</th>
                    <th className="border px-4 py-3">Size (sq.ft)</th>
                    <th className="border px-4 py-3">Price</th>
                    <th className="border px-4 py-3">Status</th>
                    {isAdminLoggedIn && <th className="border px-4 py-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {unitsData.map((unit: any) => (
                    <tr key={unit.id}>
                      <td className="border px-4 py-3">{unit.floor}</td>
                      <td className="border px-4 py-3">{unit.unit_number}</td>
                      <td className="border px-4 py-3">{unit.bhk_type}</td>
                      <td className="border px-4 py-3">{unit.size_sqft}</td>
                      <td className="border px-4 py-3">₹{unit.price.toLocaleString()}</td>
                      <td className="border px-4 py-3">
                        <Badge
  className={`${getStatusColor(unit.status)} ${unit.status === "Available" ? "cursor-pointer" : ""}`}
  onClick={() => {
    if (unit.status === "Available") {
      navigate('/procurement');
    }
  }}
>
  {unit.status}
</Badge>

                      </td>
                      {isAdminLoggedIn && (
                        <td className="border px-4 py-3">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditUnit(unit)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Unit</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {unit.unit_number}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUnit(unit.id, unit.unit_number)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ============ Bungalows Table ============ */}
        <Card className="mb-12 shadow-xl border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-blue-900">Bungalow Availability</CardTitle>
            {isAdminLoggedIn && (
              <Button
                onClick={() => setIsAddBungalowModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Bungalow
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <th className="border px-4 py-3">Plot / Unit Number</th>
                    <th className="border px-4 py-3">Bungalow Type</th>
                    <th className="border px-4 py-3">Size (sq.ft)</th>
                    <th className="border px-4 py-3">Price</th>
                    <th className="border px-4 py-3">Status</th>
                    {isAdminLoggedIn && <th className="border px-4 py-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {bungalowsData.map((bungalow: any) => (
                    <tr key={bungalow.id}>
                      <td className="border px-4 py-3">{bungalow.plot_number}</td>
                      <td className="border px-4 py-3">{bungalow.type}</td>
                      <td className="border px-4 py-3">{bungalow.size_sqft}</td>
                      <td className="border px-4 py-3">₹{bungalow.price.toLocaleString()}</td>
                      <td className="border px-4 py-3">
                        <Badge
  className={`${getStatusColor(bungalow.status)} ${bungalow.status === "Available" ? "cursor-pointer" : ""}`}
  onClick={() => {
    if (bungalow.status === "Available") {
      navigate('/procurement');
    }
  }}
>
  {bungalow.status}
</Badge>

                      </td>
                      {isAdminLoggedIn && (
                        <td className="border px-4 py-3">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditBungalow(bungalow)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Bungalow</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {bungalow.plot_number}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteBungalow(bungalow.id, bungalow.plot_number)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ===== Modals ===== */}
        <FloorPlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} floorPlan={selectedFloorPlan} />

        {isAdminLoggedIn && (
          <>
            <AddUnitModal isOpen={isAddUnitModalOpen} onClose={() => setIsAddUnitModalOpen(false)} onSuccess={refetchUnits} />
            <EditUnitModal isOpen={isEditUnitModalOpen} onClose={() => setIsEditUnitModalOpen(false)} onSuccess={refetchUnits} unit={selectedUnit} />

            <AddBungalowModal isOpen={isAddBungalowModalOpen} onClose={() => setIsAddBungalowModalOpen(false)} onSuccess={refetchBungalows} />
            <EditBungalowModal isOpen={isEditBungalowModalOpen} onClose={() => setIsEditBungalowModalOpen(false)} onSuccess={refetchBungalows} bungalow={selectedBungalow} />
          </>
        )}
      </div>
    </div>
  );
};