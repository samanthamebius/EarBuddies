import '@testing-library/jest-dom';
import { expect, it } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import localStorageMock from './local-storage-mock.js';
import CreateStudioDialog from '../createstudio/CreateStudioDialog';

const mockUser1 = {
	_id: 1,
	username: 'testUser1',
	userDisplayName: 'testUser1',
	spotifyPic: 'testUser1',
	profilePic: 'testUser1',
	userIsActive: false,
	userStudios: [],
};

beforeAll(() => {
	global.localStorage = localStorageMock;
	localStorage.setItem('current_user_id', mockUser1._id);
});

/**
 * Tests that elements of create studio dialog render
 */
it('create studio pop up renders correctly', () => {
	const { getByRole } = render(
		<MemoryRouter initialEntries={['/']}>
			<CreateStudioDialog
				isDialogOpened={true}
				handleCloseDialog={() => {}}
			/>
		</MemoryRouter>
	);

	expect(getByRole('dialog')).toBeInTheDocument();
	expect(getByRole('heading', { name: 'Create Studio' })).toBeInTheDocument();
	expect(getByRole('heading', { name: 'Studio Name *' })).toBeInTheDocument();
	expect(getByRole('heading', { name: 'Cover Photo' })).toBeInTheDocument();
	expect(getByRole('heading', { name: 'Genres' })).toBeInTheDocument();
	expect(getByRole('heading', { name: 'Only I Have Control' })).toBeInTheDocument(); // TO BE CHANGED?
	expect(getByRole('heading', { name: 'Add Listeners' })).toBeInTheDocument();

	expect(getByRole('button', { name: 'Add' })).toBeInTheDocument();
	expect(getByRole('button', { name: 'Rap' })).toBeInTheDocument();
	expect(getByRole('button', { name: 'Rock' })).toBeInTheDocument();
	expect(getByRole('button', { name: 'K-Pop' })).toBeInTheDocument();
	expect(getByRole('button', { name: 'Country' })).toBeInTheDocument();
	expect(getByRole('button', { name: 'Classical' })).toBeInTheDocument();
	expect(getByRole('button', { name: 'R&B' })).toBeInTheDocument();
	expect(getByRole('button', { name: 'Jazz' })).toBeInTheDocument();
	expect(getByRole('button', { name: 'Pop' })).toBeInTheDocument();

	expect(getByRole('textbox', { name: 'Enter a Studio Name ...' })).toBeInTheDocument();
	expect(getByRole('textbox', { name: 'Add your own genres ...' })).toBeInTheDocument();

	expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
	expect(getByRole('button', { name: 'Create Studio' })).toBeInTheDocument();
});

/**
 * Tests that genre tag is added to create studio dialog
 */
it('adds a new genre when the "Add" button is clicked', () => {
	const { getByRole } = render(
		<MemoryRouter initialEntries={['/']}>
			<CreateStudioDialog
				isDialogOpened={true}
				handleCloseDialog={() => {}}
			/>
		</MemoryRouter>
	);

	const genreInputBox = getByRole('textbox', { name: 'Add your own genres ...' });
	const addButton = getByRole('button', { name: 'Add' });

	fireEvent.change(genreInputBox, { target: { value: 'Indie' } });
	fireEvent.click(addButton);

	expect(getByRole('button', { name: 'Indie' })).toBeInTheDocument();
});

/**
 * Tests that helper text error message is displayed when no studio name is entered in create studio dialog
 */
it('create studio error text renders correctly', () => {
	const { getByText, getByRole } = render(
		<MemoryRouter initialEntries={['/']}>
			<CreateStudioDialog
				isDialogOpened={true}
				handleCloseDialog={() => {}}
			/>
		</MemoryRouter>
	);

	const createStudioButton = getByRole('button', { name: 'Create Studio' });
	fireEvent.click(createStudioButton);

	expect(getByText('No Studio Name Entry')).toBeInTheDocument();
});
