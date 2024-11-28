import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import RouteList from "./Routes";
import "./i18n/i18n";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WebSocketComponent from './Components/WebSocketComponent';
import { MessageProvider } from "./Components/MessageContext";


function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('lastVisitedPage', window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
      <MessageProvider>
        <RouteList />
        <WebSocketComponent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
      </MessageProvider>
  );
}

export default App;
