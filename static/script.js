let chart;

async function loadData() {

    const response = await fetch('/analyze');

    const data = await response.json();

    document.getElementById('energy').innerHTML =
        data.total_energy + ' kWh';

    document.getElementById('cost').innerHTML =
        '₹ ' + data.total_cost;

    document.getElementById('carbon').innerHTML =
        data.total_carbon + ' kg';

    document.getElementById('alerts').innerHTML =
        data.alert;

    let html = '';

    data.details.forEach(d => {

        let color = '#00ff99';

        if(d.energy > 4){
            color = '#ff4d4d';
        }

        html += `
            <div class="device-card"
                 style="border-left-color:${color}">

                <h3>${d.device}</h3>

                <p><b>Department:</b> ${d.department}</p>

                <p><b>Status:</b> ${d.status}</p>

                <p><b>Energy Wastage:</b> ${d.energy} kWh</p>

            </div>
        `;
    });

    document.getElementById('devices').innerHTML = html;

    const labels = data.details.map(d => d.device);

    const values = data.details.map(d => d.energy);

    if(chart){
        chart.destroy();
    }

    chart = new Chart(document.getElementById('chart'), {

        type: 'bar',

        data: {

            labels: labels,

            datasets: [{

                label: 'Energy Wastage (kWh)',

                data: values,

                backgroundColor: [
                    '#00ff99',
                    '#4da6ff',
                    '#ffcc00',
                    '#ff884d',
                    '#ff4d4d'
                ],

                borderRadius: 10
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },

            scales: {

                x: {
                    ticks: {
                        color: 'white'
                    }
                },

                y: {
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

loadData();

setInterval(loadData, 3000);