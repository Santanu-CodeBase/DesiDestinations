import React, { useState } from 'react';
import { Search, MapPin, Calendar, Plane, Train, Bus, Car, Clock, IndianRupee, Star, ArrowRight } from 'lucide-react';
import { SearchRecord } from '../types';

interface DestinationSearchProps {
  onSearchComplete: (search: Omit<SearchRecord, 'id' | 'timestamp'>) => void;
}

interface TravelOption {
  mode: string;
  icon: React.ComponentType<any>;
  duration: string;
  cost: string;
  description: string;
  recommended: boolean;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({ onSearchComplete }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TravelOption[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Get today's date and max date (90 days from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Popular Indian destinations
  const popularDestinations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Goa', 'Kerala', 'Rajasthan'
  ];

  // Travel recommendation engine
  const generateTravelRecommendations = (from: string, to: string): TravelOption[] => {
    // Calculate approximate distance (simplified logic)
    const getDistance = (source: string, dest: string): number => {
      const majorCities: { [key: string]: { lat: number; lng: number } } = {
        'Delhi': { lat: 28.6139, lng: 77.2090 },
        'Mumbai': { lat: 19.0760, lng: 72.8777 },
        'Bangalore': { lat: 12.9716, lng: 77.5946 },
        'Chennai': { lat: 13.0827, lng: 80.2707 },
        'Kolkata': { lat: 22.5726, lng: 88.3639 },
        'Hyderabad': { lat: 17.3850, lng: 78.4867 },
        'Pune': { lat: 18.5204, lng: 73.8567 },
        'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
        'Jaipur': { lat: 26.9124, lng: 75.7873 },
        'Goa': { lat: 15.2993, lng: 74.1240 },
        'Kerala': { lat: 10.8505, lng: 76.2711 },
        'Rajasthan': { lat: 27.0238, lng: 74.2179 }
      };

      const sourceCoords = majorCities[source] || { lat: 20, lng: 77 };
      const destCoords = majorCities[dest] || { lat: 20, lng: 77 };

      // Simple distance calculation
      const latDiff = sourceCoords.lat - destCoords.lat;
      const lngDiff = sourceCoords.lng - destCoords.lng;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion

      return Math.max(distance, 100); // Minimum 100km
    };

    const distance = getDistance(from, to);
    const options: TravelOption[] = [];

    // Flight option
    options.push({
      mode: 'Flight',
      icon: Plane,
      duration: distance > 1000 ? '2-3 hours' : '1-2 hours',
      cost: distance > 1000 ? '₹4,000-8,000' : '₹2,500-5,000',
      description: 'Fastest option with multiple daily flights',
      recommended: distance > 800
    });

    // Train option
    options.push({
      mode: 'Train',
      icon: Train,
      duration: distance > 1000 ? '12-18 hours' : distance > 500 ? '6-12 hours' : '3-8 hours',
      cost: distance > 1000 ? '₹800-2,500' : distance > 500 ? '₹400-1,200' : '₹200-600',
      description: 'Comfortable journey with good connectivity',
      recommended: distance > 300 && distance <= 800
    });

    // Bus option
    options.push({
      mode: 'Bus',
      icon: Bus,
      duration: distance > 1000 ? '15-24 hours' : distance > 500 ? '8-15 hours' : '3-8 hours',
      cost: distance > 1000 ? '₹600-1,500' : distance > 500 ? '₹300-800' : '₹150-400',
      description: 'Economical option with flexible timings',
      recommended: distance <= 600
    });

    // Car/Road option
    options.push({
      mode: 'Car/Road',
      icon: Car,
      duration: distance > 1000 ? '12-20 hours' : distance > 500 ? '6-12 hours' : '2-6 hours',
      cost: distance > 1000 ? '₹3,000-6,000' : distance > 500 ? '₹1,500-3,000' : '₹500-1,500',
      description: 'Complete flexibility and scenic routes',
      recommended: distance <= 400
    });

    // Sort by recommendation
    return options.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
  };

  const handleSearch = async () => {
    if (!source.trim() || !destination.trim() || !startDate || !endDate) {
      alert('Please fill in all fields');
      return;
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      alert('Source and destination cannot be the same');
      return;
    }

    setIsSearching(true);
    setShowResults(false);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate travel recommendations
    const recommendations = generateTravelRecommendations(source, destination);
    setSearchResults(recommendations);
    setShowResults(true);

    // Create search record for history
    const searchRecord: Omit<SearchRecord, 'id' | 'timestamp'> = {
      destinations: [source, destination],
      startDate: new Date(startDate).toLocaleDateString('en-GB'),
      endDate: new Date(endDate).toLocaleDateString('en-GB'),
      activities: {
        [source]: ['Departure preparation', 'Local exploration'],
        [destination]: ['Sightseeing', 'Local cuisine', 'Cultural activities']
      },
      status: 'active'
    };

    onSearchComplete(searchRecord);
    setIsSearching(false);
  };

  const handlePopularDestinationClick = (dest: string) => {
    if (!source) {
      setSource(dest);
    } else if (!destination && dest !== source) {
      setDestination(dest);
    }
  };

  const clearForm = () => {
    setSource('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Search className="h-6 w-6 text-orange-600 mr-2" />
            Where Do You Want to Go?
          </h2>
          {(source || destination || startDate || endDate) && (
            <button
              onClick={clearForm}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Source and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Source
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="Enter departure city"
                disabled={isSearching}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="Enter destination city"
                disabled={isSearching}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
                max={maxDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                disabled={isSearching}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || today}
                max={maxDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                disabled={isSearching}
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!source || !destination || !startDate || !endDate || isSearching}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Find Best Travel Options</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Travel Recommendations */}
      {showResults && searchResults.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 text-green-600 mr-2" />
            Travel Recommendations: {source} → {destination}
          </h3>
          
          <div className="space-y-4">
            {searchResults.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all ${
                  option.recommended
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                      option.recommended ? 'bg-green-500' : 'bg-gray-400'
                    } text-white`}>
                      <option.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-bold text-gray-900">{option.mode}</h4>
                        {option.recommended && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{option.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{option.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Links */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Quick Booking Links:</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.irctc.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Train className="h-4 w-4" />
                <span>IRCTC (Trains)</span>
              </a>
              <a
                href="https://www.redbus.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <Bus className="h-4 w-4" />
                <span>RedBus (Buses)</span>
              </a>
              <a
                href="https://www.goindigo.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                <Plane className="h-4 w-4" />
                <span>IndiGo (Flights)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Popular Destinations */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="h-5 w-5 text-orange-600 mr-2" />
          Popular Destinations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popularDestinations.map((dest) => (
            <button
              key={dest}
              onClick={() => handlePopularDestinationClick(dest)}
              className="p-3 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 hover:border-orange-300 text-sm font-medium text-orange-700"
              disabled={isSearching}
            >
              {dest}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Click to add as source or destination
        </p>
      </div>
    </div>
  );
};

export default DestinationSearch;