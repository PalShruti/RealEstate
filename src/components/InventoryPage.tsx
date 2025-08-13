import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw, Building, Car, TreePine, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { unitsService } from "@/services/unitsService";
import { FloorPlanModal } from "./FloorPlanModal";
import { AddUnitModal } from "./AddUnitModal";
import { EditUnitModal } from "./EditUnitModal";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface InventoryPageProps {
  isAdminLoggedIn?: boolean;
}

export const InventoryPage = ({ isAdminLoggedIn = false }: InventoryPageProps) => {
  const [activeView, setActiveView] = useState("exterior");
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isRotating, setIsRotating] = useState(false);
  const { toast } = useToast();

  // Fetch units data from Supabase
  const { data: unitsData = [], isLoading, refetch } = useQuery({
    queryKey: ['units'],
    queryFn: unitsService.getAllUnits,
  });

  const floorPlans = [
    {
      title: "Bungalow Plan",
      size:"", //"Premium Layout",
      description: "Ground Floor: A premium bungalow layout featuring a wide entrance, grand living area, dining space, modular kitchen, guest bedroom, and a utility zone. Surrounded by landscaped green space for peaceful living.\n\nFirst Floor: Includes a master bedroom with attached bathroom and balcony, two additional bedrooms, a family lounge, and terrace access. Ensures privacy, comfort, and a luxurious lifestyle.",
      price: "", //"Premium Pricing Available",
      features: ["Wide Entrance", "Grand Living Area", "Modular Kitchen", "Master Bedroom Suite", "Family Lounge", "Terrace Access"],
      amenities: ["Landscaped Gardens", "Peaceful Environment", "Privacy & Comfort", "Luxurious Lifestyle", "Multiple Balconies"],
      image: "/lovable-uploads/fa99ad8d-34a6-4f7d-a0a0-2e3b1d22b49f.png"
    },
    {
      title: "Site Plan", 
      size: "",//"Complete Overview",
      description: "The site plan offers a complete layout overview, including building positions, green zones, jogging tracks, amenity spaces, roads, and open areas. It highlights smart design and excellent internal connectivity.",
      price:"", // "Master Planning",
      features: ["Building Positions", "Green Zones", "Jogging Tracks", "Amenity Spaces", "Road Network", "Open Areas"],
      amenities: ["Smart Design", "Internal Connectivity", "Green Spaces", "Recreation Areas", "Well-planned Infrastructure"],
      image: "/lovable-uploads/3d761c09-4896-4e66-9f40-30bf944237f0.png"
    },
    {
      title: "Parking Plan",
      size: "",  //Efficient Design
      description: "Efficient parking design with covered slots, separate visitor parking, designated entry/exit routes, and clearly marked zones. Prioritizes convenience and smooth traffic flow.",
      price: "" , //Convenience Focused",
      features: ["Covered Parking Slots", "Visitor Parking", "Entry/Exit Routes", "Clearly Marked Zones", "Traffic Management"],
      amenities: ["Convenience", "Smooth Traffic Flow", "Security", "Easy Access", "Well-organized Layout"],
      image: "/lovable-uploads/84c550df-9160-4a7d-835f-868754e1f0aa.png"
    }
  ];

  const views = [
    { id: "exterior", name: "Exterior View", icon: Building },
    { id: "surroundings", name: "Nearby Surroundings", icon: MapPin }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Booked": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Sold": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewDetails = (plan: any) => {
    setSelectedFloorPlan(plan);
    setIsModalOpen(true);
  };

  const handleRotateView = () => {
    setIsRotating(true);
    toast({
      title: "Rotating View",
      description: "view is rotating...",
    });
    
    // Reset rotation after animation
    setTimeout(() => {
      setIsRotating(false);
    }, 2000);
  };

  const handleUnitAdded = () => {
    refetch();
    toast({
      title: "Success",
      description: "Unit added successfully!",
    });
  };

  const handleEditUnit = (unit: any) => {
    setSelectedUnit(unit);
    setIsEditUnitModalOpen(true);
  };

  const handleUnitUpdated = () => {
    refetch();
    toast({
      title: "Success",
      description: "Unit updated successfully!",
    });
  };

  const handleDeleteUnit = async (unitId: string, unitNumber: string) => {
    try {
      await unitsService.deleteUnit(unitId);
      refetch();
      toast({
        title: "Success",
        description: `Unit ${unitNumber} deleted successfully!`,
      });
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast({
        title: "Error",
        description: "Failed to delete unit. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-blue-600">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Property Inventory</h1>
          <p className="text-xl text-blue-700">Explore available units and floor plans</p>
        </div>

        {/* Dynamic Inventory Table */}
        <Card className="mb-12 shadow-xl border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-blue-900">Floor-wise Unit Availability</CardTitle>
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
                    <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-blue-900">Floor</th>
                    <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-blue-900">Unit Number</th>
                    <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-blue-900">BHK Type</th>
                    <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-blue-900">Size (sq. ft.)</th>
                    <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-blue-900">Price</th>
                    <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-blue-900">Status</th>
                    {isAdminLoggedIn && (
                      <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-blue-900">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {unitsData.map((unit) => (
                    <tr key={unit.id} className="hover:bg-blue-50 transition-colors">
                      <td className="border border-blue-200 px-4 py-3 text-blue-900">{unit.floor}</td>
                      <td className="border border-blue-200 px-4 py-3 text-blue-900 font-medium">{unit.unit_number}</td>
                      <td className="border border-blue-200 px-4 py-3 text-blue-900">{unit.bhk_type}</td>
                      <td className="border border-blue-200 px-4 py-3 text-blue-900">{unit.size_sqft}</td>
                      <td className="border border-blue-200 px-4 py-3 text-blue-900 font-semibold">₹{unit.price.toLocaleString()}</td>
                      <td className="border border-blue-200 px-4 py-3">
                        <Badge className={getStatusColor(unit.status)}>
                          {unit.status}
                        </Badge>
                      </td>
                      {isAdminLoggedIn && (
                        <td className="border border-blue-200 px-4 py-3">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUnit(unit)}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Unit</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete unit {unit.unit_number}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUnit(unit.id, unit.unit_number)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
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
                      <td colSpan={isAdminLoggedIn ? 7 : 6} className="border border-blue-200 px-4 py-8 text-center text-blue-600">
                        No units available. Add some units to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Floor Plans */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Floor Plans</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {floorPlans.map((plan, index) => (
              <Card key={index} className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-blue-100">
                 <CardHeader>
                      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden flex items-center justify-center h-[300px]">
  {plan.image ? (
    <img 
      src={plan.image} 
      alt={plan.title}
      className="h-full w-auto object-contain"
    />
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

        {/* 3D Simulation Section with Dynamic Rotate */}
        <Card className="shadow-xl border-blue-100">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-900 text-center">Property Simulation</CardTitle>
            <p className="text-center text-blue-700">Explore different views of your future home</p>
          </CardHeader>
          <CardContent>
            {/* View Toggle Buttons */}
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





            {/* View Display */}
            {/* <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-12 text-center"> */}
              
              {/* <div className="mb-6">
                {activeView === "exterior" && <Building className={`w-32 h-32 mx-auto text-blue-600 transition-transform duration-2000 ${isRotating ? 'animate-spin' : ''}`} />}
                {activeView === "interior" && <Eye className={`w-32 h-32 mx-auto text-blue-600 transition-transform duration-2000 ${isRotating ? 'animate-pulse' : ''}`} />}
                {activeView === "parking" && <Car className={`w-32 h-32 mx-auto text-blue-600 transition-transform duration-2000 ${isRotating ? 'animate-bounce' : ''}`} />}
                {activeView === "surroundings" && <MapPin className={`w-32 h-32 mx-auto text-blue-600 transition-transform duration-2000 ${isRotating ? 'animate-ping' : ''}`} />}
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                {views.find(v => v.id === activeView)?.name}
              </h3>
              <p className="text-blue-700 mb-6">
                Interactive 3D view coming soon. Experience the property in immersive detail.
              </p>
              <Button 
                onClick={handleRotateView}
                disabled={isRotating}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <RotateCcw className={`w-4 h-4 mr-2 ${isRotating ? 'animate-spin' : ''}`} />
                {isRotating ? 'Rotating...' : 'Rotate View'}
              </Button> */}


            {/* </div> */}
{/* View Display */}
<div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 text-center">
  {activeView === "exterior" && (
    <img
      src="/lovable-uploads/exterior.jpg" // replace with actual image path e.g. from public folder
      alt="Exterior View"
      className="mx-auto rounded-lg shadow-lg max-h-[500px] object-contain"
    />
  )}
  {activeView === "surroundings" && (
    <img
      src="/lovable-uploads/surroundings.jpg" // replace with actual image path
      alt="Nearby Surroundings"
      className="mx-auto rounded-lg shadow-lg max-h-[500px] object-contain"
    />
  )}
</div>








          </CardContent>
        </Card>

        {/* Modals */}
        <FloorPlanModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          floorPlan={selectedFloorPlan}
        />

        {isAdminLoggedIn && (
          <>
            <AddUnitModal
              isOpen={isAddUnitModalOpen}
              onClose={() => setIsAddUnitModalOpen(false)}
              onSuccess={handleUnitAdded}
            />
            <EditUnitModal
              isOpen={isEditUnitModalOpen}
              onClose={() => setIsEditUnitModalOpen(false)}
              onSuccess={handleUnitUpdated}
              unit={selectedUnit}
            />
          </>
        )}
      </div>
    </div>
  );
};