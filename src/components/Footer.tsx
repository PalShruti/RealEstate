import { Facebook, Instagram, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/7028661826", "_blank");
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center text-center">
          {/* Company Info */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Veerashri Heights
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm">
              Building emotions into every home. Experience luxury living with world-class amenities and emotional comfort.
            </p>
            <div className="flex space-x-4 justify-center">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Us - Centered */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 097/2/C, PLOT NO. 8.9.10, A WARD, MATOSHRI<br />PRAMILA SARNAIK PARK,
                SANE GURUJI VASAHAT, NEAR DESHMUKH HIGH SCHOOL, KOLHAPUR – 416012</li>
              <li>📞 +91 8087252297</li>
              <li>✉️ info@laureltechnologies.in</li>
              <li>🕒 Mon-Fri: 9:00 AM - 7:00 PM</li>
            </ul>
          </div>

          {/* Quick Contact */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-4">Quick Contact</h4>
            <p className="text-gray-400 mb-4 text-center max-w-xs">
              Have questions? Get instant support via WhatsApp
            </p>
            <Button 
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white w-full max-w-xs mb-4 flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Available 24/7 for your queries
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
