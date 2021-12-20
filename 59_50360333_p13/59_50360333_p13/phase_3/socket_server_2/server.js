const server = require("socket.io")(7002,{
  cors: {
    origin: '*',
  }
});

const axios = require('axios')

const io_client = require("socket.io-client");

//const node4_socket = io-client.connect("ws://socket-server:7004");
const node1_socket = io_client.connect("ws://socket-server-1:7001");


var myTopics = ["us"];
var mySubscribers = [];

var nodeTopicsMap = new Map();
nodeTopicsMap.set(node1_socket, "eu");
//nodeTopicsMap.set(node4_socket, "au");


server.disconnectSockets();

server.on('disconnect', () => {
   server.removeAllListeners();
});



let sub_serving1 = 0;

node1_socket.on("subscribe",(topic,publisher,data) => {
  
  if(sub_serving1 == 0){

    sub_serving1 = 1;

    let r_topic = topic;
    let r_publisher = publisher;
    let r_data = data;

    if(myTopics.includes(r_topic)){
          console.log("subscriber ", r_data.name, " has been added to node 2 for topic ", r_topic);
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

      console.log("subscription request was reached at node 2");

      server.local.emit("subscribe", r_topic , r_publisher, r_data);


    }

    sub_serving1 = 0;

  }


});


let unsub_serving1 = 0;
node1_socket.on("unsubscribe",(topic,publisher,data) => {
  
  if(unsub_serving1 == 0){

    unsub_serving1 = 1;

    let r_topic = topic;
    let r_publisher = publisher;
    let r_data = data;

    if(myTopics.includes(r_topic)){
          console.log("subscriber ", r_data.name, " has been removed from node 2 for topic ", r_topic);
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

      console.log("unsubscription request was reached at node 2");

      server.local.emit("unsubscribe", r_topic , r_publisher, r_data);
      


    }

    unsub_serving1 = 0;

  }


});

// publish listen from node 1

let pub_serving = 0; 
  
  node1_socket.on("publish",(publisher,topic,data) => {
    
    console.log("this is node 2");

    console.log("received ", data ," by " , publisher, " of ", topic);

    
    if(pub_serving == 0){

      pub_serving = 1;
      
      let r_topic = topic;
      let r_publisher = publisher;
      let r_data = data;

      
      server.local.emit(r_topic,r_data);
      
      server.local.emit("publish", r_publisher, r_topic , r_data);
      

      pub_serving = 0;
      

    }
       
  });



















let serving = 0;  

server.on("connection", socket => {
  
  console.log("someone connected to node 2");
  
  socket.on("publish",(publisher,topic,data) => {
    
    console.log("this is node 2");

    console.log("received ", data ," by " , publisher, " of ", topic);

    
    if(serving == 0){

      serving = 1;
      
      let r_topic = topic;
      let r_publisher = publisher;
      let r_data = data;

      
      socket.broadcast.emit(r_topic,r_data);

      for (const [key, value] of nodeTopicsMap.entries()) {
          key.emit("publish", r_publisher, r_topic , r_data);
          console.log("forwarded publish requests");
      }

      server.local.emit("publish", r_publisher, r_topic , r_data);

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

          console.log("subscriber ", r_data.name, " has been added to node 2 for topic ", r_topic);
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

        console.log("subscription request was reached at node 2");

        for (const [key, value] of nodeTopicsMap.entries()) {
            key.emit("subscribe", r_topic , r_publisher, r_data);
            console.log("forwarded sub requests");
        }

      }

      sub_serving = 0;

    }


  });



  let unsub_serving = 0;
  socket.on("unsubscribe",(topic,publisher,data) => {
  
  if(unsub_serving == 0){

    unsub_serving = 1;

    let r_topic = topic;
    let r_publisher = publisher;
    let r_data = data;

    if(myTopics.includes(r_topic)){
          console.log("subscriber ", r_data.name, " has been removed to from node 2 for topic ", r_topic);
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

        for (const [key, value] of nodeTopicsMap.entries()) {
            key.emit("unsubscribe", r_topic , r_publisher, r_data);
            console.log("forwarded unsub requests");
        }

    }

    unsub_serving = 0;

  }


});



    socket.on("advertise",(publisher,topic) => {
    axios.post('http://api-server:5000/topics/insert/', {
        publisher: publisher,
        topic: topic
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

      socket.on("deadvertise",(publisher,topic) => {

      axios.post('http://api-server:5000/topics/remove/', {
          publisher: publisher,
          topic: topic
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

      io.socket.off(publisher)

   });


});

