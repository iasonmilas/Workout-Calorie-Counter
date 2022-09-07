import { useState, useEffect } from "react";

const usePersistedState = (initState, key) => {
  const [data, setData] = useState(() => {
    // get data stored in localstorage
    let data = null;
    const item = sessionStorage.getItem(key);
    if (typeof item === "string" ) {
      data = JSON.parse(item);
      if (data) {
        return data;
      }
    }

    return initState;
  });

  useEffect(() => {
    // we want to persist the data to localstorage
    sessionStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  const removeData = () => {
    sessionStorage.removeItem(key);
  }

  return [data, setData, removeData];
};
export default usePersistedState;