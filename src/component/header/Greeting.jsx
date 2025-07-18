import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import "../header/greeting.css";

const Greeting = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();
  const userName = user?.displayName || "there";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const date = currentTime.toLocaleDateString();

  let greeting = "";
  if (hours < 12) {
    greeting = "Good Morning";
  } else if (hours < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const hour12 = hours % 12 || 12;
  const greetingTime = `${hour12.toString().padStart(2, "0")}:${minutes} ${
    hours < 12 ? "AM" : "PM"
  } | ${date}`;

  return (
    <div className="greet-container">
      <h1>
        Hello {userName}! <span> 👤 {greeting} | {greetingTime}</span> 
      </h1>
    </div>
  );
};

export default Greeting;
