import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");
  const [userData, setUserData] = useState(null);

  const loadUserProfileData = async () => {
    if (!token) return setUserData(null);

    try {
      const { data } = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/get-user", {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin người dùng");
    }
  };

  useEffect(() => {
    loadUserProfileData();
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, userData, setUserData, loadUserProfileData }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
