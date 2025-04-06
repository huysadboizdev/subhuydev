import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/user/get-user', {
        headers: { token }
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};
