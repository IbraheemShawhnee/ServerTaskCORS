import express from "express";
import { json } from "express";
import cors from "cors";
import { todos } from "./dummyTodos.js";

const app = express();
const port = 6000;

app.use(json());
app.use(cors()); // Enable CORS

app.get("/", (req, res) => {
	res.send("Hello, world!");
});

const IDExists = (req, res, next) => {
	const id = JSON.parse(req.params.id);
	const todo = todos.find((todo) => todo.id == id);
	if (!todo) {
		res.status(404).send("You don't have this todo..");
	} else {
		next();
	}
};

app.get("/todos", (req, res) => {
	res.status(200).send(todos);
});

app.get("/todos/:id", IDExists, (req, res) => {
	const id = JSON.parse(req.params.id);
	const todo = todos.find((todo) => todo.id == id);
	res.status(200).send(todo);
});

app.delete("/todos/:id", IDExists, (req, res) => {
	const id = JSON.parse(req.params.id);
	const updatedTodos = todoDeleteHandler(id);
	let response = `Todo with id: ${id} has been deleted.`;
	res.status(200).send(response);
});

const validateTask = (req, res, next) => {
	const { title, description } = req.body;
	if (!title || !description) {
		return res.status(400).send("Title and description are required");
	} else {
		next();
	}
};

app.use(validateTask);

app.post("/todos", (req, res) => {
	const { title, description } = req.body;
	const id = todos.length + 1;
	const newTodo = { id, title, description, completionStatus: false };
	todos.push(newTodo);
	res.send(`Created a new todo with ID of ${id}`);
});

app.put("/todos/:id", IDExists, (req, res) => {
	const id = JSON.parse(req.params.id);
	const { title, description, completionStatus } = req.body;
	const todo = todos.find((todo) => todo.id === id);
	todo.title = title || todo.title;
	todo.completionStatus = completionStatus || todo.completionStatus;
	todo.description = description || todo.description;
	res.send(`Todo with ID ${id} was updated`);
});

const todoDeleteHandler = (id) => {
	const updatedTodos = todos.filter((todo) => todo.id != id);
	return updatedTodos;
};

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
