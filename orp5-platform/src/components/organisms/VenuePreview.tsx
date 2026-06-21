import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { MapPin, Plane, Train, Car, ArrowRight } from 'lucide-react';

export function VenuePreview() {
  return (
    <section className="py-20 bg-[#FDFCF8] border-y border-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Conference Venue</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us in the heart of India's capital at the premier National Agricultural Science Complex.
          </p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col lg:flex-row">
          
          {/* Left Column - Image */}
          <div className="lg:w-1/2 h-64 lg:h-auto relative">
            <img 
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920" 
              alt="NASC Complex, New Delhi" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent flex items-end p-8">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-rice-gold" />
                  <span className="font-medium">New Delhi, India</span>
                </div>
                <h3 className="text-2xl font-bold">A.P. Shinde Symposium Hall</h3>
                <p className="text-gray-200 text-sm mt-1">NASC Complex</p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h4 className="text-xl font-bold text-charcoal mb-6">Easy Accessibility</h4>
            
            <ul className="space-y-6 mb-10">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Plane size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-charcoal">IGI Airport (DEL)</p>
                  <p className="text-sm text-gray-500">15–18 km from city centre. Connected via Metro & Cab services.</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Train size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-charcoal">Major Railway Stations</p>
                  <p className="text-sm text-gray-500">Connected to NDLS, Hazrat Nizamuddin, and Old Delhi Junction.</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Car size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-charcoal">Local Transport</p>
                  <p className="text-sm text-gray-500">Easily accessible via Delhi Metro, App-based cabs, and buses.</p>
                </div>
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link href="/venue">
                <Button className="bg-earth-green hover:bg-green-800 text-white">
                  Venue Details
                </Button>
              </Link>
              <Link href="/accommodation">
                <Button variant="outline">
                  Accommodation
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
