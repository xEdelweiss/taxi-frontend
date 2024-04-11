import React from 'react';

const Fallback = ({ error }) => {
  return (
    <div className={'relative h-full'}>
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
        <h1 className="text-3xl">😳</h1>

        <div className="text-lg text-gray-500">{error.message}</div>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error: error };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.error('Error boundary:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
