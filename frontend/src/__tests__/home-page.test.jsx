import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
const { render } = require("@testing-library/react")
const { MemoryRouter } = require("react-router-dom")
import App from '../App';
import { AppContextProvider } from '../AppContextProvider';
import { useLocalStorage } from '../hooks/useLocalStorage';
import mongoose from "mongoose";
import React, { useContext, useEffect, useState } from "react";
import HomePage from '../home/HomePage';

const mockUser1 = {
    _id: 1,
    username: "testUser1",
    userDisplayName: "testUser1",
    spotifyPic: "testUser1",
    profilePic: "testUser1",
    userIsActive: false,
    userStudios: [],
};

global.localStorageMock = {
    getItem: (key) => {
        return localStorageMock[key];
    },
    setItem: (key, value) => {
        localStorageMock[key] = value.toString();
    },
    removeItem: (key) => {
        delete localStorageMock[key];
    },
    clear: () => {
        localStorageMock = {};
    }
};

global.localStorage = localStorageMock;

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