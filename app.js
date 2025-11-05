let daftarMenu = [];
let daftarPesanan = [];

const formMenu = document.getElementById('formMenu');
const inputNama = document.getElementById('nama');
const inputHarga = document.getElementById('harga');
const inputDeskripsi = document.getElementById('deskripsi');
const inputFoto = document.getElementById('foto');

const searchMenu = document.getElementById('searchMenu');
const menuList = document.getElementById('menuList');

const orderList = document.getElementById('orderList');
const totalHarga = document.getElementById('totalHarga');

const bayarInput = document.getElementById('bayarInput');
const btnCheckout = document.getElementById('btnCheckout');
const kembalianText = document.getElementById('kembalianText');


formMenu.addEventListener('submit', function (e) {
  e.preventDefault();
  const namaVal = inputNama.value.trim();
  const hargaVal = parseInt(inputHarga.value);
  const deskripsiVal = inputDeskripsi.value.trim();
  const fotoVal = inputFoto.value.trim() || "https://via.placeholder.com/400x300?text=No+Image";

  if (!namaVal || isNaN(hargaVal) || hargaVal <= 0) {
    alert("Nama dan harga harus diisi dengan benar!");
    return;
  }

  const makanan = {
    id: Date.now(),
    nama: namaVal,
    harga: hargaVal,
    deskripsi: deskripsiVal,
    foto: fotoVal
  };

  daftarMenu.push(makanan);
  formMenu.reset();
  renderMenu(searchMenu.value.toLowerCase());
});

function renderMenu(keyword = "") {
  menuList.innerHTML = "";
  const itemsToShow = daftarMenu.filter(m =>
    m.nama.toLowerCase().includes(keyword)
  );

  if (itemsToShow.length === 0) {
    menuList.innerHTML = `
      <div class="p-4 bg-[#fffaf2] rounded text-center text-gray-600">
        Tidak ada menu yang cocok.
      </div>
    `;
    return;
  }

  itemsToShow.forEach(makanan => {
    const card = document.createElement('div');
    card.className = "bg-[#fffaf2] rounded-xl shadow-lg overflow-hidden flex flex-col";

    card.innerHTML = `
      <img src="${makanan.foto}" alt="${makanan.nama}" class="h-36 w-full object-cover">
      <div class="p-3 flex-1">
        <h3 class="font-semibold text-amber-800">${makanan.nama}</h3>
        <p class="text-sm text-gray-500 mt-1">${makanan.deskripsi || '-'}</p>
      </div>
      <div class="p-3 flex items-center justify-between gap-3">
        <span class="font-bold text-amber-700">Rp ${makanan.harga.toLocaleString()}</span>
        <button class="add-btn bg-amber-700 text-white px-3 py-1 rounded hover:bg-amber-800 transition">Tambah</button>
      </div>
    `;

    const btn = card.querySelector('.add-btn');
    btn.addEventListener('click', () => tambahPesanan(makanan));

    menuList.appendChild(card);
  });
}

searchMenu.addEventListener('input', () => {
  renderMenu(searchMenu.value.toLowerCase());
});

function tambahPesanan(makanan) {
  const found = daftarPesanan.find(p => p.id === makanan.id);
  if (found) {
    found.jumlah += 1;
  } else {
    daftarPesanan.push({ ...makanan, jumlah: 1 });
  }
  renderPesanan();
}

function renderPesanan() {
  orderList.innerHTML = "";

  if (daftarPesanan.length === 0) {
    orderList.innerHTML = `<li class="py-2 text-gray-600">Belum ada pesanan.</li>`;
    totalHarga.textContent = `Total: Rp 0`;
    kembalianText.textContent = "";
    return;
  }

  let total = 0;

  daftarPesanan.forEach(item => {
    const li = document.createElement('li');
    li.className = "flex justify-between items-center py-2";

    li.innerHTML = `
      <div>
        <p class="font-semibold">${item.nama}</p>
        <p class="text-sm text-gray-500">Rp ${item.harga.toLocaleString()} × ${item.jumlah}</p>
      </div>
      <div class="flex gap-2 items-center">
        <button class="decrease px-2 py-1 rounded bg-yellow-500 text-white">-</button>
        <button class="increase px-2 py-1 rounded bg-yellow-500 text-white">+</button>
        <button class="delete px-2 py-1 rounded bg-red-500 text-white">Hapus</button>
      </div>
    `;

    li.querySelector('.decrease').addEventListener('click', () => ubahJumlah(item.id, -1));
    li.querySelector('.increase').addEventListener('click', () => ubahJumlah(item.id, +1));
    li.querySelector('.delete').addEventListener('click', () => hapusPesanan(item.id));

    orderList.appendChild(li);

    total += item.harga * item.jumlah;
  });

  totalHarga.textContent = `Total: Rp ${total.toLocaleString()}`;
}

function ubahJumlah(id, delta) {
  const item = daftarPesanan.find(i => i.id === id);
  if (!item) return;
  item.jumlah += delta;
  if (item.jumlah <= 0) {
    hapusPesanan(id);
  } else {
    renderPesanan();
  }
}

function hapusPesanan(id) {
  daftarPesanan = daftarPesanan.filter(i => i.id !== id);
  renderPesanan();
}

btnCheckout.addEventListener('click', () => {
  const total = daftarPesanan.reduce((s, it) => s + it.harga * it.jumlah, 0);
  const bayar = parseInt(bayarInput.value);

  if (isNaN(bayar) || bayar < total) {
    alert("Uang tidak cukup!");
    return;
  }

  const kembalian = bayar - total;
  kembalianText.textContent = `✅ Pembayaran berhasil! Kembalian: Rp ${kembalian.toLocaleString()}`;

  daftarPesanan = [];
  renderPesanan();
  bayarInput.value = "";
});

renderMenu();
renderPesanan();