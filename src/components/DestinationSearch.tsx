import React, { useState } from 'react';
import { Search, Calendar, MapPin, Plus, X, Star, Train, Plane, Car, Info, Clock, Users, Camera, Utensils, Mountain } from 'lucide-react';
import Logo from './Logo';
import { indianDestinations } from '../data/destinations';
import { SearchRecord } from '../types';

interface DestinationSearchProps {
  onSearchComplete: (search: Omit<SearchRecord, 'id' | 'timestamp'>) => void;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({ onSearchComplete }) => {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  const today = new Date();
  const maxDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateDDMMYYYY = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const filteredDestinations = indianDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.state.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const handleDestinationSelect = (destination: string) => {
    if (selectedDestinations.length < 5 && !selectedDestinations.includes(destination)) {
      setSelectedDestinations([...selectedDestinations, destination]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveDestination = (destination: string) => {
    setSelectedDestinations(selectedDestinations.filter(d => d !== destination));
  };

  const handleSearch = async () => {
    if (selectedDestinations.length === 0 || !startDate || !endDate) return;

    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock activities for each destination
    const activities: { [key: string]: string[] } = {};
    const recommendations: { [key: string]: any } = {};
    
    selectedDestinations.forEach(dest => {
      const destData = indianDestinations.find(d => d.name === dest);
      activities[dest] = destData ? destData.activities.slice(0, 3) : [];
      
      // Generate mock recommendations with images
      recommendations[dest] = {
        topActivities: [
          { name: 'Heritage Walk', image: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Explore historical landmarks' },
          { name: 'Local Cuisine Tour', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Taste authentic local dishes' },
          { name: 'Cultural Performance', image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Traditional dance and music' },
          { name: 'Nature Photography', image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Capture scenic landscapes' },
          { name: 'Adventure Sports', image: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Thrilling outdoor activities' }
        ]
      };
    });

    const searchRecord: Omit<SearchRecord, 'id' | 'timestamp'> = {
      destinations: selectedDestinations,
      startDate: formatDateDDMMYYYY(startDate),
      endDate: formatDateDDMMYYYY(endDate),
      activities,
      status: 'active'
    };

    // Set search results for display
    setSearchResults({
      destinations: selectedDestinations,
      startDate: formatDateDDMMYYYY(startDate),
      endDate: formatDateDDMMYYYY(endDate),
      recommendations
    });

    onSearchComplete(searchRecord);
    setIsSearching(false);
  };

  const clearResults = () => {
    setSearchResults(null);
    setSelectedDestinations([]);
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Search className="h-6 w-6 text-orange-600 mr-2" />
          Plan Your Journey
        </h2>

        {/* Destination Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Destinations (Max 5)
            </label>
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
              
              {showSuggestions && searchTerm && (
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
          </div>

          {/* Selected Destinations */}
          {selectedDestinations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedDestinations.map(dest => (
                <div
                  key={dest}
                  className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{dest}</span>
                  <button
                    onClick={() => handleRemoveDestination(dest)}
                    className="text-orange-500 hover:text-orange-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

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
            disabled={selectedDestinations.length === 0 || !startDate || !endDate || isSearching}
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

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Travel Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Star className="h-6 w-6 text-green-600 mr-2" />
                Travel Recommendations
              </h3>
              <button
                onClick={clearResults}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>

            {searchResults.destinations.map((destination: string) => (
              <div key={destination} className="mb-8 last:mb-0">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                  {destination}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {searchResults.recommendations[destination]?.topActivities.map((activity: any, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-orange-50 to-green-50 rounded-lg p-4 border border-orange-100 hover:shadow-md transition-shadow">
                      <div className="aspect-w-16 aspect-h-9 mb-3">
                        <img
                          src={activity.image}
                          alt={activity.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <h5 className="font-medium text-gray-900 mb-1">{activity.name}</h5>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Travel Options */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Plane className="h-6 w-6 text-blue-600 mr-2" />
                Travel Options
              </h3>
              <div className="ml-3 group relative">
                <Info className="h-5 w-5 text-blue-500 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  💡 Book early for better prices • Compare options • Check cancellation policies
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Train Travel */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-500 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                    <Train className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Train Travel</h4>
                    <p className="text-sm text-blue-700">Comfortable railway journeys</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    <span>Scenic routes available</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-500 mr-2" />
                    <span>Multiple class options</span>
                  </div>
                </div>
              </div>

              {/* Flight Travel */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-indigo-500 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                    <Plane className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Flight Travel</h4>
                    <p className="text-sm text-indigo-700">Quick air travel</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-indigo-500 mr-2" />
                    <span>Fastest option</span>
                  </div>
                  <div className="flex items-center">
                    <Mountain className="h-4 w-4 text-indigo-500 mr-2" />
                    <span>Aerial views</span>
                  </div>
                </div>
              </div>

              {/* Rental Car / Self Drive */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-500 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                    <Car className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Rental Car / Self Drive</h4>
                    <p className="text-sm text-green-700">Freedom to explore at your own pace</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-green-500 mr-2" />
                    <span>Flexible timing</span>
                  </div>
                  <div className="flex items-center">
                    <Camera className="h-4 w-4 text-green-500 mr-2" />
                    <span>Stop for photos</span>
                  </div>
                </div>
              </div>
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
              onClick={() => handleDestinationSelect(dest)}
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