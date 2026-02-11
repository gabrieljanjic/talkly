export type User = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
};

export type ChatPartner = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  lastOnline: string;
};

export type Participants = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
};

export type Room = {
  _id: string;
  participants: Participants[];
  lastMessage: string;
  createdAt: string;
};

export type Message = {
  _id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: string;
};
