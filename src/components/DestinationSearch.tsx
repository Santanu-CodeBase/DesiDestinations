import React, { useState } from 'react';
import { Search, Calendar, MapPin, Plus, X, Star, ArrowRight, Plane, Train, Bus, Car, Clock, IndianRupee, Route, Grid, List } from 'lucide-react';
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
  const [travelRecommendations, setTravelRecommendations] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'row' | 'tile'>('row');

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

  // Generate intelligent travel recommendations
  const generateTravelRecommendations = (from: string, to: string) => {
    if (!from || !to) {
      setTravelRecommendations([]);
      return;
    }

    // Mock travel data based on popular routes in India
    const travelOptions = [
      {
        type: 'flight',
        icon: Plane,
        name: 'Flight',
        duration: '2-4 hours',
        cost: '₹3,000 - ₹8,000',
        comfort: 'High',
        recommendation: 'Fastest option',
        color: 'blue',
        pros: ['Fastest travel', 'Comfortable', 'Weather independent'],
        cons: ['Most expensive', 'Airport transfers needed']
      },
      {
        type: 'train',
        icon: Train,
        name: 'Train',
        duration: '8-24 hours',
        cost: '₹500 - ₹3,000',
        comfort: 'Medium-High',
        recommendation: 'Best value',
        color: 'green',
        pros: ['Scenic journey', 'Multiple classes', 'City center to center'],
        cons: ['Longer duration', 'Booking required in advance']
      },
      {
        type: 'bus',
        icon: Bus,
        name: 'Bus',
        duration: '6-18 hours',
        cost: '₹300 - ₹1,500',
        comfort: 'Medium',
        recommendation: 'Budget friendly',
        color: 'orange',
        pros: ['Most economical', 'Frequent services', 'Door to door'],
        cons: ['Traffic dependent', 'Less comfortable for long distances']
      },
      {
        type: 'car',
        icon: Car,
        name: 'Self Drive',
        duration: '6-15 hours',
        cost: '₹2,000 - ₹5,000',
        comfort: 'High',
        recommendation: 'Most flexible',
        color: 'purple',
        pros: ['Complete flexibility', 'Scenic stops', 'Privacy'],
        cons: ['Driving fatigue', 'Fuel and tolls', 'Parking challenges']
      }
    ];

    // Customize recommendations based on specific routes
    const customizedOptions = travelOptions.map(option => {
      let customOption = { ...option };
      
      // Adjust based on distance and route type
      if (isLongDistanceRoute(from, to)) {
        if (option.type === 'flight') {
          customOption.recommendation = 'Highly recommended for long distance';
          customOption.duration = '2-5 hours';
        } else if (option.type === 'train') {
          customOption.recommendation = 'Comfortable overnight journey';
          customOption.duration = '12-24 hours';
        }
      } else if (isShortDistanceRoute(from, to)) {
        if (option.type === 'bus') {
          customOption.recommendation = 'Perfect for short trips';
          customOption.duration = '3-8 hours';
        } else if (option.type === 'car') {
          customOption.recommendation = 'Ideal for weekend getaway';
          customOption.duration = '3-6 hours';
        }
      }

      return customOption;
    });

    setTravelRecommendations(customizedOptions);
  };

  // Helper functions to determine route characteristics
  const isLongDistanceRoute = (from: string, to: string): boolean => {
    const longDistancePairs = [
      ['Delhi', 'Mumbai'], ['Mumbai', 'Kolkata'], ['Chennai', 'Delhi'],
      ['Bangalore', 'Delhi'], ['Hyderabad', 'Mumbai'], ['Pune', 'Kolkata']
    ];
    return longDistancePairs.some(pair => 
      (pair.includes(from) && pair.includes(to)) ||
      (from.includes('Delhi') && to.includes('Chennai')) ||
      (from.includes('Mumbai') && to.includes('Bangalore'))
    );
  };

  const isShortDistanceRoute = (from: string, to: string): boolean => {
    const shortDistancePairs = [
      ['Mumbai', 'Pune'], ['Delhi', 'Agra'], ['Bangalore', 'Mysore'],
      ['Chennai', 'Pondicherry'], ['Kolkata', 'Darjeeling']
    ];
    return shortDistancePairs.some(pair => 
      pair.includes(from) && pair.includes(to)
    );
  };

  const handleFromDestinationSelect = (destination: string) => {
    setFromDestination(destination);
    setFromSearchTerm('');
    setShowFromSuggestions(false);
    
    // Generate recommendations if both destinations are selected
    if (toDestination) {
      generateTravelRecommendations(destination, toDestination);
    }
  };

  const handleToDestinationSelect = (destination: string) => {
    setToDestination(destination);
    setToSearchTerm('');
    setShowToSuggestions(false);
    
    // Generate recommendations if both destinations are selected
    if (fromDestination) {
      generateTravelRecommendations(fromDestination, destination);
    }
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
    
    // Update recommendations when destinations are swapped
    if (tempTo && tempFrom) {
      generateTravelRecommendations(tempTo, tempFrom);
    }
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
              <div className="flex items-center justify-between mb-2 h-8">
                <label className="block text-sm font-medium text-gray-700">
                  Source
                </label>
                <div className="w-16"></div> {/* Spacer to match destination layout */}
              </div>
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

            {/* Destination */}
            <div>
              <div className="flex items-center justify-between mb-2 h-8">
                <label className="block text-sm font-medium text-gray-700">
                  Destination
                </label>
                <button
                  onClick={swapDestinations}
                  disabled={!fromDestination || !toDestination}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  title="Swap destinations"
                >
                  <span className="font-medium">Swap</span>
                </button>
              </div>
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
          {fromDestination && toDestination ? 'Travel Recommendations' : 'Popular Destinations'}
        </h3>
        
        {fromDestination && toDestination ? (
          // Travel Recommendations
          <div className="space-y-6">
            {/* View Toggle - Top Position */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-semibold text-gray-900">Travel Options</h4>
                <span className="text-sm text-gray-500">
                  {fromDestination} → {toDestination}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 font-medium">View:</span>
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('row')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'row'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Row view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('tile')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'tile'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Tile view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Route Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-700">{fromDestination}</span>
                </div>
                <Route className="h-5 w-5 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-blue-700">{toDestination}</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">
                Choose your preferred mode of transport
              </p>
            </div>
            {/* Travel Options */}
            <div className={viewMode === 'tile' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
              {travelRecommendations.map((option, index) => {
                const Icon = option.icon;
                
                if (viewMode === 'tile') {
                  return (
                  <div
                    key={option.type}
                    className={`border-2 rounded-xl p-4 transition-all hover:shadow-lg cursor-pointer ${
                      option.color === 'blue' ? 'border-blue-200 hover:border-blue-300 bg-blue-50' :
                      option.color === 'green' ? 'border-green-200 hover:border-green-300 bg-green-50' :
                      option.color === 'orange' ? 'border-orange-200 hover:border-orange-300 bg-orange-50' :
                      'border-purple-200 hover:border-purple-300 bg-purple-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          option.color === 'blue' ? 'bg-blue-100' :
                          option.color === 'green' ? 'bg-green-100' :
                          option.color === 'orange' ? 'bg-orange-100' :
                          'bg-purple-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            option.color === 'blue' ? 'text-blue-600' :
                            option.color === 'green' ? 'text-green-600' :
                            option.color === 'orange' ? 'text-orange-600' :
                            'text-purple-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{option.name}</h4>
                          <p className={`text-sm font-medium ${
                            option.color === 'blue' ? 'text-blue-600' :
                            option.color === 'green' ? 'text-green-600' :
                            option.color === 'orange' ? 'text-orange-600' :
                            'text-purple-600'
                          }`}>
                            {option.recommendation}
                          </p>
                        </div>
                      </div>
                      {index === 1 && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                      <div className="text-center">
                        <Clock className="h-4 w-4 text-gray-500 mx-auto mb-1" />
                        <p className="text-gray-600 font-medium">{option.duration}</p>
                        <p className="text-xs text-gray-500">Duration</p>
                      </div>
                      <div className="text-center">
                        <IndianRupee className="h-4 w-4 text-gray-500 mx-auto mb-1" />
                        <p className="text-gray-600 font-medium">{option.cost}</p>
                        <p className="text-xs text-gray-500">Cost Range</p>
                      </div>
                      <div className="text-center">
                        <Star className="h-4 w-4 text-gray-500 mx-auto mb-1" />
                        <p className="text-gray-600 font-medium">{option.comfort}</p>
                        <p className="text-xs text-gray-500">Comfort</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-green-700 mb-1">Pros:</p>
                        <ul className="text-xs text-green-600 space-y-0.5">
                          {option.pros.map((pro: string, i: number) => (
                            <li key={i}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-red-700 mb-1">Cons:</p>
                        <ul className="text-xs text-red-600 space-y-0.5">
                          {option.cons.map((con: string, i: number) => (
                            <li key={i}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  );
                }
                
                // Row view
                return (
                  <div
                    key={option.type}
                    className={`border-2 rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
                      option.color === 'blue' ? 'border-blue-200 hover:border-blue-300 bg-blue-50' :
                      option.color === 'green' ? 'border-green-200 hover:border-green-300 bg-green-50' :
                      option.color === 'orange' ? 'border-orange-200 hover:border-orange-300 bg-orange-50' :
                      'border-purple-200 hover:border-purple-300 bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left section - Transport info */}
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          option.color === 'blue' ? 'bg-blue-100' :
                          option.color === 'green' ? 'bg-green-100' :
                          option.color === 'orange' ? 'bg-orange-100' :
                          'bg-purple-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            option.color === 'blue' ? 'text-blue-600' :
                            option.color === 'green' ? 'text-green-600' :
                            option.color === 'orange' ? 'text-orange-600' :
                            'text-purple-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900 text-lg">{option.name}</h4>
                            {index === 1 && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className={`text-sm font-medium ${
                            option.color === 'blue' ? 'text-blue-600' :
                            option.color === 'green' ? 'text-green-600' :
                            option.color === 'orange' ? 'text-orange-600' :
                            'text-purple-600'
                          }`}>
                            {option.recommendation}
                          </p>
                        </div>
                      </div>

                      {/* Middle section - Key metrics */}
                      <div className="hidden md:flex items-center space-x-8">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{option.duration}</span>
                          </div>
                          <p className="text-xs text-gray-500">Duration</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <IndianRupee className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{option.cost}</span>
                          </div>
                          <p className="text-xs text-gray-500">Cost Range</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{option.comfort}</span>
                          </div>
                          <p className="text-xs text-gray-500">Comfort</p>
                        </div>
                      </div>

                      {/* Right section - Pros/Cons summary */}
                      <div className="hidden lg:block text-right max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-xs font-medium text-green-700">Pros:</span>
                            <span className="text-xs text-green-600">{option.pros[0]}</span>
                          </div>
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-xs font-medium text-red-700">Cons:</span>
                            <span className="text-xs text-red-600">{option.cons[0]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile metrics */}
                      <div className="md:hidden text-right">
                        <div className="text-sm font-medium text-gray-900">{option.duration}</div>
                        <div className="text-sm text-gray-600">{option.cost}</div>
                      </div>
                    </div>

                    {/* Mobile expanded details */}
                    <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-medium text-green-700 mb-1">Pros:</p>
                          <ul className="text-xs text-green-600 space-y-0.5">
                            {option.pros.slice(0, 2).map((pro: string, i: number) => (
                              <li key={i}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-red-700 mb-1">Cons:</p>
                          <ul className="text-xs text-red-600 space-y-0.5">
                            {option.cons.slice(0, 2).map((con: string, i: number) => (
                              <li key={i}>• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">💡 Smart Travel Tips</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Book train tickets 120 days in advance for better availability</li>
                <li>• Flight prices are usually lower on Tuesday-Thursday</li>
                <li>• Consider overnight buses for budget travel on long routes</li>
                <li>• Check weather conditions before planning road trips</li>
              </ul>
            </div>
          </div>
        ) : (
          // Popular Destinations Selection
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
        )}
      </div>
    </div>
  );
};

export default DestinationSearch;