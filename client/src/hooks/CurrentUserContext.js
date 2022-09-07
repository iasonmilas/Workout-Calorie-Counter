import { createContext } from "react";
import usePersistedState from "./UsePersistedState";

export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentuser, removeCurrentUser] = usePersistedState(null, "car-login");

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentuser,
        removeCurrentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
