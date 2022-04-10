import "dotenv/config";
export default {
  service: {
    port: process.env.PORT
  },
  source: {
    url: process.env.SOURCE_API
  },
  defaultFact: {
    "_id": "",
    "user": "",
    "used": false,
    "createdAt": "",
    "deleted": false,
    "source": "user",
    "updatedAt": "",
    "text": "",
    "type": "cat",
    "status": {
      "verified": false,
      "feedback": "",
      "sentCount": 0
    }
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
}