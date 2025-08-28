let regioes = [], dias = [];
let chart = null; // gráfico global

// cria inputs iniciais
for (let i = 0; i < 5; i++) {
  document.getElementById("inputsRegioes").innerHTML += 
    `<input type="text" id="regiao${i}" placeholder="Região ${i+1}">`;
}
for (let j = 0; j < 5; j++) {
  document.getElementById("inputsDias").innerHTML += 
    `<input type="number" id="dia${j}" placeholder="Dia ${j+1}">`;
}

function criarTabela() {
  regioes = [];
  dias = [];
  for (let i = 0; i < 5; i++) {
    regioes.push(document.getElementById(`regiao${i}`).value || `Região ${i+1}`);
    dias.push(Number(document.getElementById(`dia${i}`).value) || (i+1));
  }

  let html = "<table><tr><th>Região/Dia</th>";
  for (let d of dias) html += `<th>${d}</th>`;
  html += "</tr>";
  for (let i = 0; i < 5; i++) {
    html += `<tr><th>${regioes[i]}</th>`;
    for (let j = 0; j < 5; j++) {
      html += `<td><input type="number" id="p${i}${j}" min="0" max="500" style="width:60px"></td>`;
    }
    html += "</tr>";
  }
  html += "</table>";
  document.getElementById("tabelaPoluicao").innerHTML = html;
  document.getElementById("btnCalcular").style.display = "inline-block";
}

function calcular() {
  let poluicao = [];
  for (let i = 0; i < 5; i++) {
    poluicao[i] = [];
    for (let j = 0; j < 5; j++) {
      let val = Number(document.getElementById(`p${i}${j}`).value);
      if (isNaN(val) || val < 0 || val > 500) {
        alert(`Valor inválido na região ${regioes[i]}, dia ${dias[j]}. Digite entre 0 e 500.`);
        return;
      }
      poluicao[i][j] = val;
    }
  }

  // diagonal principal e secundária
  let somaDP = 0, somaDS = 0;
  for (let i = 0; i < 5; i++) {
    somaDP += poluicao[i][i];
    somaDS += poluicao[i][4-i];
  }
  let mediaDP = somaDP / 5;
  let mediaDS = somaDS / 5;

  // maior índice
  let maior = poluicao[0][0], iMaior=0, jMaior=0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (poluicao[i][j] > maior) {
        maior = poluicao[i][j];
        iMaior = i; jMaior = j;
      }
    }
  }

  // qtd de níveis críticos > 300
  let critico = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (poluicao[i][j] > 300) critico++;
    }
  }

  // médias por região
  let medias = [];
  for (let i = 0; i < 5; i++) {
    let soma = 0;
    for (let j = 0; j < 5; j++) soma += poluicao[i][j];
    medias[i] = soma / 5;
  }
  let menor = medias[0], posMenor = 0;
  for (let i = 1; i < 5; i++) {
    if (medias[i] < menor) {
      menor = medias[i];
      posMenor = i;
    }
  }

  // resultado
  document.getElementById("resultado").innerHTML = `
    <p>Média da Diagonal Principal: <b>${mediaDP.toFixed(2)}</b></p>
    <p>Média da Diagonal Secundária: <b>${mediaDS.toFixed(2)}</b></p>
    <p>Maior índice: <b>${maior}</b> (Região ${regioes[iMaior]}, Dia ${dias[jMaior]})</p>
    <p>Quantidade de níveis críticos (&gt; 300): <b>${critico}</b></p>
    <p>Região com menor média de poluição: <b>${regioes[posMenor]}</b> (${menor.toFixed(2)})</p>
  `;

  // gráfico
  const ctx = document.getElementById("graficoPoluicao");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dias,
      datasets: regioes.map((r, i) => ({
        label: r,
        data: poluicao[i],
        borderWidth: 2,
        fill: false,
        tension: 0.2
      }))
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Níveis de Poluição por Região"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 500
        }
      }
    }
  });
}
