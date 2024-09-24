import { useState, useEffect } from "react";

const DEFAULT_OPTIONS = {
    headers: { "Content-Type": "application/json" },
}

export default function useFetch(url: string): { totalMem: string } | null {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      fetch(url, { ...DEFAULT_OPTIONS })
        .then(async res => {
           if(res.ok) return res.json();
           const json = await res.json();
          return await Promise.reject(json);
        })
        .then((data) => setData(data));
    }, [url]);
  
    return data;
  };