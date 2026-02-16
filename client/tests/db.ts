import { factory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

export const db = factory({
  message: {
    _id: primaryKey(() => faker.database.mongodbObjectId()),
    roomId: () => faker.date.recent().toISOString(),
    senderId: () => faker.database.mongodbObjectId(),
    text: () => faker.lorem.sentence(),
    createdAt: () => faker.date.recent().toISOString(),
  },
});
