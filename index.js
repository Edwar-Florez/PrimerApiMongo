import express from "express";
import fs from "fs";
import bodyParser from "body-parser"

const app = express();
app.use(bodyParser.json());

// app.use(cors)

// leer los datos del archivo db.son
const readData = ()=>{
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
}

readData();


// escribir en el archivo json
const writeData = (data)=>{
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
    } catch (error) {
        console.log(error);
    }
}
app.get("/", (req, res)=>{
    console.log("hola bienvenido a mi pagina");
})

app.get("/books", (req, res)=>{
    const data = readData();
    res.json(data.books)
})

app.get("/books/:id", (req, res)=>{
    const data = readData();

    const id = parseInt(req.params.id);

    const book = data.books.find((book) => book.id === id);

    res.json(book);
})


app.put("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.books.findIndex((book) => book.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: "Libro no encontrado" });
    }
    
    // Reemplaza completamente el libro
    const updatedBook = {
        id,
        ...req.body
    };
    
    data.books[index] = updatedBook;
    writeData(data);
    
    res.json(updatedBook);
});


app.post("/books", (req, res)=>{
    const data = readData();

    const body = req.body;

    const newBook = {
        id: data.books.length   + 1,
        ...body,
    };

    data.books.push(newBook);

    writeData(data);

    res.json(newBook);
})

app.delete("/books/:id", (req, res)=>{
    const data = readData();

    const id = parseInt(req.params.id);

    const bookIndex = data.books.findIndex((book)=>book.id === id);

    data.books.splice(bookIndex, 1);

    writeData(data);

    res.json({message: "Libro borrado papi"});
});

app.listen(3000, ()=>{
    // funcion call back que imprime el mensaje
    console.log("servidor corriendo en el puerto 3000")
}) 

