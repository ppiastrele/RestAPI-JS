"use strict"

let users = require("../mocks/users.js");

const userController = {

    listUsers(request, response){
        const { order } = request.query;
        
        if(order){
            //order users by id depending on query request
            const sortedUsers = users.sort( (a,b) => {
                if(order === "desc"){
                    return a.id < b.id ? 1 : -1;
                }
                else{
                    return a.id > b.id ? 1 : -1;
                }
            });

            response.send(200, sortedUsers);
        }
        else{
            response.send(200, users);
        }
    },

    getUserById(request, response){
        const { id } = request.params;
        
        const user = users.find( user => user.id === Number(id) );
        
        if(user){
            response.send(200, user);
        }
        else{
            response.send(400, { error: "User not found" });
        }
    },

    createUser(request, response){
        const { body } = request;
        
        if(body.name && body.phone){
            const ids = users.map( user => user.id );
            const lastId = Math.max(...ids);
            
            const newUser = {
                id: lastId + 1,
                name: body.name,
                phone: body.phone,
            };

            users.push(newUser);
            
            response.send(200, newUser);
        }
        else{
            response.send(400, { error: "Bad request: name and phone required" });
        }
    },

    updateUser(request, response){
        const { id } = request.params;
        const { body } = request;
        
        const user = users.find( user => user.id === Number(id) );

        if(user){
            if(body.name && body.phone){
                user.name = body.name;
                user.phone = body.phone;
                response.send(200, user);
            }
            else{
                response.send(400, { error: "Bad request: missing information" });
            }
        }
        else{
            response.send(400, { error: "User not found" });
        }
    },

    patchUser(request, response){
        const { id } = request.params;
        const { body } = request;
        
        const user = users.find( user => user.id === Number(id) );

        if(user){
            if(Object.keys(body).length > 0){
                for (const key in body) {
                    if(user[key]){
                        user[key] = body[key];
                    }
                }
                
                response.send(200, user);
            }
            else{
                response.send(400, { error: "Bad request: missing information" });
            }
        }
        else{
            response.send(400, { error: "User not found" });
        }
    },

    deleteUser(request, response){
        const { id } = request.params;

        const user = users.find( user => user.id === Number(id) );

        if(user){
            users = users.filter( user => user.id !== Number(id) );
            response.send(200, { deleted: true });
        }
        else{
            response.send(400, { error: "User not found" });
        }
    },
};

module.exports = userController;