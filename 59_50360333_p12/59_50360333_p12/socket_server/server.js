const io = require("socket.io")(7000,{
  cors: {
    origin: '*',
  }
});

const axios = require('axios');



io.disconnectSockets();

io.on('disconnect', () => {
   io.removeAllListeners();
});


 function notify(topic, data){
       console.log("received at server", data)
       io.sockets.emit(topic, data);
        axios.post('http://api-server:5000/events/insert', data)
             .then(function (response) {
               console.log(response);
             })
             .catch(function (error) {
               console.log(error);
             });


 }


io.on("connection", socket => {
  // either with send()
  console.log("connected", socket.id);

  // or with emit() and custom event names
  //socket.emit("greetings", "Hey!", { "ms": "jane" }, Buffer.from([4, 3, 3, 1]));


  /*
  console.log("client id is", socket.id);
  // handle the event sent with socket.send()
  socket.on("message", (data) => {
    console.log(data);
  });

  // handle the event sent with socket.emit()
  socket.on("subscribe", (elem1, elem2) => {
    console.log(elem2.name, " is subscribed to ", elem1);
  });

  */

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




  socket.on("pub1", (topic, data) => {
    // should send to database
    data.topic = topic;
    data.publisher = "pub1"
    notify(topic , data);
    console.log("pub1 data is", data)
    // console.log('sendChat', data);
      //io.sockets.emit(elem1, elem2, elem3);
  });


  socket.on("pub2", (topic, data) => {



       data.topic = topic;
       data.publisher = "pub2"

       console.log("pub2 data is", data)
    // should send to database
       notify(topic, data)
    // console.log('sendChat', data);
      //io.sockets.emit(elem1, elem2, elem3);
  });


  socket.on("pub3", (topic, data) => {

       data.topic = topic;
       data.publisher = "pub3"
    // should send to database
       notify(topic, data)
       console.log("pub2 data is", data)
    // console.log('sendChat', data);
      //io.sockets.emit(elem1, elem2, elem3);
  });

  socket.on("subscribe", (topic, publisher, obj) => {
    //should send to database
     axios.post('http://api-server:5000/subscriptions/insert/', {
            subscriber: obj.name,
            publisher: publisher,
            topic: topic
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    console.log(obj.name, " has subscribed to ", topic , " of ", publisher);
  })

  socket.on("unsubscribe", (topic, publisher, obj) => {
      //should send to database
       axios.post('http://api-server:5000/subscriptions/remove/', {
              subscriber: obj.name,
              publisher: publisher,
              topic: topic
            })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
      console.log(obj.name, " has unsubscribed from ", topic , " of ", publisher);
  })

});

