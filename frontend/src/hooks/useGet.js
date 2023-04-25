import { useState, useEffect } from "react";
import axios from "axios";

/**
 * A custom hook which fetches data from the given URL. Includes functionality to determine
 * whether the data is still being loaded or not.
 * code credit: Andrew Meads 
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function useGet(url) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const full_url = BASE_URL + url; 
  const access_token = localStorage.getItem("access_token");
  console.log("full url: " + full_url);

  useEffect(() => {
    setRefreshToggle(!refreshToggle);
  }, []);

  useEffect(() => {
    if (!access_token) {
      return;
    }
    async function fetchData() {
      setLoading(true);
      const response = await axios.get(full_url, {
        onError: (err) => console.log(err),
      });
      setData(response.data);
      setLoading(false);
    }
    fetchData();
  }, [url, refreshToggle, access_token]);

  return { data, isLoading };
}
