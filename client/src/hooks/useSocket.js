import { useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../context/authStore';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4300';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, isAuthenticated]);

  const joinJob = useCallback((jobId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_job', jobId);
    }
  }, []);

  const onProgress = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('generation:progress', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('generation:progress', callback);
      }
    };
  }, []);

  const onComplete = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('generation:complete', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('generation:complete', callback);
      }
    };
  }, []);

  const onError = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('generation:error', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('generation:error', callback);
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    joinJob,
    onProgress,
    onComplete,
    onError,
    isConnected: socketRef.current?.connected || false,
  };
};

export default useSocket;