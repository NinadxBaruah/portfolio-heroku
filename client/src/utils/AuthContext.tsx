import {createContext, useEffect, useState , useContext} from 'react'
import Cookies from "js-cookie"
// Define the shape of the context value
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}:AuthProviderProps) => {
    const [isLoggedIn , setIsLoggedIn] = useState(false);

    useEffect(() =>{
        const token = Cookies.get('__authToken');
        // const token = undefined;
        setIsLoggedIn(!!token);
    }, []);

    const login = (token:string) =>{
        Cookies.set('__authToken' , token , {expires: 7});
        setIsLoggedIn(true);
        window.location.reload();
    }

    const logout = () => {
        Cookies.remove('__authToken');
        setIsLoggedIn(false);
        Cookies.remove('userInfo')
        window.location.reload();
      };

      return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
          {children}
        </AuthContext.Provider>
      ); 
}


export const useAuth = ()  => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};