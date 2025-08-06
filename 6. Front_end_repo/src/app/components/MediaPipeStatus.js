'use client';

export default function MediaPipeStatus({ mediaPipeLoaded, mediaPipeLoading, handsInitialized }) {
  const getStatusColor = () => {
    if (mediaPipeLoaded && handsInitialized) {
      return 'bg-green-100 text-green-800';
    } else if (mediaPipeLoaded) {
      return 'bg-blue-100 text-blue-800';
    } else if (mediaPipeLoading) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = () => {
    if (mediaPipeLoaded && handsInitialized) {
      return 'Ready';
    } else if (mediaPipeLoaded) {
      return 'Initializing Hands...';
    } else if (mediaPipeLoading) {
      return 'Loading...';
    } else {
      return 'Failed';
    }
  };

  return (
    <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}>
      MediaPipe: {getStatusText()}
    </div>
  );
} 