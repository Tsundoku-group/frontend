import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/(main)/home/page';

describe('Home page', () => {
    it('renders the main content', () => {
        render(<Home />);
        const mainContent = screen.getByText(/Main content/i);
        expect(mainContent).toBeInTheDocument();
    });

    it('renders the side widgets', () => {
        render(<Home />);
        const sideWidgets = screen.getByText(/Side widgets/i);
        expect(sideWidgets).toBeInTheDocument();
    });
});