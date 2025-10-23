function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
  
    auth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        return db.collection('users').doc(cred.user.uid).set({ role: role });
      })
      .then(() => {
        alert('Account created!');
        redirect(role);
      })
      .catch(error => alert(error.message));
  }
  
  function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const selectedRole = document.getElementById('role').value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then(cred => {
        return db.collection('users').doc(cred.user.uid).get();
      })
      .then(doc => {
        if (doc.exists) {
          const role = doc.data().role;
          if (role === selectedRole) {
            redirect(role);
          } else {
            alert(`You are registered as ${role}, not ${selectedRole}`);
            auth.signOut();
          }
        }
      })
      .catch(error => alert(error.message));
  }
  
  function redirect(role) {
    if (role === 'buyer') {
      window.location.href = 'buyer/buyer.html';
    } else if (role === 'seller') {
      window.location.href = 'seller/seller.html';
    } else if (role === 'admin') {
      window.location.href = 'admin/admin.html';
    }
  }
  