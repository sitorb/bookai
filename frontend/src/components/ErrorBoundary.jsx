import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-10 text-center">
          <h1 className="text-4xl font-serif mb-4">Something went wrong.</h1>
          <p className="text-stone-500 mb-8">The archives are temporarily unavailable.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-stone-800 text-white px-8 py-3 rounded-full"
          >
            Return to Library
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;