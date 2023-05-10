import '@testing-library/jest-dom';
import { expect, it } from 'vitest';
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import React from "react";
import HomePage from '../home/HomePage';
import localStorageMock from './local-storage-mock.js';

const mockUser1 = {
  _id: 1,
  username: "testUser1",
  userDisplayName: "testUser1",
  spotifyPic: "testUser1",
  profilePic: "testUser1",
  userIsActive: false,
  userStudios: [],
};

beforeAll(() => {
  global.localStorage = localStorageMock;
});

it('home page renders correctly', () => {
  localStorage.setItem('current_user_id', mockUser1._id);
  console.log(localStorage.getItem('current_user_id'))

  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <HomePage />
    </MemoryRouter>
  )

  expect(getByText('My Studios')).toBeInTheDocument();
  expect(getByText('Listening Now')).toBeInTheDocument();
});