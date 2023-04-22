import { useState, useEffect } from "react";
import axios from "axios";

/**
 * A custom hook which fetches data from the given URL. Includes functionality to determine
 * whether the data is still being loaded or not.
 * code credit: Andrew Meads 
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function useGet(url, initialState = null, access_token = null) {
  const [data, setData] = useState(initialState);
  const [isLoading, setLoading] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const full_url = BASE_URL + url; 

  console.log("in useGet " + url)

  useEffect(() => {
    if (!access_token) {
      console.log("No access token")
      return;
    }
    console.log("hello")
    async function fetchData() {
      setLoading(true);
      console.log("fetching data")
      const response = await axios.get(full_url, {
        onError: (err) => console.log(err),
      });
      setData(response.data);
      console.log(response.data)
      setLoading(false);
    }
    fetchData();
  }, [url, refreshToggle, access_token]);

  function refresh() {
    setRefreshToggle(!refreshToggle);
  }

  return { data, isLoading, refresh };
}
