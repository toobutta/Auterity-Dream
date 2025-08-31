import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isActive: boolean;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

/**
 * Hook for managing service worker registration and updates
 */
export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isActive: false,
    updateAvailable: false,
    registration: null,
  });

  useEffect(() => {
    if (!state.isSupported) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('Service Worker registered:', registration);

        // Update state based on registration
        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration,
          isInstalling: registration.installing !== null,
          isWaiting: registration.waiting !== null,
          isActive: registration.active !== null,
        }));

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('Service Worker update found');

            newWorker.addEventListener('statechange', () => {
              const currentState = newWorker.state as string;
              setState(prev => ({
                ...prev,
                isInstalling: currentState === 'installing',
                isWaiting: currentState === 'waiting',
                updateAvailable: currentState === 'waiting',
              }));
            });
          }
        });

        // Listen for controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service Worker controller changed - page will reload');
          window.location.reload();
        });

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

      } catch (error) {
        console.error('Service Worker registration failed:', error);
        setState(prev => ({
          ...prev,
          isRegistered: false,
        }));
      }
    };

    registerServiceWorker();
  }, [state.isSupported]);

  const updateServiceWorker = () => {
    if (state.registration && state.registration.waiting) {
      // Send message to waiting service worker to skip waiting
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const getCacheInfo = async () => {
    if (!state.registration?.active) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      state.registration.active.postMessage(
        { type: 'GET_CACHE_INFO' },
        [messageChannel.port2]
      );
    });
  };

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    }
  };

  return {
    ...state,
    updateServiceWorker,
    getCacheInfo,
    clearCache,
  };
}

/**
 * Hook for monitoring service worker messages
 */
export function useServiceWorkerMessages() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      console.log('Service Worker message:', event.data);

      // Handle different message types
      switch (event.data.type) {
        case 'CACHE_UPDATED':
          console.log('Cache updated:', event.data.payload);
          break;
        case 'OFFLINE_READY':
          console.log('App is ready for offline use');
          break;
        case 'SYNC_COMPLETED':
          console.log('Background sync completed');
          break;
        default:
          console.log('Unknown message type:', event.data.type);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);
}

export default useServiceWorker;
