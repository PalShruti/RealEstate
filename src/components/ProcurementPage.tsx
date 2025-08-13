import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home, Car, Calendar, Phone, User, CheckCircle, Building2, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { bookingService } from "@/services/bookingService";
import { validatePhoneNumber, formatPhoneNumber } from "@/utils/phoneValidation";
import { useMutation } from "@tanstack/react-query";
export const ProcurementPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    bhkType: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Mutation for creating booking
  const createBookingMutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      setIsModalOpen(false);
      setShowSuccessPopup(true);
      setFormData({
        name: "",
        contact: "",
        bhkType: ""
      });
      toast({
        title: "Booking Successful",
        description: "Your visit has been booked successfully. We'll contact you soon!"
      });

      // Auto close success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    },
    onError: error => {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    }
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    if (!formData.contact.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your contact number",
        variant: "destructive"
      });
      return;
    }
    if (!formData.bhkType) {
      toast({
        title: "Missing Information",
        description: "Please select your preferred BHK type",
        variant: "destructive"
      });
      return;
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(formData.contact);
    const phoneValidation = validatePhoneNumber(formattedPhone);
    if (!phoneValidation.isValid) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid international phone number (e.g., +919876543210)",
        variant: "destructive"
      });
      return;
    }

    // Create booking with properly formatted data
    createBookingMutation.mutate({
      name: formData.name.trim(),
      contact_number: formattedPhone,
      bhk_type: formData.bhkType,
      status: 'pending'
    });
  };
  const amenities = [{
    icon: Building2,
    name: "Terrace Garden",
    description: "Beautiful rooftop garden space"
  }, {
    icon: Zap,
    name: "Lift",
    description: "High-speed elevator access"
  }, {
    icon: Car,
    name: "Parking",
    description: "Secure covered parking"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-blue-800/20"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Dream Home Awaits
            </h1>
            <p className="text-xl text-blue-100">
              Experience premium living in the heart of the city
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">Property Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Prime Location</h3>
                  <p className="text-blue-700">SANE GURUJI VASAHAT, NEAR DESHMUKH HIGH SCHOOL, KOLHAPUR – 416012</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Configuration Options</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["1 BHK", "2 BHK", "3 BHK"].map(config => <span key={config} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                        {config}
                      </span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">Amenities</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
              {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">{amenity.name}</h4>
                      <p className="text-sm text-blue-700">{amenity.description}</p>
                    </div>
                  </div>;
            })}
            </div>
          </div>
        </div>

        {/* Book a Visit Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Premium Living?</h2>
          <p className="text-xl mb-8 opacity-90">Book a personalized visit to explore your future home</p>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
                <Calendar className="w-5 h-5 mr-2" />
                Book a Visit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-blue-200">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-blue-900">Book Your Visit</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-blue-800">Full Name *</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
                    <Input id="name" type="text" required placeholder="Enter your full name" className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200" value={formData.name} onChange={e => setFormData({
                    ...formData,
                    name: e.target.value
                  })} />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="contact" className="text-sm font-medium text-blue-800">Contact Number *</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
                    <Input id="contact" type="tel" required placeholder="Enter your phone number" className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200" value={formData.contact} onChange={e => setFormData({
                    ...formData,
                    contact: e.target.value
                  })} />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Format: +[country code][number] (no spaces or special characters)</p>
                </div>

                <div>
                  <Label htmlFor="bhkType" className="text-sm font-medium text-blue-800">Preferred Configuration *</Label>
                  <Select onValueChange={value => setFormData({
                  ...formData,
                  bhkType: value
                })}>
                    <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Select BHK type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 BHK">1 BHK</SelectItem>
                      <SelectItem value="2 BHK">2 BHK</SelectItem>
                      <SelectItem value="3 BHK">3 BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300" disabled={createBookingMutation.isPending}>
                  {createBookingMutation.isPending ? "Booking..." : "Done"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Success Popup */}
        <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
          <DialogContent className="sm:max-w-md border-blue-200 text-center">
            <div className="flex flex-col items-center space-y-4 py-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-blue-900 mb-2">Visit Booked Successfully!</DialogTitle>
                <p className="text-blue-700">
                  Thank you for your interest. Our team will contact you soon to confirm your visit details.
                </p>
              </div>
              <Button onClick={() => setShowSuccessPopup(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};