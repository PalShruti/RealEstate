import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Users, Star, ArrowRight, Building, TreePine, Car, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const features = [
    { icon: MapPin, title: "Prime Location", description: "SANE GURUJI VASAHAT, NEAR DESHMUKH HIGH SCHOOL, KOLHAPUR – 416012" },
    { icon: Home, title: "Modern Design", description: "COMTEMPORARY ARCHITECTURE WITH PREMIUM FINISHES AND SPACIOUS LAYOUTS" },
    { icon: Users, title: "Community Living", description: "VIBERANT COMMUNITY WITH WORLD-CLASS AMENITIES AND GREEN SPACES" }
  ];

  const amenities = [
    { icon: Building, name: "Modern Gym" },
    { icon: TreePine, name: "Landscaped Garden" },
    { icon: Waves, name: "Swimming Pool" },
    { icon: Car, name: "Covered Parking" }
  ];

  const testimonials = [
    { name: "Rahul Sharma", rating: 5, comment: "Excellent location and amazing amenities. The construction quality is top-notch!" },
    { name: "Priya Singh", rating: 5, comment: "Great investment opportunity. The project is well-planned and the team is professional." },
    { name: "Amit Kumar", rating: 5, comment: "Beautiful homes with modern design. Highly recommend for families looking for quality living." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/NIGHT2.jpg"
            alt="Building Background"
            className="w-full h-full object-cover brightness-90 blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-blue-700/20 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Building Dreams with Emotions!!
          </h1>
          <p className="text-xl md:text-1.5xl mb-8 text-blue-100 max-w-4xl mx-auto">
            We don’t just build structures we craft spaces filled with warmth, comfort, and joy. <br />
            Experience a lifestyle where emotions meet elegance, right in the heart of your dream home.


          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/procurement')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Explore Properties
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/inventory')}
              className="border-white text-blue-600 hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
            >
              View Inventory
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-[80px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Why Choose Our Properties?
            </h2>
            <p className="text-xl text-blue-700 max-w-3xl mx-auto">
              Discover the perfect blend of luxury, comfort, and convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-blue-100">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-blue-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-700">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
     
      {/* Testimonials Section */}
      

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make This Your Home?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Don't miss this opportunity to own your dream home in one of Noida's most prestigious developments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/procurement')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Schedule a Visit
            </Button>
            <Button
              size="lg"
             
              onClick={() => navigate('/inventory')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Explore Units
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
