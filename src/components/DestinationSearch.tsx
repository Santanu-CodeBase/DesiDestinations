import React, { useState } from 'react';
import { Search, Calendar, MapPin, Plus, X, Star, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { indianDestinations } from '../data/destinations';
import { SearchRecord } from '../types';

interface DestinationSearchProps {
  onSearchComplete: (search: Omit<SearchRecord, 'id' | 'timestamp'>) => void;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({ onSearchComplete }) => {
  const [fromDestination, setFromDestination] = useState('');
  const [toDestination, setToDestination] = useState('');
  const [fromSearchTerm, setFromSearchTerm] = useState('');
  const [toSearchTerm, setToSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
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

  const getFilteredDestinations = (searchTerm: string) => {
    return indianDestinations.filter(dest =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
  };

  const handleFromDestinationSelect = (destination: string) => {
    setFromDestination(destination);
    setFromSearchTerm('');
    setShowFromSuggestions(false);
  };

  const handleToDestinationSelect = (destination: string) => {
    setToDestination(destination);
    setToSearchTerm('');
    setShowToSuggestions(false);
  };

  const clearFromDestination = () => {
    setFromDestination('');
    setFromSearchTerm('');
  };

  const clearToDestination = () => {
    setToDestination('');
    setToSearchTerm('');
  };

  const swapDestinations = () => {
    const tempFrom = fromDestination;
    const tempTo = toDestination;
    setFromDestination(tempTo);
    setToDestination(tempFrom);
  };

  const handleSearch = async () => {
    if (!fromDestination || !toDestination || !startDate || !endDate) return;

    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock activities for both destinations
    const activities: { [key: string]: string[] } = {};
    [fromDestination, toDestination].forEach(dest => {
      const destData = indianDestinations.find(d => d.name === dest);
      activities[dest] = destData ? destData.activities.slice(0, 3) : [];
    });

    const searchRecord: Omit<SearchRecord, 'id' | 'timestamp'> = {
      destinations: [fromDestination, toDestination],
      startDate: formatDateDDMMYYYY(startDate),
      endDate: formatDateDDMMYYYY(endDate),
      activities,
      status: 'active'
    };

    onSearchComplete(searchRecord);
    setIsSearching(false);
    
    // Reset form
    setFromDestination('');
    setToDestination('');
    setStartDate('');
    setEndDate('');
  };

  const popularDestinations = ['Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh', 'Tamil Nadu', 'Karnataka', 'Uttarakhand', 'Maharashtra'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Search className="h-6 w-6 text-orange-600 mr-2" />
          What's in your mind today?
        </h2>

        {/* Destination Selection */}
        <div className="space-y-6">
          {/* Source and Destination */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <div className="relative">
                {fromDestination ? (
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-green-50 border-green-300">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700">{fromDestination}</span>
                    </div>
                    <button
                      onClick={clearFromDestination}
                      className="text-green-500 hover:text-green-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={fromSearchTerm}
                      onChange={(e) => {
                        setFromSearchTerm(e.target.value);
                        setShowFromSuggestions(true);
                      }}
                      onFocus={() => setShowFromSuggestions(true)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Search source location..."
                    />
                    
                    {showFromSuggestions && fromSearchTerm && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {getFilteredDestinations(fromSearchTerm).map(dest => (
                          <button
                            key={dest.name}
                            onClick={() => handleFromDestinationSelect(dest.name)}
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
                  </>
                )}
              </div>
            </div>

            {/* Swap Button for Mobile */}
            <div className="lg:hidden flex justify-center">
              <button
                onClick={swapDestinations}
                disabled={!fromDestination || !toDestination}
                className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Swap destinations"
              >
                <ArrowRight className="h-5 w-5 transform rotate-90" />
              </button>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <div className="relative">
                {toDestination ? (
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-blue-50 border-blue-300">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-700">{toDestination}</span>
                    </div>
                    <button
                      onClick={clearToDestination}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={toSearchTerm}
                      onChange={(e) => {
                        setToSearchTerm(e.target.value);
                        setShowToSuggestions(true);
                      }}
                      onFocus={() => setShowToSuggestions(true)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Search destination..."
                    />
                    
                    {showToSuggestions && toSearchTerm && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {getFilteredDestinations(toSearchTerm).map(dest => (
                          <button
                            key={dest.name}
                            onClick={() => handleToDestinationSelect(dest.name)}
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
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button for Desktop */}
          <div className="hidden lg:flex justify-center">
            <button
              onClick={swapDestinations}
              disabled={!fromDestination || !toDestination}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Swap destinations"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="text-sm font-medium">Swap</span>
              <ArrowRight className="h-4 w-4 transform rotate-180" />
            </button>
          </div>

          {/* Journey Summary */}
          {fromDestination && toDestination && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-700">{fromDestination}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-blue-700">{toDestination}</span>
                </div>
              </div>
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
            disabled={!fromDestination || !toDestination || !startDate || !endDate || isSearching}
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
                <span>Search Journey</span>
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
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick select for Source:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {popularDestinations.map(dest => (
                <button
                  key={`source-${dest}`}
                  onClick={() => handleFromDestinationSelect(dest)}
                  className={`p-2 text-center rounded-lg transition-colors border text-sm ${
                    fromDestination === dest
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300 text-green-600'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick select for Destination:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {popularDestinations.map(dest => (
                <button
                  key={`destination-${dest}`}
                  onClick={() => handleToDestinationSelect(dest)}
                  className={`p-2 text-center rounded-lg transition-colors border text-sm ${
                    toDestination === dest
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-blue-600'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationSearch;