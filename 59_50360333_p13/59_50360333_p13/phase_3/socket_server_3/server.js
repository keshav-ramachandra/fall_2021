const server = require("socket.io")(7003,{
  cors: {
    origin: '*',
  }
});

const axios = require('axios');

const io_client = require("socket.io-client");

server.disconnectSockets();

server.on('disconnect', () => {
   server.removeAllListeners();
});

const node4_socket = io_client.connect("ws://socket-server-4:7004");
const node2_socket = io_client.connect("ws://socket-server-2:7002");


var myTopics = ["uk"];
var mySubscribers = [];

var nodeTopicsMap = new Map();
nodeTopicsMap.set(node2_socket, "us");
nodeTopicsMap.set(node4_socket, "au");





let sub_serving1 = 0;

node2_socket.on("subscribe",(topic,publisher,data) => {
  
  if(sub_serving1 == 0){

    sub_serving1 = 1;

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

      console.log("subscription request was reached at node 3");

      for (const [key, value] of nodeTopicsMap.entries()) {
          if(key.id != node2_socket.id){
            key.emit("subscribe", r_topic , r_publisher, r_data);
            console.log("forwarded sub requests from node 3");
          }
      }

    }

    sub_serving1 = 0;

  }


});




// node_2 unsubscribe listener

let unsub_serving1=0;
node2_socket.on("unsubscribe",(topic,publisher,data) => {
  
  if(unsub_serving1 == 0){

    unsub_serving1 = 1;

    let r_topic = topic;
    let r_publisher = publisher;
    let r_data = data;

    if(myTopics.includes(r_topic)){
          console.log("subscriber ", r_data.name, " has been removed to from node 4 for topic ", r_topic);
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

      console.log("unsubscription request was reached at node 3");

      for (const [key, value] of nodeTopicsMap.entries()) {
          if(key.id != node2_socket.id){
            key.emit("unsubscribe", r_topic , r_publisher, r_data);
            console.log("forwarded unsub requests from node 3");
          }
      }

    }

    unsub_serving1 = 0;

  }


});


// node 4 unsubscribe listener


let unsub_serving4 = 0;
node4_socket.on("unsubscribe",(topic,publisher,data) => {
  
  if(unsub_serving4 == 0){

    unsub_serving4 = 1;

    let r_topic = topic;
    let r_publisher = publisher;
    let r_data = data;

    if(myTopics.includes(r_topic)){
          console.log("subscriber ", r_data.name, " has been removed to from node 4 for topic ", r_topic);
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

      console.log("unsubscription request was reached at node 3");

      for (const [key, value] of nodeTopicsMap.entries()) {
          if(key.id != node4_socket.id){
            key.emit("unsubscribe", r_topic , r_publisher, r_data);
            console.log("forwarded unsub requests from node 3");
          }
      }

    }

    unsub_serving4 = 0;

  }


});




let sub_serving4 = 0;

node4_socket.on("subscribe",(topic,publisher,data) => {
  
  if(sub_serving4 == 0){

    sub_serving4 = 1;

    let r_topic = topic;
    let r_publisher = publisher;
    let r_data = data;

    if(myTopics.includes(r_topic)){      
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

      console.log("subscription request was reached at node 3");

      for (const [key, value] of nodeTopicsMap.entries()) {
          if(key.id != node4_socket.id){
            key.emit("subscribe", r_topic , r_publisher, r_data);
            console.log("forwarded sub requests from node 3");
          }
      }

    }

    sub_serving4 = 0;

  }


});





// do after server 3 is on 


server.on("connection", socket => {
  
  console.log("someone connected to node3");

  let serving = 0; 
  
  socket.on("publish",(publisher,topic,data) => {
    
    console.log("this is node 3");

    console.log("received ", data ," by " , publisher, " of ", topic);

    
    if(serving == 0){

      serving = 1;
      
      let r_topic = topic;
      let r_publisher = publisher;
      let r_data = data;

      
      socket.emit(r_topic,r_data);

      for (const [key, value] of nodeTopicsMap.entries()) {
          key.emit("publish", r_publisher, r_topic , r_data);
          console.log("forwarded publish requests");
      }

      serving = 0;
      

    }
       
  });


 
  socket.on("advertise",(publisher,topic) => {
    console.log(topic, "advertiser HAS REACHED");
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

      server.socket.off(publisher)

   });


});

