import { createClient, RedisClientType } from "redis";


const redisClient: RedisClientType = createClient({
  socket: {
    host: "redis-server",
    port: 6379,
  },
  password: "Password",
});

redisClient.on("error", (err: Error) => {
  console.log("Redis CLient Error", err.message);
});

redisClient.on("connect", () => {
  console.log("Redis Client Conected");
});

redisClient.connect().catch(console.error);

export default redisClient;
