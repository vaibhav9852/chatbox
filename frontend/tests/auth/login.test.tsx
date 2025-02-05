import React from "react";
import {fireEvent, render,screen , waitFor } from "@testing-library/react";
import  axios from "axios"
import '@testing-library/jest-dom';
import Login from "../../src/components/auth/Login" ;
import { useDispatch, useSelector } from "react-redux";
 import { useNavigate } from "react-router-dom";
 import { loginUser } from 'src/services/userService'; 
import { toast } from 'react-toastify';

jest.mock('axios',()=>{
  return {
    default : { 
      get : jest.fn(),
      post : jest.fn() 
    }
  }
})

jest.mock('react-toastify', () => ({
  toast: {
      error: jest.fn(),
      success: jest.fn()
  }
}));

jest.mock('src/services/userService', () => ({
  loginUser: jest.fn(),
}));

const navigateMock = jest.fn()
const dispatchMock = jest.fn()

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => dispatchMock)
}))

jest.mock('react-router-dom', () => ({
  useNavigate : jest.fn(() => navigateMock),
  useLocation : jest.fn().mockReturnValue({
      pathname: '/login'
  }),
  Link: jest.fn()
}))

test('email validation', async () => {
  render(<Login />);
  const emailInput = screen.getByLabelText(/email/i); 
  fireEvent.change(emailInput, { target: { value: 'a@gmail' } });
  const errorEmailText = await screen.findByText('Invalid email format.');
  expect(errorEmailText).toBeInTheDocument();
  fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
  await waitFor(() => {
    expect(errorEmailText).not.toBeInTheDocument();
  });
});  


test('password validation ', async () => {
  render(<Login />);
  const passwordInput = screen.getByLabelText(/password/i); 
  fireEvent.change(passwordInput, { target: { value: '111' } });
  const errorPasswordText = await screen.findByText('Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.');                                   
  expect(errorPasswordText).toBeInTheDocument();
  fireEvent.change(passwordInput, { target: { value: 'Vaibhav@123' } });
  await waitFor(() => {
      expect(errorPasswordText).not.toBeInTheDocument();
  });
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

test('successful login', async () => {
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      token: 'faketoken',
      success: true,
      data: { email: 'a@example.com'  },
    },
  });
  // res.json({ success:true, data:{id:user.id,name:user.name,email:user.email,avatar:user.avatar}, token });
  // return;
  render(<Login />);

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Vaibhav@123' } });
  
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith( 
      'https://chatbox-ul83.onrender.com/auth/login',  
      { email: 'a@example.com', password: 'Vaibhav@123'}
    );
  });

  expect(toast.success).toHaveBeenCalledWith('Login successful!');
  expect(navigateMock).toHaveBeenCalledWith('/chat');
  expect(dispatchMock).toHaveBeenCalledWith({
    type: 'authentication/login',
    payload: { token: 'faketoken', user: { email: 'a@example.com' } },
  });
});


test('login failed', async () => {
  mockedAxios.post.mockRejectedValue({
      response: {
          status:401,
          data: {
              message: 'login failed'
          }
      }
  })
  render(<Login/>)

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Vaibhav@123' } });

  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith( 
      'https://chatbox-ul83.onrender.com/auth/login',  
      { email: 'a@example.com', password: 'Vaibhav@123'}
    );
  });

  await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed !')
  })

})

