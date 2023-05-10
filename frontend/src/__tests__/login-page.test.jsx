import '@testing-library/jest-dom';
import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import LogInPage from '../login/LogInPage';

/**
 * Tests that appropriate elements render on login page
 */
it('renders login page correctly', () => {
    const { getByRole, getByText, getByAltText } = render(<LogInPage />);

    expect(getByRole('button', { name: 'Log In Using Spotify' })).toBeInTheDocument();
    // expect(getByRole('img', { name: 'Log In Using Spotify' })).toBeInTheDocument();
    expect(getByText('EAR BUDDIES')).toBeInTheDocument();
});