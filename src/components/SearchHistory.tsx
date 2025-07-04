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
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <div className="flex flex-col items-center mr-4">
            <Logo size="sm" />
          </div>
          <span>Search History</span>
        </h2>

        {searchHistory.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No searches yet. Start planning your journey!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchHistory.map((search, index) => (
              <div
                key={search.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        search.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {search.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatRelativeTime(search.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-gray-900">
                        {search.destinations.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {search.startDate} to {search.endDate}
                      </span>
                    </div>

                    {/* Activities */}
                    {Object.keys(search.activities).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          Recommended Activities
                        </h4>
                        {Object.entries(search.activities).map(([dest, activities]) => (
                          <div key={dest} className="ml-5">
                            <span className="text-sm font-medium text-gray-600">{dest}:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activities.map(activity => (
                                <span
                                  key={activity}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
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
                    className="ml-4 p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
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
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing latest {searchHistory.length} searches (Max 10)
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;