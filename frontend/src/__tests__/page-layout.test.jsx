import '@testing-library/jest-dom';
import { expect, it } from 'vitest';
import { findByAltText, getAllByTestId, getByRole, render, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import React from "react";
import localStorageMock from './local-storage-mock.js';
import PageLayout from '../PageLayout';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import useGet from '../hooks/useGet.js';

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
    axiosMock = new MockAdapter(axios);
});

afterEach(() => {
    axiosMock.reset();
});

/**
 * Tests that the appropriate nav links render on the pagelayout nav menu component
 */
it('pagelayout renders nav links correctly', () => {
    const { getByAltText, getByText } = render(
        <MemoryRouter initialEntries={['/']}>
            <PageLayout />
        </MemoryRouter>
    )
    const earBuddiesLogo = getByAltText('Ear Buddies Logo')
    expect(earBuddiesLogo).toHaveAttribute('src', '/src/assets/shared/earBuddiesLogo.png');
    expect(getByText('EAR BUDDIES')).toBeInTheDocument();
});

/**
 * Tests that the dropdown menu renders on the pagelayout nav menu component
 */
it('pagelayout gets user info correctly', async () => {
    // const { queryByText } = render(
    //     <MemoryRouter initialEntries={['/']}>
    //         <PageLayout />
    //     </MemoryRouter>
    // )

    // const mockResponse = {
    //     mockUser1,
    //     isLoading: false,
    //     error: null
    // }

    // const userName = await screen.fintByTest(mockUser1.username);
    // expect(userName).toBeInTheDocument();
});