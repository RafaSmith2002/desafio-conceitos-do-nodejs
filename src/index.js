const express = require('express');
const cors = require('cors');

//const { v4: uuidv4 } = require('uuid'); 
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

//const users = [];
const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find( user => user.username === username);

  if(!user) {
    return response.status(404).json({error: "User not found!!!"})
  }
  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExist = users.some(
    (user) => user.username === username  
    );

  if(userAlreadyExist){
    return response.status(400).json({ error: "Username already exist!"});
  }  

   const user = {
      id: uuidv4(), //tem que ser um uuid
      name,  //'Rafael Dude',
      username,  //'dude',
      todos: []
    }
    
    users.push(user);
    return response.json(user);
    //return response.json({ confirm: "cadastro concluido!"});
    //return response.json(user.todos);
    //sequiser monstar so uma info do usuario json.(user.id) por ex).    
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.json(user.todos);  
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  
  user.todos.push(todo);
  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) {
    return response.status(404).json({error: "Todo does not exist!!"});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
   
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = requst.params;

  const todo = user.todos.find( todo => todo.id === id );

  if(!todo) {
    return response.status(404).json({ error: "Todo does not exist!!!"});
  }

  todo.done = true;
  return response.json(todo);
   
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1){
    return response.status(404).json({ error: "Todo does not exist!" });
  }

  user.todos.splice(todoIndex, 1);
  return response.status(204).send();

});

module.exports = app;