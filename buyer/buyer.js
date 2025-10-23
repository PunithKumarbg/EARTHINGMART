// buyer.js

let currentUser = null;

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loadMyRequests();
  } else {
    window.location.href = "../index.html";
  }
});

const form = document.getElementById('requestForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const productType = document.getElementById('productType').value;
  const quantity = document.getElementById('quantity').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;

  db.collection('requests').add({
    buyerId: currentUser.uid,
    productType,
    quantity: Number(quantity),
    location,
    description,
    status: 'Pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    form.reset();
    loadMyRequests();
    alert('✅ Request submitted successfully!');
  }).catch(err => {
    console.error(err);
    alert('❌ Error: ' + err.message);
  });
});

function loadMyRequests() {
  db.collection('requests')
    .where('buyerId', '==', currentUser.uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const tbody = document.getElementById('requestsTableBody');
      tbody.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${data.productType}</td>
          <td>${data.quantity}</td>
          <td>${data.location}</td>
          <td><span class="badge bg-${data.status === 'Pending' ? 'warning' : 'success'}">${data.status}</span></td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function logout() {
  firebase.auth().signOut();
}
