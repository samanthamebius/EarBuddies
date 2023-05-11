import '@testing-library/jest-dom';
import { expect, it } from 'vitest';
import { render } from "@testing-library/react"
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
    localStorage.setItem('current_user_id', mockUser1._id);

});

/**
 * Tests that appropriate elements render on page not found page when error code is 404
 */
it('page not found renders correctly for 404 code', () => {
    const { getByTestId, getByText, getByRole } = render(
        <MemoryRouter initialEntries={['/404']}>
            <PageNotFound errorType={"404"} />
        </MemoryRouter>
    )

    expect(getByTestId('ErrorOutlineRoundedIcon')).toBeInTheDocument();
    expect(getByText('Oops! The page you\'re looking for doesn\'t exist')).toBeInTheDocument();
    expect(getByRole('button', { name: "Back to home" })).toBeInTheDocument();
});

/**
 * Tests that appropriate elements render on page not found page when error code is 400
 */
it('page not found renders correctly for 400 code', () => {
    const { getByTestId, getByText, getByRole } = render(
        <MemoryRouter initialEntries={['/400']}>
            <PageNotFound errorType={"400"} />
        </MemoryRouter>
    )

    expect(getByTestId('ErrorOutlineRoundedIcon')).toBeInTheDocument();
    expect(getByText('Oops! An error occurred while communicating with Spotify')).toBeInTheDocument();
    expect(getByRole('button', { name: "Please login again" })).toBeInTheDocument();
});

/**
 * Tests that appropriate elements render on page not found page when error code is 500
 */
it('page not found renders correctly for 500 code', () => {
    const { getByTestId, getByText, getByRole } = render(
        <MemoryRouter initialEntries={['/500']}>
            <PageNotFound errorType={"500"} />
        </MemoryRouter>
    )

    expect(getByTestId('ErrorOutlineRoundedIcon')).toBeInTheDocument();
    expect(getByText('Oops! Something went wrong on our end')).toBeInTheDocument();
    expect(getByRole('button', { name: "Please login again" })).toBeInTheDocument();
});

/**
 * Tests that appropriate elements render on page not found page when path is random
 */
it('page not found renders correctly for random path', () => {
    const { getByTestId, getByText, getByRole } = render(
        <MemoryRouter initialEntries={['/random']}>
            <PageNotFound errorType={"404"} />
        </MemoryRouter>
    )

    expect(getByTestId('ErrorOutlineRoundedIcon')).toBeInTheDocument();
    expect(getByText('Oops! The page you\'re looking for doesn\'t exist')).toBeInTheDocument();
    expect(getByRole('button', { name: "Back to home" })).toBeInTheDocument();
});