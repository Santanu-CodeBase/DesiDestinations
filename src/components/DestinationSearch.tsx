import React, { useState } from 'react';
import { Search, Calendar, MapPin, Plus, X, Star, Train, Plane, Bus, Car, Lightbulb, Info } from 'lucide-react';
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
  const [destinationActivities, setDestinationActivities] = useState<any>({});

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

  // Generate destination activities with images
  const generateDestinationActivities = (destination: string) => {
    const activityDatabase: { [key: string]: any } = {
      'Goa': {
        activities: [
          {
            name: 'Beach Hopping',
            description: 'Explore pristine beaches from Baga to Palolem',
            image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Waves,
            duration: '2-3 hours per beach',
            bestTime: 'Early morning or sunset'
          },
          {
            name: 'Water Sports',
            description: 'Parasailing, jet skiing, and scuba diving',
            image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Waves,
            duration: '1-2 hours per activity',
            bestTime: 'Morning to afternoon'
          },
          {
            name: 'Portuguese Heritage Tour',
            description: 'Visit historic churches and colonial architecture',
            image: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Building,
            duration: '4-5 hours',
            bestTime: 'Morning'
          },
          {
            name: 'Spice Plantation Visit',
            description: 'Explore aromatic spice gardens and organic farms',
            image: 'https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: TreePine,
            duration: '3-4 hours',
            bestTime: 'Morning'
          },
          {
            name: 'Goan Cuisine Experience',
            description: 'Taste authentic fish curry, feni, and bebinca',
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Utensils,
            duration: '2-3 hours',
            bestTime: 'Lunch or dinner'
          }
        ]
      },
      'Kerala': {
        activities: [
          {
            name: 'Backwater Cruise',
            description: 'Houseboat journey through serene backwaters',
            image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Waves,
            duration: 'Full day or overnight',
            bestTime: 'Early morning'
          },
          {
            name: 'Tea Plantation Tour',
            description: 'Explore lush tea gardens in Munnar hills',
            image: 'https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Mountain,
            duration: '4-5 hours',
            bestTime: 'Morning'
          },
          {
            name: 'Kathakali Performance',
            description: 'Traditional dance drama with elaborate costumes',
            image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Camera,
            duration: '2-3 hours',
            bestTime: 'Evening'
          },
          {
            name: 'Ayurvedic Spa Treatment',
            description: 'Rejuvenating traditional wellness therapies',
            image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: TreePine,
            duration: '2-4 hours',
            bestTime: 'Morning or afternoon'
          },
          {
            name: 'Kerala Cuisine Cooking Class',
            description: 'Learn to cook traditional dishes with coconut',
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Utensils,
            duration: '3-4 hours',
            bestTime: 'Morning'
          }
        ]
      },
      'Rajasthan': {
        activities: [
          {
            name: 'Desert Safari',
            description: 'Camel riding and camping in Thar Desert',
            image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Mountain,
            duration: 'Half day to overnight',
            bestTime: 'Sunset'
          },
          {
            name: 'Palace Tours',
            description: 'Explore magnificent forts and royal palaces',
            image: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Building,
            duration: '4-6 hours',
            bestTime: 'Morning'
          },
          {
            name: 'Folk Music & Dance',
            description: 'Experience vibrant Rajasthani cultural performances',
            image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Camera,
            duration: '2-3 hours',
            bestTime: 'Evening'
          },
          {
            name: 'Handicraft Shopping',
            description: 'Browse colorful textiles, jewelry, and crafts',
            image: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Star,
            duration: '3-4 hours',
            bestTime: 'Afternoon'
          },
          {
            name: 'Rajasthani Thali Experience',
            description: 'Savor dal baati churma and traditional sweets',
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Utensils,
            duration: '1-2 hours',
            bestTime: 'Lunch or dinner'
          }
        ]
      },
      'Himachal Pradesh': {
        activities: [
          {
            name: 'Mountain Trekking',
            description: 'Trek through scenic valleys and snow peaks',
            image: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Mountain,
            duration: 'Full day',
            bestTime: 'Early morning'
          },
          {
            name: 'Adventure Sports',
            description: 'Paragliding, river rafting, and skiing',
            image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Mountain,
            duration: '2-4 hours',
            bestTime: 'Morning'
          },
          {
            name: 'Temple Visits',
            description: 'Visit ancient temples in scenic locations',
            image: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Building,
            duration: '2-3 hours',
            bestTime: 'Morning'
          },
          {
            name: 'Apple Orchard Tours',
            description: 'Walk through beautiful apple and cherry orchards',
            image: 'https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: TreePine,
            duration: '2-3 hours',
            bestTime: 'Morning'
          },
          {
            name: 'Local Cuisine Tasting',
            description: 'Try siddu, chana madra, and himachali dham',
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
            icon: Utensils,
            duration: '1-2 hours',
            bestTime: 'Lunch'
          }
        ]
      }
    };

    // Default activities for destinations not in database
    const defaultActivities = [
      {
        name: 'Local Sightseeing',
        description: 'Explore major attractions and landmarks',
        image: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=800',
        icon: Camera,
        duration: '4-6 hours',
        bestTime: 'Morning'
      },
      {
        name: 'Cultural Experience',
        description: 'Immerse in local traditions and customs',
        image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
        icon: Star,
        duration: '2-3 hours',
        bestTime: 'Evening'
      },
      {
        name: 'Local Cuisine',
        description: 'Taste authentic regional specialties',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        icon: Utensils,
        duration: '1-2 hours',
        bestTime: 'Lunch or dinner'
      },
      {
        name: 'Shopping',
        description: 'Browse local markets and handicrafts',
        image: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800',
        icon: Building,
        duration: '2-3 hours',
        bestTime: 'Afternoon'
      },
      {
        name: 'Nature Walk',
        description: 'Explore natural beauty and scenic spots',
        image: 'https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=800',
        icon: TreePine,
        duration: '2-4 hours',
        bestTime: 'Morning or evening'
      }
    ];

    return activityDatabase[destination] || { activities: defaultActivities };
  };

  // Generate intelligent travel recommendations
  const generateTravelRecommendations = (from: string, to: string) => {
    if (!from || !to) {
      setTravelRecommendations([]);
      setDestinationActivities({});
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
    
    // Generate activities for both destinations
    const activities = {
      [from]: generateDestinationActivities(from),
      [to]: generateDestinationActivities(to)
    };
    setDestinationActivities(activities);
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
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <Car className="h-6 w-6 text-blue-600 mr-2" />
                      Travel Options
                      <div className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        Smart Tips: Book trains 120 days ahead • Fly Tue-Thu for savings • Overnight buses save accommodation
                      </div>
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('row')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          viewMode === 'row'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Row View
                      </button>
                      <button
                        onClick={() => setViewMode('tile')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          viewMode === 'tile'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Tile View
                      </button>
                    </div>
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

              {/* Travel Options Content */}
              {viewMode === 'row' ? (
                // Row view
                <div className="space-y-3">
                  {travelRecommendations.map((option, index) => {
                    const Icon = option.icon;
                    
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
              ) : (
                // Tile view
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {travelRecommendations.map((option, index) => {
                    const Icon = option.icon;
                    
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
                  })}
                </div>
              )}
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

            {/* Destination Activities Section */}
            {Object.keys(destinationActivities).length > 0 && (
              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="h-6 w-6 text-orange-600 mr-2" />
                    Top Activities at Your Destinations
                  </h3>
                  
                  {Object.entries(destinationActivities).map(([destination, data]: [string, any]) => (
                    <div key={destination} className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                        Things to do in {destination}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.activities.slice(0, 5).map((activity: any, index: number) => {
                          const ActivityIcon = activity.icon;
                          return (
                            <div
                              key={index}
                              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                              {/* Activity Image */}
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={activity.image}
                                  alt={activity.name}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                                <div className="absolute top-3 left-3">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                                    <ActivityIcon className="h-4 w-4 text-orange-600" />
                                  </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                  <h5 className="text-white font-semibold text-lg">{activity.name}</h5>
                                </div>
                              </div>
                              
                              {/* Activity Details */}
                              <div className="p-4">
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {activity.description}
                                </p>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3 text-gray-500" />
                                      <span className="text-gray-600">{activity.duration}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-3 w-3 text-yellow-500" />
                                      <span className="text-gray-600">{activity.bestTime}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                      Must Experience
                                    </span>
                                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                                      Learn More →
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Destination Summary */}
                      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Camera className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-blue-900 mb-1">Why Visit {destination}?</h5>
                            <p className="text-sm text-blue-800">
                              {destination === 'Goa' && 'Perfect blend of beaches, culture, and nightlife with Portuguese heritage and water sports.'}
                              {destination === 'Kerala' && 'God\'s Own Country offers backwaters, hill stations, and authentic Ayurvedic experiences.'}
                              {destination === 'Rajasthan' && 'Land of kings with majestic palaces, desert adventures, and vibrant cultural traditions.'}
                              {destination === 'Himachal Pradesh' && 'Mountain paradise with adventure sports, scenic valleys, and spiritual experiences.'}
                              {!['Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh'].includes(destination) && 
                                `Discover the unique charm and cultural richness of ${destination} with diverse experiences.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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