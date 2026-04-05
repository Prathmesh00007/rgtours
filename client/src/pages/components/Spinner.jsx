import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-travel-primary via-travel-secondary to-travel-primary">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Redirecting you in {count} {count === 1 ? "second" : "seconds"}
        </h1>
        <p className="text-white/80">Please wait...</p>
      </div>
    </div>
  );
};

export default Spinner;
