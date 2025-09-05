import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Eye, Building, MapPin } from "lucide-react";
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
  // ===== Shared state =====
  const navigate = useNavigate();
  const { toast } = useToast();

  // ===== Units state =====
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  // ===== Bungalows state =====
  const [isAddBungalowModalOpen, setIsAddBungalowModalOpen] = useState(false);
  const [isEditBungalowModalOpen, setIsEditBungalowModalOpen] = useState(false);
  const [selectedBungalow, setSelectedBungalow] = useState<any>(null);

  // ===== Floor Plan modal state =====
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===== 3D Simulation state =====
  const [activeView, setActiveView] = useState("exterior");

  // ===== Fetch data =====
  const {
    data: unitsData = [],
    isLoading: isLoadingUnits,
    refetch: refetchUnits,
  } = useQuery({
    queryKey: ["units"],
    queryFn: unitsService.getAllUnits,
  });

  const {
    data: bungalowsData = [],
    isLoading: isLoadingBungalows,
    refetch: refetchBungalows,
  } = useQuery({
    queryKey: ["bungalows"],
    queryFn: bungalowsService.getAllBungalows,
  });

  // ===== Helpers =====
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

  // ===== Floor Plans (from your friend's code) =====
  const floorPlans = [
    {
      title: "Bungalow Plan",
      size: "",
      description:
        "Ground Floor: A premium bungalow layout featuring a wide entrance, grand living area, dining space, modular kitchen, guest bedroom, and a utility zone. Surrounded by landscaped green space for peaceful living.\n\nFirst Floor: Includes a master bedroom with attached bathroom and balcony, two additional bedrooms, a family lounge, and terrace access. Ensures privacy, comfort, and a luxurious lifestyle.",
      features: [
        "Wide Entrance",
        "Grand Living Area",
        "Modular Kitchen",
        "Master Bedroom Suite",
        "Family Lounge",
        "Terrace Access",
      ],
      amenities: [
        "Landscaped Gardens",
        "Peaceful Environment",
        "Privacy & Comfort",
        "Luxurious Lifestyle",
        "Multiple Balconies",
      ],
      image: "/lovable-uploads/fa99ad8d-34a6-4f7d-a0a0-2e3b1d22b49f.png",
    },
    {
      title: "Flat Plan",
      size: "",
      description:
        "The site plan offers a complete layout overview, including building positions, green zones, jogging tracks, amenity spaces, roads, and open areas. It highlights smart design and excellent internal connectivity.",
      features: [
        "Building Positions",
        "Green Zones",
        "Jogging Tracks",
        "Amenity Spaces",
        "Road Network",
        "Open Areas",
      ],
      amenities: [
        "Smart Design",
        "Internal Connectivity",
        "Green Spaces",
        "Recreation Areas",
        "Well-planned Infrastructure",
      ],
      image: "/lovable-uploads/3d761c09-4896-4e66-9f40-30bf944237f0.png",
    },
    {
      title: "Site Plan",
      size: "",
      description:
        "Efficient parking design with covered slots, separate visitor parking, designated entry/exit routes, and clearly marked zones. Prioritizes convenience and smooth traffic flow.",
      features: [
        "Covered Parking Slots",
        "Visitor Parking",
        "Entry/Exit Routes",
        "Clearly Marked Zones",
        "Traffic Management",
      ],
      amenities: [
        "Convenience",
        "Smooth Traffic Flow",
        "Security",
        "Easy Access",
        "Well-organized Layout",
      ],
      image: "/lovable-uploads/84c550df-9160-4a7d-835f-868754e1f0aa.png",
    },
  ];

  const views = [
    { id: "exterior", name: "Exterior View", icon: Building },
    { id: "surroundings", name: "Nearby Surroundings", icon: MapPin },
  ];

  // ===== Event handlers =====
  const handleEditUnit = (unit: any) => {
    setSelectedUnit(unit);
    setIsEditUnitModalOpen(true);
  };

  const handleDeleteUnit = async (unitId: string, unitNumber: string) => {
    try {
      await unitsService.deleteUnit(unitId);
      refetchUnits();
      toast({ title: "Success", description: `Unit ${unitNumber} deleted successfully!` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete unit.", variant: "destructive" });
    }
  };

  const handleEditBungalow = (bungalow: any) => {
    setSelectedBungalow(bungalow);
    setIsEditBungalowModalOpen(true);
  };

  const handleDeleteBungalow = async (bungalowId: string, plotNumber: string) => {
    try {
      await bungalowsService.deleteBungalow(bungalowId);
      refetchBungalows();
      toast({ title: "Success", description: `Bungalow ${plotNumber} deleted successfully!` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete bungalow.", variant: "destructive" });
    }
  };

  const handleViewDetails = (plan: any) => {
    setSelectedFloorPlan(plan);
    setIsModalOpen(true);
  };

  // ===== Loading state =====
  if (isLoadingUnits || isLoadingBungalows) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-600">Loading inventory...</div>
      </div>
    );
  }

  // ===== Render =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============ Units Table (Floor-wise Availability) ============ */}
        <Card className="mb-12 shadow-xl border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-blue-900">
              Floor-wise Unit Availability
            </CardTitle>
            {isAdminLoggedIn && (
              <Button onClick={() => setIsAddUnitModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                      <td className="border px-4 py-3">₹{Number(unit.price).toLocaleString()}</td>
                      <td className="border px-4 py-3">
                        <Badge
                          className={`${getStatusColor(unit.status)} ${unit.status === "Available" ? "cursor-pointer" : ""}`}
                          onClick={() => {
                            if (unit.status === "Available") {
                              navigate("/procurement#book-visit");
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
                  {unitsData.length === 0 && (
                    <tr>
                      <td colSpan={isAdminLoggedIn ? 7 : 6} className="border px-4 py-8 text-center text-blue-600">
                        No units available. Add some units to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ============ Bungalows Table (Bungalow-wise Availability) ============ */}
        <Card className="mb-12 shadow-xl border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-blue-900">Bungalow Availability</CardTitle>
            {isAdminLoggedIn && (
              <Button onClick={() => setIsAddBungalowModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                      <td className="border px-4 py-3">₹{Number(bungalow.price).toLocaleString()}</td>
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
                  {bungalowsData.length === 0 && (
                    <tr>
                      <td colSpan={isAdminLoggedIn ? 7 : 6} className="border px-4 py-8 text-center text-blue-600">
                        No bungalows available. Add some bungalows to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ============ Floor Plans Section ============ */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Floor Plans</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {floorPlans.map((plan, index) => (
              <Card key={index} className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-blue-100">
                <CardHeader>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden flex items-center justify-center h-[300px]">
                    {plan.image ? (
                      <img src={plan.image} alt={plan.title} className="h-full w-auto object-contain" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Building className="w-24 h-24 text-blue-600" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{plan.title}</h3>
                  <p className="text-blue-700 mb-2">{plan.description.substring(0, 80)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-blue-600">{plan.size}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(plan)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ============ 3D Simulation Section ============ */}
        <Card className="shadow-xl border-blue-100">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-900 text-center">Property Simulation</CardTitle>
            <p className="text-center text-blue-700">Explore different views of your future home</p>
          </CardHeader>
          <CardContent>
            {/* Toggle buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {views.map((view) => {
                const Icon = view.icon;
                return (
                  <Button
                    key={view.id}
                    variant={activeView === view.id ? "default" : "outline"}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                      activeView === view.id
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-blue-200 text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{view.name}</span>
                  </Button>
                );
              })}
            </div>

            {/* View area */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 text-center">
              {activeView === "exterior" && (
                <img
                  src="/lovable-uploads/exterior.jpg" // replace with your actual image path
                  alt="Exterior View"
                  className="mx-auto rounded-lg shadow-lg max-h-[500px] object-contain"
                />
              )}
              {activeView === "surroundings" && (
                <img
                  src="/lovable-uploads/surroundings.jpg" // replace with your actual image path
                  alt="Nearby Surroundings"
                  className="mx-auto rounded-lg shadow-lg max-h-[500px] object-contain"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* ===== Modals ===== */}
        <FloorPlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} floorPlan={selectedFloorPlan} />

        {isAdminLoggedIn && (
          <>
            {/* Units modals */}
            <AddUnitModal isOpen={isAddUnitModalOpen} onClose={() => setIsAddUnitModalOpen(false)} onSuccess={refetchUnits} />
            <EditUnitModal
              isOpen={isEditUnitModalOpen}
              onClose={() => setIsEditUnitModalOpen(false)}
              onSuccess={refetchUnits}
              unit={selectedUnit}
            />

            {/* Bungalows modals */}
            <AddBungalowModal
              isOpen={isAddBungalowModalOpen}
              onClose={() => setIsAddBungalowModalOpen(false)}
              onSuccess={refetchBungalows}
            />
            <EditBungalowModal
              isOpen={isEditBungalowModalOpen}
              onClose={() => setIsEditBungalowModalOpen(false)}
              onSuccess={refetchBungalows}
              bungalow={selectedBungalow}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;