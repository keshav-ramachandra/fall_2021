
const {Kafka} = require("kafkajs")

run();
async function run(){
    try
    {
         const kafka = new Kafka({
              clientId: "myapp",
              brokers :["kafka0:9092","kafka1:9093","kafka2:9094","kafka3:9095"]
         })

        const admin = kafka.admin();
        console.log("Connecting.....")
        await admin.connect()
        console.log("Connected!")
        //A-M, N-Z
        await admin.createTopics({
            "topics": [{
                "topic" : "us",
                "numPartitions": 2,
                "replicationFactor":2 
                //"replicaAssignment":[{ partition: 0, replicas: [0,1] },{partition: 1, replicas: [1,2]}]
            },
            {
                "topic" : "uk",
                "numPartitions": 2,
                "replicationFactor":2 
                //"replicaAssignment":[{ partition: 0, replicas: [1,2] },{partition: 1, replicas: [2,3]}]
            },
            {
                "topic" : "au",
                "numPartitions": 1,
                "replicationFactor":1 

                //"replicaAssignment":[{ partition: 0, replicas: [2] }]
            },
            {
                "topic" : "eu",
                "numPartitions": 1,
                "replicationFactor":1 
                //"replicaAssignment":[{ partition: 0, replicas: [3] }]
            }]
        })
        console.log("Created Successfully!")
        await admin.disconnect();
    }
    catch(ex)
    {
        console.error(`Something bad happened ${ex}`)
    }
    finally{
        process.exit(0);
    }


}