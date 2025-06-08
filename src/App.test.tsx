import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Routes: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
    [key: string]: any;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

test('renders TODO app navigation', () => {
  render(<App />);
  // アプリが正常にレンダリングされることを確認
  const todoLink = screen.getByText(/TODOアプリ/i);
  expect(todoLink).toBeInTheDocument();
});
