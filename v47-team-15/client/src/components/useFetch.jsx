import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(url) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(url, {
          timeout: 15000,
          withCredentials: true,
        });

        const responseData = response.data.data;
        console.log('Global data:', responseData);
        setData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, isLoading };
}

export default useFetch;
