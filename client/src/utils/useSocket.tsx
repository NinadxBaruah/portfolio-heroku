

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Define the shape of the socket context
interface SocketContextType {
  socket: WebSocket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Create a provider to manage the WebSocket connection globally
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const authToken = Cookies.get("__authToken");
    
    if (!authToken) {
      console.error("No auth token found.");
      return;
    }

    // Avoid re-establishing the WebSocket if it already exists
    if (!socket) {
      try{
        const ws = new WebSocket(`wss://${import.meta.env.VITE_APP_BACKEND_URL_WS}/send-message`, authToken);
        ws.onopen = () => {
          console.log("WebSocket connection established.");
        };
  
        ws.onmessage = (event) => {
          console.log("Message received:", event.data);
            console.log(event.data)
        };
  
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
  
        ws.onclose = () => {
          console.log("WebSocket connection closed.");
        };
  
        setSocket(ws);
      }
      catch(err) {
        console.error("Error establishing WebSocket connection:", err);
      }
  

      // return () => {
      //   ws.close();
      // };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook to access the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};


