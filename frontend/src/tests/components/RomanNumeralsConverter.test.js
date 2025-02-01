import { render, screen, fireEvent } from '@testing-library/react';
import RomanNumeralsConverter from '../../components/RomanNumeralsConverter/RomanNumeralsConverter'

test('renders the Roman Numerals Converter form', () => {
    render(<RomanNumeralsConverter />);
    const inputElement = screen.getByLabelText(/Number/i);
    const buttonElement = screen.getByRole('button', { name: /Convert/i });

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
});

test('displays result after conversion', async () => {
    render(<RomanNumeralsConverter />);
    fireEvent.change(screen.getByLabelText(/Number/i), { target: { value: 10 } });
    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    const resultText = await screen.findByText(/Roman Numeral: X/i);
    expect(resultText).toBeInTheDocument();
});

test('shows error when input is zero', async () => {
    render(<RomanNumeralsConverter />);
    fireEvent.change(screen.getByLabelText(/Number/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    const errorText = await screen.findByText(/Error:/i);
    expect(errorText).toBeInTheDocument();
});

test('displays result for large number', async () => {
    render(<RomanNumeralsConverter />);
    fireEvent.change(screen.getByLabelText(/Number/i), { target: { value: '1000' } });
    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    const resultText = await screen.findByText(/Roman Numeral: M/i);
    expect(resultText).toBeInTheDocument();
});

test('handles rapid consecutive clicks', async () => {
    render(<RomanNumeralsConverter />);
    fireEvent.change(screen.getByLabelText(/Number/i), { target: { value: '25' } });

    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));
    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    const resultText = await screen.findByText(/Roman Numeral: XXV/i);
    expect(resultText).toBeInTheDocument();
});

test('displays results for multiple conversions', async () => {
    render(<RomanNumeralsConverter />);

    // First conversion
    fireEvent.change(screen.getByLabelText(/Number/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));
    const result1 = await screen.findByText(/Roman Numeral: I/i);
    expect(result1).toBeInTheDocument();

    // Second conversion
    fireEvent.change(screen.getByLabelText(/Number/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));
    const result2 = await screen.findByText(/Roman Numeral: V/i);
    expect(result2).toBeInTheDocument();
});

test('displays result for the maximum Roman numeral (3999)', async () => {
    render(<RomanNumeralsConverter />);
    fireEvent.change(screen.getByLabelText(/Number/i), { target: { value: '3999' } });
    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    const resultText = await screen.findByText(/Roman Numeral: MMMCMXCIX/i);
    expect(resultText).toBeInTheDocument();
});

test('renders Roman Numerals Converter with default light mode', () => {
    // Mock localStorage to simulate the absence of a saved theme (light mode by default)
    Storage.prototype.getItem = jest.fn().mockReturnValue(null);

    render(<RomanNumeralsConverter />);

    // Check that the default light mode theme is applied
    const body = document.querySelector('body');
    expect(body).not.toHaveAttribute('data-theme', 'dark');  // Ensure dark mode is not applied
});

test('switches from dark to light mode after clearing localStorage', () => {
    // Initially, mock localStorage to simulate dark mode being saved
    Storage.prototype.getItem = jest.fn().mockReturnValue('dark');
    Storage.prototype.setItem = jest.fn();

    render(<RomanNumeralsConverter />);

    // Simulate clearing the saved theme, which should set the theme to light mode
    localStorage.removeItem('theme');

    // Re-render to apply the new theme setting (light mode)
    render(<RomanNumeralsConverter />);

    // Check if light mode is applied correctly
    const body = document.querySelector('body');
    expect(body).not.toHaveAttribute('data-theme', 'dark');  // Ensure dark mode is not applied
});
