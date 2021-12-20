# Phase 2 Centralized Pub Sub Demo

![alt text](https://github.com/keshav-ramachandra/cse586/blob/master/Phase%202%20Diagram.png?raw=true)

My Architecture for the Centralized pub sub is exactly like in the above figure.

* I have utilized a total of 8 containers. 3 for publishers (API fetchers), one for Database, one for Api server(Express JS server), one for socket server(Socket io), and 2 for servers that serve the content to users(React App).  Socket server takes care of all the socket related operations. The Api server interacts with the database to manage things such as authentication, topics that have been advertised by the publishers and saving events as well as subscriptions of users. The publishers publish betting odds of bookmakers from three different regions. I have used the region as topics to filter in the Central Socket server. The three different topics are EU bookmakers, US bookmakers and UK bookmakers.    

* The pub system is capable of performing 6 operations
  *  Subscribe, Unsubscribe, Advertise, Deadvertise, Publish and Notify.

* The publishers advertise their topics to the central socket server. Then these topics are added to the database through the API server.
* The subscribers can subscribe to the topics that were advertised by the publishers using the Multiselect dropdown.
* Whenever events are published, the socket server will send the events to the subscribers based on the subscriptions. THe operation corresponds to the notify operation.
* The user can also remove their subscription which essential does the unsubscribe operation.
---

Run `sudo docker-compose build` from root of the project to build all the images
Run `sudo docker-compose up` from root to start all the containers using docker-compose

---


