// Loading.jsx
import React from "react";
import { Loader2, BookOpen } from "lucide-react";
import "./loading.css";

const Loading = ({
  type = "spinner",
  size = "medium",
  message = "Loading...",
  overlay = false,
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const LoadingSpinner = () => (
    <div className={`loading-spinner ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  const LoadingBooks = () => (
    <div className={`loading-books ${className}`}>
      <BookOpen className={`animate-pulse ${sizeClasses[size]}`} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  const LoadingDots = () => (
    <div className={`loading-dots ${className}`}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  const LoadingSkeleton = () => (
    <div className={`loading-skeleton ${className}`}>
      <div className="skeleton-item"></div>
      <div className="skeleton-item"></div>
      <div className="skeleton-item"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  const renderLoading = () => {
    switch (type) {
      case "books":
        return <LoadingBooks />;
      case "dots":
        return <LoadingDots />;
      case "skeleton":
        return <LoadingSkeleton />;
      default:
        return <LoadingSpinner />;
    }
  };

  if (overlay) {
    return <div className="loading-overlay">{renderLoading()}</div>;
  }

  return renderLoading();
};

// Higher-order component for wrapping components with loading state
export const withLoading = (WrappedComponent) => {
  return function LoadingComponent({ isLoading, loadingProps, ...props }) {
    if (isLoading) {
      return <Loading {...loadingProps} />;
    }
    return <WrappedComponent {...props} />;
  };
};

// Hook for managing loading states
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setIsLoading,
  };
};

export default Loading;
