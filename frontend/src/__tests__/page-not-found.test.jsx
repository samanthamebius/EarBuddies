import '@testing-library/jest-dom';
import { expect, it } from 'vitest';
import { getAllByTestId, getByRole, render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import React from "react";
import PageNotFound from '../PageNotFound';
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


it('page not found renders correctly for 400 code', () => {
    localStorage.setItem('current_user_id', mockUser1._id);

    const { getByTestId, getByText, getByRole } = render(
        <MemoryRouter initialEntries={['/400']}>
            <PageNotFound errorType={"400"} />
        </MemoryRouter>
    )

    expect(getByTestId('ErrorOutlineRoundedIcon')).toBeInTheDocument();
    expect(getByText('Oops! An error occurred while communicating with Spotify')).toBeInTheDocument();
    expect(getByRole('button', { name: "Please login again" })).toBeInTheDocument();
});


it('page not found renders correctly for 500 code', () => {
    localStorage.setItem('current_user_id', mockUser1._id);

    const { getByTestId, getByText, getByRole } = render(
        <MemoryRouter initialEntries={['/500']}>
            <PageNotFound errorType={"500"} />
        </MemoryRouter>
    )

    expect(getByTestId('ErrorOutlineRoundedIcon')).toBeInTheDocument();
    expect(getByText('Oops! Something went wrong on our end')).toBeInTheDocument();
    expect(getByRole('button', { name: "Please login again" })).toBeInTheDocument();
});

it('page not found renders correctly for * code', () => {
    localStorage.setItem('current_user_id', mockUser1._id);

    const { getByTestId, getByText, getByRole } = render(
        <MemoryRouter initialEntries={['/random']}>
            <PageNotFound errorType={"404"} />
        </MemoryRouter>
    )

    expect(getByTestId('ErrorOutlineRoundedIcon')).toBeInTheDocument();
    expect(getByText('Oops! The page you\'re looking for doesn\'t exist')).toBeInTheDocument();
    expect(getByRole('button', { name: "Back to home" })).toBeInTheDocument();
});