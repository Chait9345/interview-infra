"use client";

import React, { useState, useEffect } from 'react';

const SystemHeartbeat = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [micStatus, setMicStatus] = useState<'pending' | 'granted' | 'denied'>('pending');

  useEffect(() => {
    // 1. Check Network Health
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    // 2. Check Microphone Permission
    navigator.permissions.query({ name: 'microphone' as PermissionName })
      .then((permissionStatus) => {
        setMicStatus(permissionStatus.state as any);
        permissionStatus.onchange = () => setMicStatus(permissionStatus.state as any);
      });

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-slate-900/50 backdrop-blur-md rounded-full border border-white/10 text-xs font-medium transition-all">
      {/* Network Indicator */}
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-white/70">{isOnline ? 'Network: Stable' : 'Network: Offline'}</span>
      </div>

      <div className="w-[1px] h-3 bg-white/20" />

      {/* Mic Indicator */}
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${
          micStatus === 'granted' ? 'bg-green-500 animate-pulse' : 
          micStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <span className="text-white/70">
          {micStatus === 'granted' ? 'Mic: Active' : 
           micStatus === 'pending' ? 'Mic: Calibrating' : 'Mic: Error'}
        </span>
      </div>
    </div>
  );
};

export default SystemHeartbeat;