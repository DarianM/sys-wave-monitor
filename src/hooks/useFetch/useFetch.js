import { useState, useEffect } from "react";

const DEFAULT_OPTIONS = {
    headers: { "Content-Type": "application/json" },
}

export default function useFetch(url) {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      fetch(url, { ...DEFAULT_OPTIONS })
        .then(res => {
           if(res.ok) return res.json();
           return res.json().then(json => Promise.reject(json));
        })
        .then((data) => setData(data));
    }, [url]);
  
    return data;
  };