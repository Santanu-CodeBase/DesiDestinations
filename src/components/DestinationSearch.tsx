import React, { useState } from 'react';
import { Search, Calendar, MapPin, Plus, X, Star, ExternalLink, Clock, DollarSign, Zap, Award, TrendingUp, Users, Lightbulb, Info, Camera, IndianRupee, ArrowRight } from 'lucide-react';
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