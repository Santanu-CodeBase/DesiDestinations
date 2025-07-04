export interface SearchRecord {
  id: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  activities: { [key: string]: string[] };
  timestamp: string;
  status: 'active' | 'completed';
}

export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'search_complete' | 'booking_reminder' | 'general';
}

export interface Destination {
  name: string;
  state: string;
  type: 'state' | 'city';
  activities: string[];
}