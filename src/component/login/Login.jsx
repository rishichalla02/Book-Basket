import { useState } from "react";
import { BookOpen, User, Lock, Mail } from "lucide-react";
import "../login/login.css";
import "../button/button.css";
import Field from "../fields/Field";
import Loading, { useLoading } from "../loading/Loading";
import { useNavigate } from "react-router-dom";
import PasswordChecklist from "../auth/PasswordChecklist";
import { useAuth } from "../auth/AuthContext";
import Button from "../button/Button";
import { auth } from "../../firebase/firebase";
import { store } from "../../firebase/firebase";
import { db } from "../../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { doc, getDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = useLoading();

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  // const adminCredentials = [
  //   {
  //     email: process.env.REACT_APP_ADMIN_EMAIL_1,
  //     password: process.env.REACT_APP_ADMIN_PASS_1,
  //   },
  //   {
  //     email: process.env.REACT_APP_ADMIN_EMAIL_2,
  //     password: process.env.REACT_APP_ADMIN_PASS_2,
  //   },
  //   {
  //     email: process.env.REACT_APP_ADMIN_EMAIL_3,
  //     password: process.env.REACT_APP_ADMIN_PASS_3,
  //   },
  // ];

  // Admin check function
  // const isAdmin = (email, password) => {
  //   return adminCredentials.some(
  //     (admin) => admin.email === email && admin.password === password
  //   );
  // };

  const checkIfAdmin = async (uid) => {
    try {
      const adminDoc = await getDoc(doc(store, "admins", uid));
      return adminDoc.exists() && adminDoc.data().role === "admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (isSignup && !username)) {
      toast.error("All fields are required!");
      return;
    }

    startLoading();

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: username,
        });

        // Store user data in Realtime Database
        await set(ref(db, `users/${userCredential.user.uid}`), {
          name: username,
          email: userCredential.user.email,
          role: "user",
        });

        // Set user in AuthContext
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: username,
          role: "user",
        });

        toast.success("Account created successfully!");
        navigate("/home");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const firebaseUser = userCredential.user;

        const isAdmin = await checkIfAdmin(firebaseUser.uid);

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || (isAdmin ? "Admin" : "User"),
          role: isAdmin ? "admin" : "user",
        });

        toast.success(`${isAdmin ? "Admin" : "User"} logged in successfully!`);
        navigate(isAdmin ? "/dashboard" : "/home");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {isLoading && (
        <Loading
          type="spinner"
          size="large"
          message={isSignup ? "Creating account..." : "Signing in..."}
          overlay={true}
        />
      )}

      <div className="loginContainer w-full max-w-2xl">
        <div className="glass-card group">
          <div className="text-center">
            <div className="logo-container mx-auto">
              <BookOpen className="text-black w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">
              {isSignup ? "Create Account" : "Library Portal"}
            </h1>
            <p className="text-black/70 text-base">
              {isSignup ? "Join our library system" : "Welcome back!"}
            </p>
          </div>

          <div className="space-y-2 login-main">
            <Field
              label="Email"
              type="email"
              placeholder="Enter your email"
              Icon={Mail}
              value={email}
              className="styled-input"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <Field
              label="Username"
              type="text"
              placeholder="Enter your username"
              Icon={User}
              value={username}
              className="styled-input"
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
            
            <Field
              label="Password"
              type="password"
              placeholder="Enter your password"
              Icon={Lock}
              value={password}
              className="styled-input"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <div className="checklist">
              <PasswordChecklist password={password} />
            </div>

            <Button
              onClick={handleSubmit}
              text={isSignup ? "Create Account" : "Login"}
              className="login-btn"
              disabled={isLoading}
            />

            <div className="mt-1 text-center border-t border-white/10 pt-1">
              <p className="text-black/60 text-sm">
                {isSignup
                  ? "Already have an account? "
                  : "New to our library? "}
                <button
                  onClick={toggleMode}
                  className="text-black-900 hover:text-white-900 underline font-medium"
                  disabled={isLoading}
                >
                  {isSignup ? "Login here" : "Create an account"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
