import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhEYW-2QrAmRSKaEOhylyguDy7EsBF1kU",
  authDomain: "cloud-project-e1dc5.firebaseapp.com",
  projectId: "cloud-project-e1dc5",
  storageBucket: "cloud-project-e1dc5.firebasestorage.app",
  messagingSenderId: "338321325730",
  appId: "1:338321325730:web:9ba5dd63bbca3e0fd221fb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const saveBtn = document.getElementById("saveBtn");
const dataInput = document.getElementById("dataInput");
const dataContainer = document.getElementById("dataContainer");

saveBtn.addEventListener("click", async () => {
  const text = dataInput.value;
  if (!text) return;
  try {
    await addDoc(collection(db, "logs"), { text: text, time: new Date() });
    dataInput.value = "";
  } catch (e) {
    alert("خطأ في الحفظ");
  }
});

window.deleteItem = async (id) => {
  if (confirm("هل تريد حذف هذا السجل من السحابة؟")) {
    try {
      await deleteDoc(doc(db, "logs", id));
    } catch (e) {
      alert("خطأ أثناء الحذف");
    }
  }
};

const q = query(collection(db, "logs"), orderBy("time", "desc"));
onSnapshot(q, (snapshot) => {
  dataContainer.innerHTML = "";
  snapshot.forEach((docItem) => {
    // غيرنا الاسم هنا من document إلى docItem
    const item = docItem.data();
    const id = docItem.id;

    const itemDiv = document.createElement("div"); // الآن سيعمل بشكل صحيح
    // بقية الكود...

    itemDiv.className =
      "data-item p-4 rounded border-r-4 border-blue-500 flex justify-between items-center bg-slate-800 mb-2";
    itemDiv.innerHTML = `
            <div>
                <p class="font-medium">${item.text}</p>
                <span class="text-[10px] text-slate-500">${item.time?.toDate().toLocaleTimeString("ar-EG")}</span>
            </div>
            <button onclick="deleteItem('${id}')" class="text-red-500 hover:bg-red-900/30 p-2 rounded-full transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
        `;
    dataContainer.appendChild(itemDiv);
  });
  if (snapshot.empty)
    dataContainer.innerHTML =
      '<p class="text-slate-500 text-center">لا توجد سجلات</p>';
});
