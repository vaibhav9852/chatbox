
import {fireEvent, render,screen , waitFor } from "@testing-library/react";
import  axios from "axios"
import '@testing-library/jest-dom';
import Signup from "@/src/components/auth/Signup";
import { useDispatch, useSelector } from "react-redux";
 import { useNavigate } from "react-router-dom"; 
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
  signupUser: jest.fn(),
}));

const navigateMock = jest.fn()
const dispatchMock = jest.fn()

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => dispatchMock)
}))

jest.mock('react-router-dom', () => ({
  useNavigate : jest.fn(() => navigateMock),
  useLocation: jest.fn().mockReturnValue({
      pathname: '/signup'
  }),
  Link: jest.fn()
}))

test('email validation', async () => {
  render(<Signup />);
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
  render(<Signup />);
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

test('successful signup', async () => {
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      token: 'faketoken',
      success: true,
      data: { email: 'a@example.com'  },
    },
  });
  // res.json({ success:true, data:{id:user.id,name:user.name,email:user.email,avatar:user.avatar}, token });
  // return;
  render(<Signup />);
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'vaibhav' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Vaibhav@123' } });
  
  fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith( 
      'https://chatbox-ul83.onrender.com/auth/signup',  
      {name: 'vaibhav', email: 'a@example.com', password: 'Vaibhav@123'}
    );
  });

  expect(toast.success).toHaveBeenCalledWith('Signup successful!');
  expect(navigateMock).toHaveBeenCalledWith('/login');
  expect(dispatchMock).toHaveBeenCalledWith({
    type: 'authentication/signup',
    payload: { token: 'faketoken', user: { name:'vaibhav',email: 'a@example.com' } },
  });
});


test('signup failed', async () => {
  mockedAxios.post.mockRejectedValue({
      response: {
          status:401,
          data: {
              message: 'signup failed'
          }
      }
  })
  render(<Signup />)
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'vaibhav' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Vaibhav@123' } });

  fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith( 
      'https://chatbox-ul83.onrender.com/auth/signup',  
      {name:"vaibhav", email: 'a@example.com', password: 'Vaibhav@123'}
    );
  }); 

  await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Signup failed !')
  })

})

