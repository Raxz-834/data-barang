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
    let total = 0;
    tableBody.innerHTML = "";

    dataList.forEach((item, index) => {
        total += parseInt(item.nominalMasuk) - parseInt(item.nominalKeluar);
        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.keterangan}</td>
                <td>${new Intl.NumberFormat("id-ID").format(item.nominalMasuk)}</td>
                <td>${new Intl.NumberFormat("id-ID").format(item.nominalKeluar)}</td>
                <td><input type="checkbox"></td>
                <td><button onclick="hapusData(${index})">Hapus</button></td>
            </tr>`;
        tableBody.innerHTML += row;
    });

    document.getElementById("total-dana").textContent = new Intl.NumberFormat("id-ID").format(total);
}

function hapusData(index) {
    let dataList = JSON.parse(localStorage.getItem("dataList")) || [];
    dataList.splice(index, 1);
    localStorage.setItem("dataList", JSON.stringify(dataList));
    loadData();
}
