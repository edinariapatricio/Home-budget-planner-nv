import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LoginForm from '../components/LoginForm';

test('renders login form', () => {
  const { getByPlaceholderText } = render(<LoginForm />);
  const usernameInput = getByPlaceholderText(/Username/i);
  expect(usernameInput).toBeInTheDocument();
});

test('login form submits', async () => {
  const { getByPlaceholderText, getByText } = render(<LoginForm />);
  const usernameInput = getByPlaceholderText(/Username/i);
  const passwordInput = getByPlaceholderText(/Password/i);
  const submitButton = getByText(/Login/i);
  
  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(submitButton);
  
  // Assume axios.post is mocked to resolve
  // Implement axios mock here for a complete test
});
