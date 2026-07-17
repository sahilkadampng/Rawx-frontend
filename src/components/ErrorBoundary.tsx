import React, { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#111214',
                    color: '#ffffff',
                    fontFamily: 'Arimo, sans-serif',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Oops! Something went wrong</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#999' }}>
                        The application encountered an error and couldn't render properly.
                    </p>
                    <details style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                        <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>Error Details</summary>
                        <pre style={{
                            textAlign: 'left',
                            backgroundColor: '#1a1a1a',
                            padding: '1rem',
                            borderRadius: '8px',
                            overflow: 'auto',
                            fontSize: '0.9rem'
                        }}>
                            {this.state.error?.toString()}
                            {'\n\n'}
                            {this.state.error?.stack}
                        </pre>
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.75rem 2rem',
                            fontSize: '1rem',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontFamily: 'Arimo, sans-serif'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
