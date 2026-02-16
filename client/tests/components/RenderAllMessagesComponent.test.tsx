import { render, screen } from "@testing-library/react";
import RenderAllMessagesComponent from "../../src/components/RenderAllMessagesComponent";
import { db } from "../db";
import type { Message } from "../../src/types/types";

describe("RenderAllMessagesComponent", () => {
  const messages: Message[] = [];

  beforeAll(() => {
    [1, 2, 3, 4, 5].forEach(() => {
      const message: Message = db.message.create();
      messages.push(message);
    });
  });

  afterAll(() => {
    db.message.deleteMany({ where: { _id: { equals: messages._id } } });
  });

  it("should show all messages", () => {
    render(<RenderAllMessagesComponent messages={messages} myUserId={"123"} />);

    messages.forEach((msg) => {
      expect(screen.getByText(msg.text)).toBeInTheDocument();
    });
  });
  it("should not render any messages", () => {
    render(<RenderAllMessagesComponent messages={messages} myUserId={null} />);

    expect(screen.queryByText(messages[0].text)).not.toBeInTheDocument();
  });
});
