document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", email));
    
    if (userDoc.exists() && userDoc.data().role === "admin") {
      window.location.href = "admin.html";
    } else {
      alert("Доступ только для администраторов");
      await auth.signOut();
    }
  } catch (error) {
    console.error("Ошибка входа:", error);
    alert(`Ошибка входа: ${error.message}`);
  }
});