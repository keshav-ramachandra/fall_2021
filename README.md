# MERN Shopping List App Demo


### Overview :

MERN stack was used for building the App. I created the client app using React JS and the server using Express JS framework.  
I then containerized both the server and react app separately. For the database, I used the mongo image and containerized it. Finally, I connected all the three containers using Docker compose. A bridge connection was used.

**Ports used:**

* React App: 3000
* Express Server: 5000
* Mongo Database: 27017


### Working of the App: 

* When you add an Item, react client will send the request to port 5000 where the server is running. The server will then interact with Mongo database to insert the Item(Document) in the shopping collection. 
* When you click on getAllItems, All the shopping items will be returned 
* Each individual Item inserted can be edited or deleted as well.

#### How to Run
---
* Run `sudo make build` from the project root to build all the three containers
* Run `sudo make run` from the project root to run all the containers with docker-compose
---

**NOTE:** This is a development configuration where the react client app, Express server, and Mongo database are all served in separate containers. 
