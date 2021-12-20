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


const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'sub1',
  brokers: ['kafka0:9092','kafka1:9093','kafka2:9094','kafka3:9095']
})


const us_consumer_1 = kafka.consumer({ groupId: 'us-group' })

const us_1 = async () => {


  await us_consumer_1.connect()
  await us_consumer_1.subscribe({ topic: 'us', fromBeginning: true })

  await us_consumer_1.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("processor --> us_consumer_1 : "," message received from partition ", partition , " is ", {value: message.value.toString()});
      notify(topic,JSON.parse(message.value.toString()))
    },
  })
}

us_1()



const us_consumer_2 = kafka.consumer({ groupId: 'us-group' })

const us_2 = async () => {


  await us_consumer_2.connect()
  await us_consumer_2.subscribe({ topic: 'us', fromBeginning: true })

  await us_consumer_2.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("processor --> us_consumer_2 : "," message received from partition ", partition , " is ", {value: message.value.toString()});
      notify(topic,JSON.parse(message.value.toString()))
    },
  })
}

us_2()



const uk_consumer_1 = kafka.consumer({ groupId: 'uk-group' })

const uk_1 = async () => {


  await uk_consumer_1.connect()
  await uk_consumer_1.subscribe({ topic: 'uk', fromBeginning: true })

  await uk_consumer_1.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("processor --> uk_consumer_1 : "," message received from partition ", partition , " is ", {value: message.value.toString()});
      notify(topic,JSON.parse(message.value.toString()))
    },
  })
}

uk_1()




const uk_consumer_2 = kafka.consumer({ groupId: 'uk-group' })

const uk_2 = async () => {


  await uk_consumer_2.connect()
  await uk_consumer_2.subscribe({ topic: 'uk', fromBeginning: true })

  await uk_consumer_2.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("processor --> uk_consumer_2 : "," message received from partition ", partition , " is ", {value: message.value.toString()});
      notify(topic,JSON.parse(message.value.toString()))
    },
  })
}

uk_2()




const au_consumer = kafka.consumer({ groupId: 'au-group' })

const au = async () => {


  await au_consumer.connect()
  await au_consumer.subscribe({ topic: 'au', fromBeginning: true })

  await au_consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("processor --> au_consumer : "," message received from partition ", partition , " is ", {value: message.value.toString()});
      notify(topic,JSON.parse(message.value.toString()))
    },
  })
}

au()


const eu_consumer = kafka.consumer({ groupId: 'eu-group' })

const eu = async () => {


  await eu_consumer.connect()
  await eu_consumer.subscribe({ topic: 'eu', fromBeginning: true })

  await eu_consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log( "processor --> eu_consumer : "," message received from partition ", partition , " is ", {value: message.value.toString()});
      notify(topic,JSON.parse(message.value.toString()))
    },
  })
}

eu()





 function notify(topic, data){
       try{
          io.sockets.emit(topic, data);
          axios.post('http://api-server:5000/events/insert', data)
             .then(function (response) {
               //console.log(response);
             })
             .catch(function (error) {
               //console.log(error);
             });
       }
       catch(err){

       }
 }


io.on("connection", socket => {
  // either with send()
  

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

 /*
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

   */




  socket.on("subscribe", (topic, publisher, obj) => {
    //should send to database
     axios.post('http://api-server:5000/subscriptions/insert/', {
            subscriber: obj.name,
            publisher: publisher,
            topic: topic
          })
          .then(function (response) {
            //console.log(response);
          })
          .catch(function (error) {
            //console.log(error);
          });
    //console.log(obj.name, " has subscribed to ", topic , " of ", publisher);
  })

  socket.on("unsubscribe", (topic, publisher, obj) => {
      //should send to database
       axios.post('http://api-server:5000/subscriptions/remove/', {
              subscriber: obj.name,
              publisher: publisher,
              topic: topic
            })
            .then(function (response) {
              //console.log(response);
            })
            .catch(function (error) {
              //console.log(error);
            });
     // console.log(obj.name, " has unsubscribed from ", topic , " of ", publisher);
  })

});

