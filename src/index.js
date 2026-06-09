import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error: error.toString() }; }
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: { background: '#060d14', color: '#f87171', padding: 40, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap', minHeight: '100vh' }
      }, 'ERROR:\n' + this.state.error);
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ErrorBoundary, null, React.createElement(App)));
