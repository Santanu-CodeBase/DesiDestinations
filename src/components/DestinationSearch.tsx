Here's the fixed version with all missing closing brackets added:

```typescript
import React, { useState } from 'react';
import { Search, Calendar, MapPin, Plus, X, Star, Train, Plane, Bus, Car, Lightbulb, Info, Waves, ArrowRight, Building, TreePine, Utensils, Mountain, Camera, Clock, Route, IndianRupee } from 'lucide-react';
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
          <Star className="h-5 w-5 text-orange-600 mr-2