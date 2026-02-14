'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import Icon from '@/components/ui/AppIcon';
import { formatDistanceToNow } from '@/lib/dateUtils';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleNotificationClick = async (notificationId: string, read: boolean) => {
        if (!read) {
            await markAsRead(notificationId);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'booking_update':
                return 'CalendarIcon';
            case 'new_booking':
                return 'BellIcon';
            case 'review_received':
                return 'StarIcon';
            case 'message':
                return 'ChatBubbleLeftIcon';
            default:
                return 'BellIcon';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-text-secondary hover:text-text-primary transition-smooth rounded-lg hover:bg-surface"
                aria-label="Notifications"
            >
                <Icon name="BellIcon" size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-xl shadow-xl z-50 animate-zoom-in">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h3 className="text-lg font-semibold text-text-primary">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-accent hover:text-success transition-smooth"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Icon name="BellSlashIcon" size={48} className="mx-auto text-muted mb-3" />
                                <p className="text-text-secondary">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification.id, notification.read)}
                                        className={`p-4 cursor-pointer transition-smooth hover:bg-surface ${!notification.read ? 'bg-accent/5' : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 p-2 rounded-lg ${!notification.read ? 'bg-accent/10' : 'bg-muted'
                                                }`}>
                                                <Icon
                                                    name={getNotificationIcon(notification.type)}
                                                    size={20}
                                                    className={!notification.read ? 'text-accent' : 'text-text-secondary'}
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <p className={`text-sm font-medium ${!notification.read ? 'text-text-primary' : 'text-text-secondary'
                                                        }`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && (
                                                        <span className="flex-shrink-0 w-2 h-2 bg-accent rounded-full ml-2 mt-1"></span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-xs text-muted">
                                                        {formatDistanceToNow(notification.created_at)}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                        className="text-xs text-error hover:text-error/80 transition-smooth"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-border text-center">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-sm text-accent hover:text-success transition-smooth"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
