import { createContext, useContext, useEffect, useState } from "react";
import { auth, store, db } from "../../firebase/firebase"; // store = Firestore, db = Realtime DB
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setCart } from "../../feature/books/cartSlice";
import { doc, getDoc } from "firebase/firestore";
import { ref, get } from "firebase/database"; // for Realtime DB

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let role = "user";
        let displayName = firebaseUser.displayName || "User";

        try {
          // 1. Check Firestore for admin role
          const adminDoc = await getDoc(doc(store, "admins", firebaseUser.uid));
          if (adminDoc.exists() && adminDoc.data().role === "admin") {
            role = "admin";
            displayName = "Admin";
          } else {
            // 2. If not admin, check Realtime DB for user data
            const userRef = ref(db, `users/${firebaseUser.uid}`);
            const userSnap = await get(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.val();
              displayName = userData.name || displayName;
              role = userData.role || "user";
            }
          }
        } catch (error) {
          console.error("Error checking user/admin role:", error.message);
        }

        // Set user in context
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName,
          role,
        });
      } else {
        setUser(null);
        dispatch(setCart([]));
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
