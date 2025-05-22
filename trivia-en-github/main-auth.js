
// --- Firebase Authentication & Active User Limiting (Max 100) ---

import { getAuth, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();
const userInfo = document.getElementById("userInfo");
const signOutBtn = document.getElementById("signOutBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");

googleLoginBtn.onclick = async () => {
  const snapshot = await getDocs(collection(db, "activeUsers"));
  if (snapshot.size >= 100) {
    alert("🚫 Server full: 100 users currently active. Try again later.");
    return;
  }

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await setDoc(doc(db, "activeUsers", user.uid), {
      uid: user.uid,
      displayName: user.displayName || "Player"
    });

    window.addEventListener("beforeunload", () => {
      deleteDoc(doc(db, "activeUsers", user.uid));
    });
  } catch (err) {
    console.error("Auth error:", err);
  }
};

signOutBtn.onclick = async () => {
  const user = auth.currentUser;
  if (user) {
    await deleteDoc(doc(db, "activeUsers", user.uid));
    await signOut(auth);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    userInfo.textContent = `Signed in as: ${user.displayName || user.email}`;
    userInfo.classList.remove("hidden");
    signOutBtn.classList.remove("hidden");
    googleLoginBtn.classList.add("hidden");
  } else {
    userInfo.textContent = "";
    userInfo.classList.add("hidden");
    signOutBtn.classList.add("hidden");
    googleLoginBtn.classList.remove("hidden");
  }
});
