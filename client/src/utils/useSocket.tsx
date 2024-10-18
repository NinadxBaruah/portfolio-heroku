// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";

// export const useSocket = () => {
//   const [socket, setSocket] = useState<WebSocket | null>(null);


//   function connectWebSocket(){
//     const authToken = Cookies.get("__authToken");
//     const ws = new WebSocket(
//       `ws://${import.meta.env.VITE_APP_BACKEND_URL}/send-message`,
//       authToken
//     );

//     ws.onopen = () => {
//       console.log("WebSocket connection established.");
//       setSocket(ws);
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     ws.onclose = () => {
//       console.log("WebSocket connection closed.");
//     };

//   }

//   async function sendMessage() {
    
//   }

// return {connectWebSocket, socket};
// };


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
      const ws = new WebSocket(`ws://${import.meta.env.VITE_APP_BACKEND_URL}/send-message`, authToken);

      ws.onopen = () => {
        console.log("WebSocket connection established.");
      };

      ws.onmessage = (event) => {
        console.log("Message received:", event.data);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      setSocket(ws);

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
