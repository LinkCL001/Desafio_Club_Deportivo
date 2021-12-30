const http = require("http"); // crear servidor
const url = require("url"); // importar modulo url
const fs = require("fs"); //importar modulo fs

http
  .createServer((req, res) => {
    //almacenar en variables las query string

    if (req.url == "/") {
      res.setHeader("Content-Type", "text/html");
      fs.readFile("index.html", "utf8", (err, data) => {
        res.end(data);
      });
    }

    if (req.url.startsWith("/agregar")) {
      const { nombre, precio } = url.parse(req.url, true).query; //Crear una ruta para recepción de parámetros
      let deporte = { nombre, precio };
      let data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
      let deportes = data.deportes;
      deportes.push(deporte); //agregar el arreglo a deporte
      fs.writeFileSync("Deportes.json", JSON.stringify(data)); // Sobrescribir data .json
      res.end("Guardado con éxito"); //Responder la consulta con el método end()
    }

    if (req.url.includes("/deportes")) {
      let data = fs.readFileSync("Deportes.json", "utf8");
      res.write(data);
      res.end();
    }

    if (req.url.startsWith("/editar")) {
      const { nombre, precio } = url.parse(req.url, true).query;
      // let deporte = {nombre, precio};
      let data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
      let deportes = data.deportes;
      let deportesEditados = deportes.map((deporte) => {
        if (deporte.nombre == nombre) {
          return {
            nombre,
            precio,
          };
        } else {
          return deporte;
        }
      });
      data.deportes = deportesEditados;
      fs.writeFileSync("Deportes.json", JSON.stringify(data));
      res.end("Datos Editados con Éxito");
    }

    if (req.url.startsWith("/eliminar")) {
      const { nombre } = url.parse(req.url, true).query;
      fs.readFile("Deportes.json", "utf8", (err, data) => {
        let deportes = JSON.parse(data).deportes;
        deportes = deportes.filter((d) => d.nombre !== nombre);
        fs.writeFile("Deportes.json", JSON.stringify({ deportes }), (err, data) => {
          err ? console.log("error") : console.log(" OK ");
          res.end("Deporte elimado con exito");
        });
      });
    }
  })
  .listen(3000, () => console.log("Servidor 3000 ok")); //escuchando al puerto 3000

// 1. Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un
// archivo JSON.
// 2. Crear una ruta que al consultarse devuelva en formato JSON todos los deportes
// registrados.
// 3. Crear una ruta que edite el precio de un deporte registrado utilizando los parámetros
// de la consulta y persista este cambio.
// 4. Crear una ruta que elimine un deporte solicitado desde el cliente y persista este
// cambio.
