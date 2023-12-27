import { ApiHandler } from "sst/node/api";
import jwt from "jsonwebtoken";
import { createConnection } from "@standard-api/core/mongo";
import { users, type User } from "@standard-api/core/models/users"
import { Config } from "sst/node/config";


export const handler = ApiHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  await createConnection()

  let data = {
    phone: "",
    code: "",
  }

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  if (data.code !== "0000") {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Wrong code" }),
    }
  }

  const user = await users.findOrCreateByPhone(data.phone)
  const token = jwt.sign({ userId: user.id }, Config.JWT_SECRET, { expiresIn: '30d' });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: user, token: token }),
  };
});
