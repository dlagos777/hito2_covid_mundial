// Acceso al login y solicitud de token
const login = (email, password) => {
    return new Promise((resolve, reject) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({email: email, password: password});

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

        fetch("http://localhost:3000/api/login", requestOptions)
            .then(
                (response) => response.text()
            )
            .then(result => {
                localStorage.setItem("Token", result);
                resolve(result);
            })
            .catch((error) => {
                reject({error, message: "Error al consultar API/LOGIN"})
            })
    })
};

let token = localStorage.getItem("Token");

// Formatea la fecha para regresarla separada por guiones
const formatearFecha = (fecha) => {
    let fechaOriginal = fecha.toString();
    let fechaFormateada = [
        fechaOriginal.slice(0, 4),
        "-",
        fechaOriginal.slice(4, 6),
        "-",
        fechaOriginal.slice(6, 8)
    ]
        .join("");
        return fechaFormateada;
};

// Ingresando y solicitando informacion de usa
const getData = (token) => {
    return new Promise((resolve, reject) => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
            method: "GET",
            headers: myHeaders
        };

        fetch("http://localhost:3000/api/country/usa", requestOptions)
            .then(
                (response) => response.json()
            )
            .then((result) => {
                let datos = result.map((registro) => {
                    registro.date = formatearFecha(registro.date);
                    return registro;
                });
                resolve(datos);
            })
            .catch((error) => {
                reject({error, message: "Error al consultar API/USA"})
            })
        })
};

export { login, getData, token };