document.addEventListener("DOMContentLoaded", loadData);

function formatNominal(input) {
    let value = input.value.replace(/\D/g, "");
    input.value = new Intl.NumberFormat("id-ID").format(value);
}

function tambahData() {
    let keterangan = document.getElementById("keterangan").value;
    let nominalMasukInput = document.getElementById("nominalMasuk");
    let nominalKeluarInput = document.getElementById("nominalKeluar");
    let nominalMasuk = parseInt(nominalMasukInput.value.replace(/\./g, "")) || 0;
    let nominalKeluar = parseInt(nominalKeluarInput.value.replace(/\./g, "")) || 0;

    if (!keterangan || (nominalMasuk === 0 && nominalKeluar === 0)) {
        alert("Harap isi keterangan dan salah satu nominal!");
        return;
    }

    let data = JSON.parse(localStorage.getItem("dataList")) || [];
    data.push({ keterangan, nominalMasuk, nominalKeluar });
    localStorage.setItem("dataList", JSON.stringify(data));
    loadData();

    document.getElementById("keterangan").value = "";
    nominalMasukInput.value = "";
    nominalKeluarInput.value = "";
}

function loadData() {
    let dataList = JSON.parse(localStorage.getItem("dataList")) || [];
    let tableBody = document.getElementById("data-list");
    tableBody.innerHTML = "";

    let totalDana = 0; // Variabel untuk total dana

    dataList.forEach((item, index) => {
        let isChecked = localStorage.getItem(`checkbox-${index}`) === 'true';

        // Menambahkan nominalMasuk ke totalDana, dengan memperhitungkan status checkbox
        totalDana += isChecked ? 0 : item.nominalMasuk;

        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.keterangan}</td>
                <td>${new Intl.NumberFormat("id-ID").format(item.nominalMasuk)}</td>
                <td>${new Intl.NumberFormat("id-ID").format(item.nominalKeluar)}</td>
                <td>
                    <input type="checkbox" data-nominal-masuk="${item.nominalMasuk}" onchange="updateTotal(this, ${index})" ${isChecked ? 'checked' : ''}>
                </td>
                <td><button onclick="hapusData(${index})">Hapus</button></td>
            </tr>`;
        tableBody.innerHTML += row;
    });

    // Menyimpan total dana ke localStorage
    localStorage.setItem("totalDana", totalDana);

    // Menampilkan total dana
    document.getElementById("total-dana").textContent = new Intl.NumberFormat("id-ID").format(totalDana);
}

function hapusData(index) {
    let dataList = JSON.parse(localStorage.getItem("dataList")) || [];
    dataList.splice(index, 1);
    localStorage.setItem("dataList", JSON.stringify(dataList));
    loadData();
}

function updateTotal(checkbox, index) {
    let nominalMasuk = parseInt(checkbox.getAttribute("data-nominal-masuk"));
    let totalDana = parseInt(localStorage.getItem("totalDana")) || 0; // Ambil total dana dari localStorage

    // Simpan status centang checkbox ke localStorage
    localStorage.setItem(`checkbox-${index}`, checkbox.checked);

    // Update total dana berdasarkan checkbox
    if (checkbox.checked) {
        // Kurangi total dana sesuai nominalMasuk saat checkbox dicentang
        totalDana -= nominalMasuk;
    } else {
        // Tambahkan lagi total dana saat checkbox dilepas
        totalDana += nominalMasuk;
    }

    // Menyimpan total dana yang diperbarui ke localStorage
    localStorage.setItem("totalDana", totalDana);

    // Update total dana di halaman
    document.getElementById("total-dana").textContent = new Intl.NumberFormat("id-ID").format(totalDana);
}
