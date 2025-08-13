import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building, Maximize, Users, Car, TreePine, Waves } from "lucide-react";

interface FloorPlan {
  title: string;
  size: string;
  description: string;
  price: string;
  features: string[];
  amenities: string[];
  image?: string;
}

interface FloorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  floorPlan: FloorPlan | null;
}

export const FloorPlanModal = ({ isOpen, onClose, floorPlan }: FloorPlanModalProps) => {
  if (!floorPlan) return null;

  const amenityIcons = {
    'Modern Gym': Waves,
    'Swimming Pool': Waves,
    'Landscaped Garden': TreePine,
    'Covered Parking': Car,
    'Community Hall': Users,
    'Children Play Area': Users,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">{floorPlan.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Floor Plan Image */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden">
  {floorPlan.image ? (
    <img 
      src={floorPlan.image} 
      alt={floorPlan.title}
      className="w-full h-auto object-contain max-h-[400px] mx-auto"
    />
  ) : (
    <div className="w-full h-64 flex items-center justify-center">
      <Building className="w-24 h-24 text-blue-600" />
    </div>
  )}
</div>


            <div className="text-center">
              <p className="text-sm text-blue-700">{floorPlan.title} Layout</p>
              <p className="text-xs text-blue-600">Detailed architectural view</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Maximize className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700">Size</p>
                    <p className="font-semibold text-blue-900">{floorPlan.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700">Price Range</p>
                    <p className="font-semibold text-blue-900">{floorPlan.price}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Description</h4>
              <div className="text-blue-700 space-y-2">
                {floorPlan.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {floorPlan.features.map((feature, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Available Amenities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {floorPlan.amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || TreePine;
                  return (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                      <IconComponent className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};