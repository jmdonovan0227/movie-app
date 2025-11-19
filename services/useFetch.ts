import { useState, useEffect, useCallback } from "react";

// fetch data without cluttering components!
// use generics 'T' to allow for different types of data to be returned.
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Only update fetchData when fetchFunction changes.
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      setData(result);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  // reset all state to initial values
  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  // if fetchFunction changes or autoFetch is changed, and authFetch is true then fetch data!
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // remember hooks have to return something!
  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
