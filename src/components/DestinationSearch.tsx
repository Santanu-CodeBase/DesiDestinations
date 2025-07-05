import React, { useState } from 'react';
import { Search, Calendar, MapPin, Plus, X, Star, ExternalLink, Clock, DollarSign, Zap, Award, TrendingUp, Users, Lightbulb, Info, Camera, IndianRupee, ArrowRight } from 'lucide-react';
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
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'tiles'>('list');
  const [travelRecommendations, setTravelRecommendations] = useState<any[]>([]);
  const [destinationActivities, setDestinationActivities] = useState<any>({});
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);

  const today = new Date();
  const maxDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-4xl font-bold text-gray-800 mt-4">Destination Search</h1>
          <p className="text-gray-600 mt-2">Find your perfect travel destination</p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={fromSearchTerm}
                  onChange={(e) => setFromSearchTerm(e.target.value)}
                  placeholder="Enter departure city"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={toSearchTerm}
                  onChange={(e) => setToSearchTerm(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today.toISOString().split('T')[0]}
                  max={maxDate.toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || today.toISOString().split('T')[0]}
                  max={maxDate.toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (fromDestination && toDestination && startDate && endDate) {
                  onSearchComplete({
                    from: fromDestination,
                    to: toDestination,
                    startDate,
                    endDate
                  });
                }
              }}
              disabled={!fromDestination || !toDestination || !startDate || !endDate}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Search className="h-5 w-5" />
              Search Destinations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationSearch;