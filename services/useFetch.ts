import { useState, useEffect, useCallback, useRef } from "react";

// fetch data without cluttering components!
// use generics 'T' to allow for different types of data to be returned.
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isCancelledRef = useRef(false);

  // Only update fetchData when fetchFunction changes.
  const fetchData = useCallback(async () => {
    isCancelledRef.current = false; // so, each time we fetch data we set the isCancelledRef to false
    // so, basically we know if we have cancelled a fetch by checking the isCancelledRef.current

    // this is especially helpful when we unmount as we have a useEffect that will set the isCancelledRef to true when the component unmounts
    // ensuring that we don't try to update the state of a component that is no longer mounted saving us
    // from potential memory leaks and errors.
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      if (!isCancelledRef.current) {
        setData(result);
        return result;
      }
      return null;
    } catch (error) {
      if (!isCancelledRef.current) {
        const errorObj =
          error instanceof Error ? error : new Error("An error occurred");
        setError(errorObj);
        throw errorObj;
      }
      return null;
    } finally {
      if (!isCancelledRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction]);

  // reset all state to initial values
  const reset = useCallback(() => {
    isCancelledRef.current = true;
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // if fetchFunction changes or autoFetch is changed, and autoFetch is true then fetch data!
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    return () => {
      isCancelledRef.current = true;
    };
  }, [autoFetch, fetchData]); // KEY DETAIL: Remember that useEffect blocks will return a cleanup function
  // when the component unmounts or the dependencies change.

  // remember hooks have to return something!
  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
