'use client';

import { useNotifications } from '@/context/NotificationContext';
import Icon from '@/components/ui/AppIcon';

export default function NotificationBadge() {
    const { unreadCount } = useNotifications();

    if (unreadCount === 0) return null;

    return (
        <div className="absolute -top-1 -right-1 flex items-center justify-center">
            <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-accent items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                </span>
            </span>
        </div>
    );
}
