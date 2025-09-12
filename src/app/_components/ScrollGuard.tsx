"use client";

import { useEffect, useRef } from "react";

export default function ScrollGuard() {
  const didMount = useRef(false);
  
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    
    // Si no hay hash en la URL, llevamos al tope y NO otra vez.
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);
  
  return null;
}
