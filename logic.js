const apiUrl = 'http://localhost:3000/tugas';
let daftarTugasGlobal = [];

// 1. READ - Ambil dan tampilkan semua tugas
async function loadTugas() {
  try {
    const response = await fetch(apiUrl);
    const result = await response.json();
    daftarTugasGlobal = result.data || [];
    
    const tbody = document.getElementById('tabelTugas');
    tbody.innerHTML = '';

    if (daftarTugasGlobal.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">Belum ada tugas kuliah.</td></tr>';
      return;
    }

    daftarTugasGlobal.forEach((tugas) => {
      const tanggalFormat = new Date(tugas.deadline).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      tbody.innerHTML += `
        <tr>
          <td><strong>${tugas.mata_kuliah}</strong></td>
          <td>${tugas.judul_tugas}</td>
          <td>${tanggalFormat}</td>
          <td>
            <select class="status-select status-${tugas.status}" onchange="ubahStatus(${tugas.id}, this.value)">
              <option value="Belum" ${tugas.status === 'Belum' ? 'selected' : ''}>Belum</option>
              <option value="Proses" ${tugas.status === 'Proses' ? 'selected' : ''}>Proses</option>
              <option value="Selesai" ${tugas.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
            </select>
          </td>
          <td>
            <button class="btn-hapus" onclick="hapusTugas(${tugas.id})">Hapus</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('Error memuat data:', err);
  }
}

// 2. CREATE - Tambah tugas baru
document.getElementById('formTugas').addEventListener('submit', async (e) => {
  e.preventDefault();

  const rawDate = document.getElementById('deadline').value;
  const formattedDate = rawDate.replace('T', ' ') + ':00';

  const dataBaru = {
    mata_kuliah: document.getElementById('matkul').value,
    judul_tugas: document.getElementById('judul').value,
    deadline: formattedDate
  };

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataBaru)
  });

  document.getElementById('formTugas').reset();
  loadTugas();
});

// 3. UPDATE - Ubah status tugas lewat dropdown
async function ubahStatus(id, statusBaru) {
  const tugasLama = daftarTugasGlobal.find(t => t.id === id);
  if (!tugasLama) return;

  const d = new Date(tugasLama.deadline);
  const pad = (n) => String(n).padStart(2, '0');
  const mysqlDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mata_kuliah: tugasLama.mata_kuliah,
      judul_tugas: tugasLama.judul_tugas,
      deadline: mysqlDate,
      status: statusBaru
    })
  });

  loadTugas();
}

// 4. DELETE - Hapus tugas
async function hapusTugas(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  loadTugas();
}

loadTugas();