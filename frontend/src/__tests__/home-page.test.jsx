import '@testing-library/jest-dom';
import { expect, it } from 'vitest';
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import React from "react";
import HomePage from '../home/HomePage';
import localStorageMock from './local-storage-mock.js';

const mockStudio1 = {
    _id: 1,
    studioName: "testStudio1",
    studioIsActive: true,
    studioUsers: [],
    studioHost: "testUser1",
    studioGenres: ["testGenre1"],
    studioPicture: "testPicture1",
    studioControlHostOnly: false,
    studioPlaylist: "testPlaylist1",
};

const mockUser1 = {
    _id: 2,
    username: "testUser1",
    userDisplayName: "testUser1",
    spotifyPic: "testUser1",
    profilePic: "testUser1",
    userIsActive: true,
    userStudios: [mockStudio1._id],
};

beforeAll(() => {
    global.localStorage = localStorageMock;
    localStorage.setItem('current_user_id', mockUser1._id);
});

/**
 * Tests that appropriate elements render on home page
 */
it('renders home page correctly', () => {
    const { getByText, getByRole, getByAltText } = render(
        <MemoryRouter initialEntries={['/']}>
            <HomePage />
        </MemoryRouter>
    )

    expect(getByText('My Studios')).toBeInTheDocument();
    expect(getByText('Listening Now')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Create Studio' })).toBeInTheDocument();
    expect(getByAltText('Pink Sound Waves')).toBeInTheDocument();
});

/**
 * Tests that search bars with appropriate labels render on home page
 */
it('renders search bars in home page correctly', () => {
    const { getByLabelText } = render(
        <MemoryRouter initialEntries={['/']}>
            <HomePage />
        </MemoryRouter>
    )

    expect(getByLabelText('Search My Studios ...')).toBeInTheDocument();
    expect(getByLabelText('Search Studios Listening Now ...')).toBeInTheDocument();
});