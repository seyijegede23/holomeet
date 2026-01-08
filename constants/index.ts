import {
  CalendarClock,
  History,
  Home,
  Video,
  MonitorSmartphone,
  LucideIcon,
} from 'lucide-react';

// Define the structure for type safety
export type SidebarLink = {
  icon: LucideIcon;
  route: string;
  label: string;
};

export const sidebarLinks: SidebarLink[] = [
  {
    icon: Home,
    route: '/',
    label: 'Home',
  },
  {
    icon: CalendarClock,
    route: '/upcoming',
    label: 'Upcoming',
  },
  {
    icon: History,
    route: '/previous',
    label: 'Previous',
  },
  {
    icon: Video,
    route: '/recordings',
    label: 'Recordings',
  },
  {
    icon: MonitorSmartphone,
    route: '/personal-room',
    label: 'Personal Room',
  },
];

// New, high-quality, diverse avatar images from Unsplash
// Sized to 150x150 and cropped to faces for performance.
export const avatarImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=faces',
];