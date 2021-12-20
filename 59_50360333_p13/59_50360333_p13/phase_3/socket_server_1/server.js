const server = require("socket.io")(7001,{
  cors: {
    origin: '*',
  }
});

const axios = require('axios');

//const io-client = require("socket.io-client");

//const node4_socket = io-client.connect("ws://socket-server:7004");
//const node2_socket = io-client.connect("ws://socket-server:7002");


var myTopics = ["eu","us"];
var mySubscribers = [];

var nodeTopicsMap = new Map();
//nodeTopicsMap.set(node2_socket, "us");
//nodeTopicsMap.set(node4_socket, "au");


server.disconnectSockets();

server.on('disconnect', () => {
   server.removeAllListeners();
});





server.on("connection", socket => {
  
  let serving = 0;  

  console.log("someone connected to node 1");
  
  socket.on("publish",(publisher,topic,data) => {
    
    console.log("this is node 1");

    console.log("received ", data ," by " , publisher, " of ", topic);

    
    if(serving == 0){

      serving = 1;
      
      let r_topic = topic;
      let r_publisher = publisher;
      let r_data = data;

      
      socket.broadcast.emit(r_topic,r_data);

      //for (const [key, value] of nodeTopicsMap.entries()) {
          socket.local.emit("publish", r_publisher, r_topic , r_data);
          console.log("forwarded publish requests");
      //}

      serving = 0;
      

    }
       
  });



  let sub_serving = 0;



  socket.on("subscribe",(topic, publisher,data) => {
   
    
    if(sub_serving == 0){

      sub_serving = 1;

      let r_topic = topic;
      let r_publisher = publisher;
      let r_data = data;

      if(myTopics.includes(r_topic)){
          console.log("subscriber ", r_data.name, " has been added to node 4 for topic ", r_topic);
          axios.post('http://api-server:5000/subscriptions/insert/', {
            subscriber: r_data.name,
            publisher: r_publisher,
            topic: r_topic
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

      }

      else{

        console.log("subscription request was reached at node 1");

        //for (const [key, value] of nodeTopicsMap.entries()) {
            socket.broadcast.emit("subscribe", r_topic , r_publisher, r_data);
            console.log("forwarded sub requests");
        //}

      }

      sub_serving = 0;

    }


  });



   let unsub_serving = 0;



  socket.on("unsubscribe",(topic, publisher,data) => {
   
    
    if(unsub_serving == 0){

      unsub_serving = 1;

      let r_topic = topic;
      let r_publisher = publisher;
      let r_data = data;

      if(myTopics.includes(r_topic)){
          console.log("subscriber ", r_data.name, " has been removed from node1 for topic ", r_topic);
          axios.post('http://api-server:5000/subscriptions/remove/', {
            subscriber: r_data.name,
            publisher: r_publisher,
            topic: r_topic
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

      }

      else{

        console.log("unsubscription request was reached at node 1");

        //for (const [key, value] of nodeTopicsMap.entries()) {
            socket.broadcast.emit("unsubscribe", r_topic , r_publisher, r_data);
            console.log("forwarded unsub requests");
        //}

      }

      unsub_serving = 0;

    }


  });


});

