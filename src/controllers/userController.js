const users = require("../mocks/users.js");

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
        
        if(body.name){
            const lastUser = users[users.length-1].id;
            const newUser = {
                id: lastUser + 1,
                name: body.name,
            };

            users.push(newUser);
            
            response.send(200, newUser);
        }
        else{
            response.send(400, { error: "Bad request: no name property identified" });
        }
    },

    updateUser(request, response){
        const { id } = request.params;
        const { body } = request;
        
        const user = users.find( user => user.id === Number(id) );

        if(user){
            user.name = body.name;
            response.send(200, user);
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