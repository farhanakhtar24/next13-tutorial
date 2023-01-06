import React from "react";
import { Todo } from "../../../typing";
import { notFound } from "next/navigation";

export const dynamicParams = true;

type PageProps = {
	params: {
		todoId: string;
	};
};

const fetchTodo = async (todoId: string) => {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/todos/${todoId}`,
		{
			next: {
				revalidate: 60,
			},
		}
	);
	const todo: Todo = await response.json();
	return todo;
};

const TodoPage = async ({ params: { todoId } }: PageProps) => {
	const todo = await fetchTodo(todoId);

	if (!todo.id) {
		return notFound();
	}

	return (
		<div className="p-10 bg-yellow-200 border-2 m-2 shadow-lg">
			<p>
				#{todo.id} : {todo.title}
			</p>
			<p>Completed: {todo.completed ? "Yes" : "No"}</p>
			<p className="border-t border-black mt-5 text-right">
				By User : {todo.userId}
			</p>
		</div>
	);
};

export default TodoPage;

export const generateStaticParams = async () => {
	const response = await fetch("https://jsonplaceholder.typicode.com/todos");
	let todos: Todo[] = await response.json();

	const trimmedTodos = todos.splice(0, 20);

	return trimmedTodos.map((todo) => {
		return {
			todoId: todo.id.toString(),
		};
	});
};
