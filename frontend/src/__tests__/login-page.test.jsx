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
    expect(getByAltText('Spotify and Ear Buddies Logo')).toBeInTheDocument();
    expect(getByText('EAR BUDDIES')).toBeInTheDocument();
});