import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// 🔹 Leer datos desde db.json
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return { books: [] };
  }
};

// 🔹 Escribir datos en db.json
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error al escribir el archivo:", error);
  }
};

// 🔹 Rutas

// Ruta principal
app.get("/", (req, res) => {
  console.log("Hola, bienvenido a mi página");
  res.send("Bienvenido a la API de libros 📚");
});

// Obtener todos los libros
app.get("/books", (req, res) => {
  const data = readData();
  res.json(data.books);
});

// Obtener un libro por ID
app.get("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const book = data.books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  res.json(book);
});

// Agregar un nuevo libro
app.post("/books", (req, res) => {
  const data = readData();
  const body = req.body;

  const newBook = {
    id: data.books.length + 1,
    ...body,
  };

  data.books.push(newBook);
  writeData(data);

  res.status(201).json(newBook);
});

// Actualizar un libro existente
app.put("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.books.findIndex((book) => book.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  const updatedBook = {
    id,
    ...req.body,
  };

  data.books[index] = updatedBook;
  writeData(data);

  res.json(updatedBook);
});

// Eliminar un libro
app.delete("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.books.findIndex((book) => book.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  data.books.splice(index, 1);
  writeData(data);

  res.json({ message: "Libro borrado exitosamente ✅" });
});

// 🔹 Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
