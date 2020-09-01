function bodyParser(request, response, callback){
    let body = "";
        
    //first receive all the date
    request.on("data", (chunk) => {
        body += chunk;
    });
    
    //then set the body and call the handler
    request.on("end", () => {
        //catch any parse error
        try{
            body = JSON.parse(body);
            request.body = body;
            
            callback();
        }
        catch(err){
            response.send(400, { error: "Bad request"});
            console.log("Error:", err.message);
        }
    });
}

module.exports = bodyParser;