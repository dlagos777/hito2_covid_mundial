let totalPaises = "";

// Consultando Datos Api Paises Total
let datosApi = (() => {
    const urlBase = "http://localhost:3000/api/total";
    try {
        const getData = async () => {
            const response = await fetch(urlBase);
            const data = await response.json();
            totalPaises = JSON.parse(JSON.stringify(data))
            return data;
        };
        return {getData};
    } catch (error) {
        console.log(error);
    }   
})();

// Asignando Datos al Grafico CanvasJS
const graficoTotal = (async () => {

    const data = await datosApi.getData();
    let datos = JSON.parse(JSON.stringify(data));
    totalPaises = data;
    datos.sort((a, b) => b.active - a.active);
    let recorte = datos.slice(0, 10);
    //return datos;

    let fallecidos = [];
    for (let i in recorte) {
        fallecidos.push({label: recorte[i].country, y: recorte[i].deaths})
    }

    let recuperados = [];
    for (let i in recorte) {
        recuperados.push({label: recorte[i].country, y: recorte[i].recovered})
    }

    let confirmados = [];
    for (let i in recorte) {
        confirmados.push({label: recorte[i].country, y: recorte[i].confirmed})
    }

    let activos = [];
    for (let i in recorte) {
        activos.push({label: recorte[i].country, y: recorte[i].active})
    }

// Grafico CanvasJS Situacion Mundial (10 Paises con mas Casos Activos)
    const grafico = () => {
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
                text: "Situacion mundial Covid-19"
            },
            axisY: {
                title: "Casos",
                includeZero: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            toolTip: {
                shared: true,
                content: toolTipFormatter
            },
            data: [
                {
                    type: "bar",
                    showInLegend: true,
                    name: "Fallecidos",
                    color: "#CD6155",
                    dataPoints: fallecidos
                }, {
                    type: "bar",
                    showInLegend: true,
                    name: "Recuperados",
                    color: "#1ABC9C",
                    dataPoints: recuperados
                }, {
                    type: "bar",
                    showInLegend: true,
                    name: "Activos",
                    color: "#F39C12",
                    dataPoints: activos
                }, {
                    type: "bar",
                    showInLegend: true,
                    name: "Confirmados",
                    color: "#3498DB",
                    dataPoints: confirmados
                }
            ]
        });
        chart.render();

        function toolTipFormatter(e) {
            var str = "";
            var total = 0;
            var str3;
            var str2;
            for (var i = 0; i < e.entries.length; i++) {
                var str1 = "<span style= \"color:" + e
                    .entries[i]
                    .dataSeries
                    .color + "\">" + e
                    .entries[i]
                    .dataSeries
                    .name + "</span>: <strong>" + e
                    .entries[i]
                    .dataPoint
                    .y + "</strong> <br/>";
                total = e
                    .entries[i]
                    .dataPoint
                    .y + total;
                str = str.concat(str1);
            }
            str2 = "<strong>" + e
                .entries[0]
                .dataPoint
                .label + "</strong> <br/>";
            str3 = "<span style = \"color:Tomato\">Total: </span><strong>" + total + "</str" +
                    "ong><br/>";
            return (str2.concat(str)).concat(str3);
        }

        function toggleDataSeries(e) {
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            chart.render();
        }
    }
    mostrarTabla();
    grafico();
})();

// Tabla con todos los paises Situacion Mundial Covid
const mostrarTabla = (async () => {
    const data = await datosApi.getData();
    let datos = JSON.parse(JSON.stringify(data));
    let paises = datos.sort(function (a, b) {
        let x = a
            .country
            .toLowerCase();
        let y = b
            .country
            .toLowerCase();
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    });
    let tablaDatos = document.getElementById("tablaDatos");

    let tablaHead = `<thead>
            <tr>
                <th>Locación</th>
                <th>Confirmados</th>
                <th>Fallecidos</th>
                <th>Recuperados</th>
                <th>Activos</th>
                <th>Detalles</th>
            </tr>
        </thead>`;

    for (let i = 0; i < paises.length; i++) {
        tablaHead += `<tr>
                <td>${paises[i]
            .country}</td>
                <td>${paises[i]
            .confirmed}</td>
                <td>${paises[i]
            .deaths}</td>
                <td>${paises[i]
            .recovered}</td>
                <td>${paises[i]
            .active}</td>
                <td><button onclick="mostrarModal('${paises[i]
            .country}')" id='btnMostrarModal${i}' type="button" class="btn btn-primary btn-sm">Ver Detalle</button></td>
            </tr> 
            `;
    };

    tablaDatos.innerHTML = tablaHead;

})

// Grafico Modal Caso por Pais
const mostrarModal = (pais) => {
    let paisEncontrado = totalPaises.find(country => country.country == pais);
    $('#modalDetalles').modal("show");
    $('#exampleModalLabel').text(pais);
    CanvasJS.addCultureInfo("es",
        {
            decimalSeparator: ",",
            digitGroupSeparator: ".",
        });

    var chart = new CanvasJS.Chart("graficoModal", {
        animationEnabled: true,
        title: {
            text: "Situacion Pais"
        },
        culture: "es",
        data: [
            {
                type: "pie",
                startAngle: 240,
                //yValueFormatString: "#,###.##",
		        indexLabel: "{label} {y}",
                dataPoints: [
                    {
                        label: "Fallecidos",
                        y: paisEncontrado.deaths
                    }, {
                        label: "Recuperados",
                        y: paisEncontrado.recovered
                    }, {
                        label: "Activos",
                        y: paisEncontrado.active
                    }, {
                        label: "Confirmados",
                        y: paisEncontrado.confirmed
                    }
                ]
            }
        ]

    });
    chart.render();
};