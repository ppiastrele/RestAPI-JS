"use strict"

const http = require("http");
const url = require("url");

const bodyParser = require("./helpers/bodyParser.js");
const routes = require("./routes.js");

//create server
const server = http.createServer((request, response) => {
    //parse request url to object for better use
    const parsedUrl = url.parse(request.url, true);
    
    console.log(`Request method: ${request.method} | Endpoint ${request.url}`);

    let { pathname } = parsedUrl;
    let id = null;

    const splitEndpoint = pathname.split("/").filter(Boolean);

    if(splitEndpoint.length > 1){
        pathname = `/${splitEndpoint[0]}/:id`;
        id = splitEndpoint[1];
    }
    
    //verify if request is valid
    const route = routes.find(routeOBj => (
        routeOBj.endpoint === pathname && routeOBj.method === request.method
    ));
    
    if(route){
        request.query = parsedUrl.query;
        request.params = { id: id, };

        //set .send to simplify responses
        response.send = (statusCode, body) => {
            response.writeHead(statusCode, { "Content-type": "application/JSON" });
            response.end(JSON.stringify(body));
        };

        //parse the body for requests that need it
        if(["POST", "PUT", "PATCH"].includes(request.method)){
            bodyParser(request, response, () => route.handler(request, response));
        }
        else{
            route.handler(request, response);
        }
    }
    else if(pathname === "/"){
        response.writeHead(404, { "Content-type": "text/html" });
        response.end(`<h3>First API : ppiastrele</h3>`);
    }
    else{
        response.writeHead(404, { "Content-type": "application/JSON" });
        response.end(JSON.stringify( { error: `Cannot ${request.method} ${parsedUrl.pathname}` }));
    }
});

//starts the server
server.listen(5000, () => console.log("☢  Server running at http://localhost:5000"));