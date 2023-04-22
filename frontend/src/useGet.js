import { useState, useEffect } from "react";
import axios from "axios";

/**
 * A custom hook which fetches data from the given URL. Includes functionality to determine
 * whether the data is still being loaded or not.
 * code credit: Andrew Meads 
 */


export default function useGet(url, initialState = null) {
  const [data, setData] = useState(initialState);
  const [isLoading, setLoading] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);
  url = "http://localhost:3000/api" + url;

  console.log("in useGet " + url)

  useEffect(() => {
    console.log("hello")
    async function fetchData() {
      setLoading(true);
      console.log("fetching data")
      const response = await axios.get(url, {
        onError: (err) => console.log(err),
      });
      setData(response.data);
      console.log(response.data)
      setLoading(false);
    }
    fetchData();
  }, [url, refreshToggle]);

  function refresh() {
    setRefreshToggle(!refreshToggle);
  }

  return { data, isLoading, refresh };
}
