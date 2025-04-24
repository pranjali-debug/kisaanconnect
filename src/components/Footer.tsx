import React from 'react';
import { Mail, Phone, MapPin, Sprout, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-kisaan-darkbrown text-white pt-10 pb-4">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Logo and About */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Sprout className="h-5 w-5 text-kisaan-yellow" />
              <span className="text-lg font-bold">KisaanConnect</span>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Bridging the gap between farmers and NGOs to reduce food waste and support sustainable agriculture in India.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a href="#home" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#produce" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                  Browse Produce
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-3">For Farmers</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                  List Your Produce
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-kisaan-yellow transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-kisaan-yellow shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  123 Rural Development Complex, New Delhi, India - 110001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-kisaan-yellow shrink-0" />
                <span className="text-gray-300">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-kisaan-yellow shrink-0" />
                <span className="text-gray-300">info@kisaanconnect.org</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-4" />

        <div className="text-center text-gray-400 text-xs">
          <p>&copy; {new Date().getFullYear()} KisaanConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;