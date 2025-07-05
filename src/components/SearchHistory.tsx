import React from 'react';
import { History, Calendar, MapPin, Edit, Star, Clock } from 'lucide-react';
import Logo from './Logo';
import { SearchRecord } from '../types';

interface SearchHistoryProps {
  searchHistory: SearchRecord[];
  onModifySearch: (search: Omit<SearchRecord, 'id' | 'timestamp'>) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ searchHistory, onModifySearch }) => {
  const handleModify = (search: SearchRecord) => {
    onModifySearch({
      destinations: search.destinations,
      startDate: search.startDate,
      endDate: search.endDate,
      activities: search.activities,
      status: 'active'
    });
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
          <History className="h-6 w-6 text-orange-400 mr-2" />
          Search History
        </h2>

        {searchHistory.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No searches yet. Start planning your journey!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchHistory.map((search, index) => (
              <div
                key={search.id}
                className="bg-gray-700/30 border border-gray-600/50 rounded-lg p-4 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        search.status === 'active' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                        {search.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-gray-500" />
                        {formatRelativeTime(search.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-orange-400" />
                      <span className="font-medium text-gray-100">
                        {search.destinations.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">
                        {search.startDate} to {search.endDate}
                      </span>
                    </div>

                    {/* Activities */}
                    {Object.keys(search.activities).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300 flex items-center">
                          <Star className="h-4 w-4 text-amber-400 mr-1" />
                          Recommended Activities
                        </h4>
                        {Object.entries(search.activities).map(([dest, activities]) => (
                          <div key={dest} className="ml-5">
                            <span className="text-sm font-medium text-gray-300">{dest}:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activities.map(activity => (
                                <span
                                  key={activity}
                                  className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleModify(search)}
                    className="ml-4 p-2 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors border border-orange-500/30 hover:border-orange-400/50"
                    title="Modify Search"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchHistory.length > 0 && (
          <div className="mt-4 text-sm text-gray-400 text-center">
            Showing latest {searchHistory.length} searches (Max 10)
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;