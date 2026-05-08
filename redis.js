const redis = require('redis')

const client =  redis.createClient({
    url: "redis://localhost:6379",
})

client.on("error", (error)=>console.log('Redis error: ${error}'))

async function main() {
    await client.connect()
    await client.set("name","Ramki",{EX : 10})
    console.log('Data Available: ${await client.get("name")}')
}

main()

setInterval(async () =>{
    console.log(await client.get('name'))
},3000)

module.exports = client