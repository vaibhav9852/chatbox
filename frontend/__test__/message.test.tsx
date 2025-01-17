import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store"; 
import Message from "../src/components/chat/Message";
import socket from "../src/config/socket"; // Mock the socket

jest.mock("src/config/socket", () => ({
  on: jest.fn(),  
  emit: jest.fn(),
  off: jest.fn(),    
}));
 
const mockStore = configureStore([]);

describe("Message Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        loginUser: { id: 1, name: "Test User" },
      },
    });
  });

  it("should render without crashing", () => { 
    render(
      <Provider store={store}>
        <Message item={{ id: 1, adminId: null }} />
      </Provider>
    );

    expect(screen.getByText(/No messages available/i)).toBeInTheDocument();
  });

  it("should display group messages when adminId is present", () => {
    render(
      <Provider store={store}>
        <Message item={{ id: 2, adminId: 1 }} />
      </Provider>
    );

    expect(screen.queryByText(/group/i)).toBeInTheDocument();
  });

  it("should emit socket events on mount", () => {
    render(
      <Provider store={store}>
        <Message item={{ id: 3, adminId: 1 }} />
      </Provider>
    );

    expect(socket.emit).toHaveBeenCalledWith("joinRoom", 3);
  });
});
