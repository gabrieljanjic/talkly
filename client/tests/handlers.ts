import { db } from "./db";

export const handlers = [...db.message.toHandlers("rest")];
