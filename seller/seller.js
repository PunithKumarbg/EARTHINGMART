let currentUser = null;
const offerModal = new bootstrap.Modal(document.getElementById('offerModal'));

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loadOpenRequests();
    loadMyOffers();
  } else {
    window.location.href = "../index.html";
  }
});

function loadOpenRequests() {
  db.collection('requests')
    .where('status', '==', 'Pending')
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
          <td>
            <button class="btn btn-sm btn-success" onclick="openOfferModal('${doc.id}')">
              Submit Offer
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function openOfferModal(requestId) {
  document.getElementById('offerRequestId').value = requestId;
  offerModal.show();
}

document.getElementById('offerForm').addEventListener('submit', e => {
  e.preventDefault();
  const requestId = document.getElementById('offerRequestId').value;
  const price = document.getElementById('offerPrice').value;
  const timeline = document.getElementById('offerTimeline').value;
  const message = document.getElementById('offerMessage').value;

  db.collection('offers').add({
    requestId,
    sellerId: currentUser.uid,
    price: Number(price),
    timeline,
    message,
    status: 'Pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    offerModal.hide();
    document.getElementById('offerForm').reset();
    alert('✅ Offer submitted successfully!');
    loadMyOffers();
  }).catch(err => alert('❌ ' + err.message));
});

function loadMyOffers() {
  db.collection('offers')
    .where('sellerId', '==', currentUser.uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const tbody = document.getElementById('offersTableBody');
      tbody.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        tbody.innerHTML += `
          <tr>
            <td>${data.requestId}</td>
            <td>₹${data.price}</td>
            <td>${data.timeline}</td>
            <td><span class="badge bg-${data.status === 'Pending' ? 'warning' : (data.status === 'Accepted' ? 'success' : 'danger')}">${data.status}</span></td>
          </tr>
        `;
      });
    });
}

function logout() {
  firebase.auth().signOut();
}
