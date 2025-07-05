import React, { useState } from 'react';
import { Search, Calendar, MapPin, Plus, X, Star, ExternalLink, Clock, DollarSign, Zap, Award, TrendingUp, Users, Lightbulb, Info, Camera, IndianRupee, ArrowRight, Plane, Train, Bus, Car } from 'lucide-react';
import Logo from './Logo';
import { indianDestinations } from '../data/destinations';
import { SearchRecord } from '../types';

interface DestinationSearchProps {
  onSearchComplete: (search: Omit<SearchRecord, 'id' | 'timestamp'>) => void;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({ onSearchComplete }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeField, setActiveField] = useState<'source' | 'destination' | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [travelRecommendation, setTravelRecommendation] = useState<{
    mode: string;
    duration: string;
    cost: string;
    icon: React.ComponentType<any>;
    description: string;
    alternatives: Array<{
      mode: string;
      duration: string;
      cost: string;
      icon: React.ComponentType<any>;
    }>;
  } | null>(null);

  const today = new Date();
  const maxDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateDDMMYYYY = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  // Function to calculate travel recommendations based on source and destination
  const getTravelRecommendation = (source: string, destination: string) => {
    // Mock distance calculation (in real app, use Google Maps API or similar)
    const mockDistances: { [key: string]: number } = {
      'Delhi-Mumbai': 1400,
      'Mumbai-Delhi': 1400,
      'Bangalore-Chennai': 350,
      'Chennai-Bangalore': 350,
      'Kolkata-Delhi': 1500,
      'Delhi-Kolkata': 1500,
      'Mumbai-Goa': 600,
      'Goa-Mumbai': 600,
      'Delhi-Jaipur': 280,
      'Jaipur-Delhi': 280,
      'Chennai-Kerala': 700,
      'Kerala-Chennai': 700,
    };

    const routeKey = `${source}-${destination}`;
    const distance = mockDistances[routeKey] || 500; // Default distance

    // Determine best travel mode based on distance and route popularity
    if (distance > 1000) {
      // Long distance - recommend flight
      return {
        mode: 'Flight',
        duration: '2-3 hours',
        cost: '₹4,000-8,000',
        icon: Plane,
        description: 'Fastest option for long distances. Book in advance for better prices.',
        alternatives: [
          { mode: 'Train', duration: '12-20 hours', cost: '₹800-2,500', icon: Train },
          { mode: 'Bus', duration: '15-24 hours', cost: '₹600-1,500', icon: Bus }
        ]
      };
    } else if (distance > 500) {
      // Medium distance - recommend train
      return {
        mode: 'Train',
        duration: '6-12 hours',
        cost: '₹500-1,800',
        icon: Train,
        description: 'Comfortable and economical for medium distances. Good connectivity.',
        alternatives: [
          { mode: 'Flight', duration: '1-2 hours', cost: '₹3,000-6,000', icon: Plane },
          { mode: 'Bus', duration: '8-14 hours', cost: '₹400-1,000', icon: Bus },
          { mode: 'Car', duration: '6-10 hours', cost: '₹2,000-4,000', icon: Car }
        ]
      };
    } else {
      // Short distance - recommend road/bus
      return {
        mode: 'Bus/Car',
        duration: '3-6 hours',
        cost: '₹200-800',
        icon: Bus,
        description: 'Most convenient for short distances. Flexible timing and routes.',
        alternatives: [
          { mode: 'Train', duration: '4-8 hours', cost: '₹300-800', icon: Train },
          { mode: 'Flight', duration: '1 hour', cost: '₹2,500-5,000', icon: Plane }
        ]
      };
    }
  };

  const filteredDestinations = indianDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.state.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const handleDestinationSelect = (selectedDest: string) => {
    if (activeField === 'source') {
      setSource(selectedDest);
    } else if (activeField === 'destination') {
      setDestination(selectedDest);
    }
    setSearchTerm('');
    setShowSuggestions(false);
    setActiveField(null);
  };

  const handleInputFocus = (field: 'source' | 'destination') => {
    setActiveField(field);
    setShowSuggestions(true);
  };

  const handleInputChange = (value: string, field: 'source' | 'destination') => {
    setSearchTerm(value);
    if (field === 'source') {
      setSource(value);
    } else {
      setDestination(value);
    }
    setActiveField(field);
    setShowSuggestions(true);
  };

  const handleSearch = async () => {
    if (!source.trim() || !destination.trim() || !startDate || !endDate) return;

    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate travel recommendation
    const recommendation = getTravelRecommendation(source.trim(), destination.trim());
    setTravelRecommendation(recommendation);

    const selectedDestinations = [source, destination];

    // Generate mock activities for each destination
    const activities: { [key: string]: string[] } = {};
    selectedDestinations.forEach(dest => {
      const destData = indianDestinations.find(d => d.name === dest);
      activities[dest] = destData ? destData.activities.slice(0, 3) : [];
    });

    const searchRecord: Omit<SearchRecord, 'id' | 'timestamp'> = {
      destinations: selectedDestinations,
      startDate: formatDateDDMMYYYY(startDate),
      endDate: formatDateDDMMYYYY(endDate),
      activities,
      status: 'active'
    };

    onSearchComplete(searchRecord);
    setIsSearching(false);
    
    // Reset form
    setSource('');
    setDestination('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Search className="h-6 w-6 text-orange-600 mr-2" />
          Plan Your Journey
        </h2>

        {/* Destination Selection */}
        <div className="space-y-4">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <input
                  type="text"
                  value={activeField === 'source' ? searchTerm : source}
                  onChange={(e) => handleInputChange(e.target.value, 'source')}
                  onFocus={() => handleInputFocus('source')}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Enter departure city..."
                />
              </div>

              {/* Destination Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={activeField === 'destination' ? searchTerm : destination}
                  onChange={(e) => handleInputChange(e.target.value, 'destination')}
                  onFocus={() => handleInputFocus('destination')}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Enter destination city..."
                />
              </div>
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && searchTerm && activeField && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredDestinations.map(dest => (
                  <button
                    key={dest.name}
                    onClick={() => handleDestinationSelect(dest.name)}
                    className="w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium">{dest.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({dest.state})</span>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      {dest.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Show selected source and destination */}
          {(source || destination) && (
            <div className="flex flex-wrap gap-2">
              {source && (
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">From: {source}</span>
                  <button
                    onClick={() => setSource('')}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {destination && (
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">To: {destination}</span>
                  <button
                    onClick={() => setDestination('')}
                    className="text-green-500 hover:text-green-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="hidden">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="Search states or cities..."
              />
              
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={formatDateForInput(today)}
                max={formatDateForInput(maxDate)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || formatDateForInput(today)}
                max={formatDateForInput(maxDate)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!source.trim() || !destination.trim() || !startDate || !endDate || isSearching}
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
                <span>Search Destinations</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Travel Recommendations */}
      {travelRecommendation && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 text-green-600 mr-2" />
            Recommended Travel Option
          </h3>
          
          {/* Primary Recommendation */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-full text-white">
                <travelRecommendation.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-green-800">{travelRecommendation.mode}</h4>
                <p className="text-green-700 text-sm mb-2">{travelRecommendation.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-green-800 font-medium">{travelRecommendation.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <IndianRupee className="h-4 w-4 text-green-600" />
                    <span className="text-green-800 font-medium">{travelRecommendation.cost}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Best Choice
                </span>
              </div>
            </div>
          </div>

          {/* Alternative Options */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">Alternative Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {travelRecommendation.alternatives.map((alt, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-orange-300 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-400 rounded-full text-white">
                      <alt.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800">{alt.mode}</h5>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{alt.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="h-3 w-3" />
                          <span>{alt.cost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Links */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-2 font-medium">Quick Booking Links:</p>
            <div className="flex flex-wrap gap-2">
              <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" 
                 className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors flex items-center space-x-1">
                <Train className="h-3 w-3" />
                <span>IRCTC</span>
              </a>
              <a href="https://www.redbus.in" target="_blank" rel="noopener noreferrer"
                 className="text-xs bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors flex items-center space-x-1">
                <Bus className="h-3 w-3" />
                <span>RedBus</span>
              </a>
              <a href="https://www.goindigo.in" target="_blank" rel="noopener noreferrer"
                 className="text-xs bg-indigo-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600 transition-colors flex items-center space-x-1">
                <Plane className="h-3 w-3" />
                <span>IndiGo</span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh', 'Tamil Nadu', 'Karnataka', 'Uttarakhand', 'Maharashtra'].map(dest => (
            <button
              key={dest}
              onClick={() => {
                if (!source) {
                  setSource(dest);
                } else if (!destination) {
                  setDestination(dest);
                }
              }}
              className="p-3 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 hover:border-orange-300"
            >
              <span className="text-sm font-medium text-orange-700">{dest}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationSearch;