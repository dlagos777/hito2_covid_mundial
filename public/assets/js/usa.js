import {login, getData, token} from "./usaRequests.js";

// Formulario de Inicio de Sesion
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    let email = document
        .getElementById("email")
        .value;
    let password = document
        .getElementById("password")
        .value;

    login(email, password).then((token) => {
        getData(token).then((data) => {
        })
    });

    habilitaBtn();
    grafico();
});

// Habillita el grafico y cerrar sesion, oculta el home y el formulario
const habilitaBtn = () => {
    if (token) {
        $("#formContainer").hide();
        $("#cerrarSesion").show();
        $("#chartContainer").show();
        $("#home").hide();
    } else {
        alert("Nombre de usuario o contraseña inválidos, por favor intente nuevamente");
    }
};

// Grafico Situacion USA 
const grafico = async () => {
    const data = await getData(token);

    let positive = [];
    let negative = [];
    let deaths = [];

    data.forEach(e => {
        positive.push({x:new Date(e.date), y:e.positive});
        negative.push({x:new Date(e.date), y:e.negative});
        deaths.push({x:new Date(e.date), y:e.deaths});
    })

    let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Covid-19 estadísticas USA"
        },
        
        legend: {
		cursor:"pointer",
		itemclick : toggleDataSeries
	    },
        data: [
            {
                type: "line",
                name: "Confirmados",
                showInLegend: true,
                dataPoints: positive
            }, {
                type: "line",
                name: "Negativo",
                showInLegend: true,
                dataPoints: negative
            }, {
                type: "line",
                name: "Fallecidos",
                showInLegend: true,
                dataPoints: deaths
            },
        ]
    });
    chart.render();


    function toggleDataSeries(e) {
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
		e.dataSeries.visible = false;
	} else {
		e.dataSeries.visible = true;
	}
	chart.render();
}
}

// Funcion para limpiar LocalStorage al Cerrar la Sesion, oculta cerrar sesion y habilita formulario y home
$("#cerrarSesion").on("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    window
        .location
        .reload();
    $("#cerrarSesion").hide();
    $("#formContainer").show();
    $("#home").show();

    document
        .getElementById("email")
        .value = "";
    document
        .getElementById("password")
        .value = "";
})