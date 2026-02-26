import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/api";

const useQuery = (urlPath) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const fetchApi = useCallback(() => {
    if (!urlPath) return;

    setIsLoading(true);
    fetch(`${API_BASE_URL}${urlPath}`)
      .then((res) => res.json())
      .then((response) => setData(response))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [urlPath]);

  useEffect(() => {
    if (!urlPath) return;

    fetchApi();
  }, [urlPath, fetchApi]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchApi,
  };
};

export default useQuery;
