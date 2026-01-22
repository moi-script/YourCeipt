import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BASE_API_URL } from '@/api/getKeys.js';
// const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"


const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 1. Fetch on Load
  const fetchNotifs = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(BASE_API_URL + "/notification/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id })
      });
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Optional: Poll every 30 seconds
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // 2. Mark Read Action
  const handleMarkRead = async (id) => {
    try {
      await fetch(BASE_API_URL + "/notification/read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id })
      });
      // Optimistic Update
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  // 3. Helper for Icons based on 'type'
  const getIcon = (type) => {
      switch(type) {
          case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
          case 'alert': return <AlertCircle className="w-4 h-4 text-red-500" />;
          case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
          default: return <Info className="w-4 h-4 text-blue-500" />;
      }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 mr-4 bg-white/80 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl" align="end">
        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800">
            <h4 className="font-serif font-bold text-stone-800 dark:text-stone-100">Notifications</h4>
            {unreadCount > 0 && (
                 <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>
            )}
        </div>

        <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-sm">No notifications yet.</div>
            ) : (
                <div className="flex flex-col">
                    {notifications.map((notif) => (
                        <div 
                            key={notif._id} 
                            onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                            className={`p-4 border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                        >
                            <div className="flex gap-3">
                                <div className="mt-0.5">{getIcon(notif.type)}</div>
                                <div className="flex-1">
                                    <p className={`text-sm ${!notif.isRead ? 'font-bold text-stone-800 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}>
                                        {notif.title}
                                    </p>
                                    <p className="text-xs text-stone-500 mt-1 leading-snug">{notif.message}</p>
                                    <p className="text-[10px] text-stone-400 mt-2">
                                        {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                                {!notif.isRead && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;