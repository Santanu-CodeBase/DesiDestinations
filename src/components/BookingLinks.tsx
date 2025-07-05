import React from 'react';
import { Train, Bus, Plane, ExternalLink } from 'lucide-react';

const BookingLinks: React.FC = () => {
  const bookingServices = [
    {
      name: 'IRCTC',
      icon: Train,
      url: 'https://www.irctc.co.in',
      description: 'Book train tickets',
      color: 'bg-blue-500'
    },
    {
      name: 'RedBus',
      icon: Bus,
      url: 'https://www.redbus.in',
      description: 'Bus bookings',
      color: 'bg-red-500'
    },
    {
      name: 'IndiGo',
      icon: Plane,
      url: 'https://www.goindigo.in',
      description: 'Flight bookings',
      color: 'bg-indigo-500'
    },
    {
      name: 'Air India',
      icon: Plane,
      url: 'https://www.airindia.in',
      description: 'National carrier',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-md border-t border-gray-700/50 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 text-center">
          Book Your Journey
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bookingServices.map(service => {
            const Icon = service.icon;
            return (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 rounded-lg bg-gray-700/30 border border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all group backdrop-blur-sm"
              >
                <div className={`p-3 rounded-lg ${service.color} text-white mb-2 group-hover:scale-105 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="font-medium text-gray-100 flex items-center">
                  {service.name}
                  <ExternalLink className="h-3 w-3 ml-1 text-gray-500" />
                </h4>
                <p className="text-sm text-gray-400 text-center mt-1">
                  {service.description}
                </p>
              </a>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          External booking partners • Secure payment gateways • Best prices guaranteed
        </p>
      </div>
    </div>
  );
};

export default BookingLinks;