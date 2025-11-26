import { render } from '@testing-library/react';
import App from '@/panel/App';


test('renders ChatMark', () => {
  const { getByText } = render(<App />);
  expect(getByText(/ChatMark/i)).toBeInTheDocument();
});
