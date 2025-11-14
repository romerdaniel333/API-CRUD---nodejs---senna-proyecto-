import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

// Inicialización
const app = express();
app.use(bodyParser.json());

// Leer la base de datos
const readData = () => {
    try {
        const data = fs.readFileSync("./DB.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return { Registro_de_vehiculos: [] };
    }
};

// Escribir la base de datos
const writeData = (data) => {
    try {
        fs.writeFileSync("./DB.json", JSON.stringify(data, null, 2));
    } catch (error) {
        console.log(error);
    }
};

// Rutas
app.get("/", (req, res) => {
    res.send("Bienvenido a mi primera API con Node.js");
});

app.get("/Registro_de_vehiculos", (req, res) => {
    const data = readData();
    res.json(data.Registro_de_vehiculos);
});

app.get("/Registro_de_vehiculos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const vehiculo = data.Registro_de_vehiculos.find((v) => v.id === id);
    res.json(vehiculo);
});

app.post("/Registro_de_vehiculos", (req, res) => {
    const data = readData();
    const body = req.body;
    const newVehiculo = {
        id: data.Registro_de_vehiculos.length + 1,
        ...body,
    };

    data.Registro_de_vehiculos.push(newVehiculo);
    writeData(data);

    res.json(newVehiculo);
});

// PUT corregido
app.put("/Registro_de_vehiculos/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);

    const vehiculoIndex = data.Registro_de_vehiculos.findIndex((v) => v.id === id);

    if (vehiculoIndex === -1) {
        return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    data.Registro_de_vehiculos[vehiculoIndex] = {
        ...data.Registro_de_vehiculos[vehiculoIndex],
        ...body,
    };

    writeData(data);
    res.json({ message: "El registro del vehículo se actualizó correctamente" });
});



app.delete("/Registro_de_vehiculos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);

    const vehiculoIndex = data.Registro_de_vehiculos.findIndex(
        (v) => v.id === id
    );

    if (vehiculoIndex === -1) {
        return res.status(404).json({
            message: "Vehículo no encontrado",
        });
    }

    // Eliminar el vehículo
    data.Registro_de_vehiculos.splice(vehiculoIndex, 1);

    writeData(data);

    res.json({
        message: "Vehículo eliminado correctamente"
    });
});

// RUN SERVER
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
