import '@testing-library/jest-dom';
import { expect, it } from 'vitest';
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import React from "react";
import localStorageMock from './local-storage-mock.js';
import PageLayout from '../PageLayout';

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