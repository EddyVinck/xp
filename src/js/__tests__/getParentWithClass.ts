import 'jest-dom/extend-expect';
import { getByTestId } from 'dom-testing-library';

import getParentWithClass from '../utils/getParentWithClass';

test('getParentWithClass returns a parent with a certain class when it exists', () => {
  document.body.innerHTML = `
    <div>
      <div class="target">
        <span>
          <div data-testid="hello">Hi</div>
        </span>
      </div>
    </div>
  `;

  const div = getByTestId(document.body, 'hello');
  const target = getParentWithClass(div, 'target');

  expect(target).toBeInTheDocument();
  expect(target).toHaveClass('target');
});

test('getParentWithClass', () => {
  document.body.innerHTML = `
    <div>
      <div class="target">
        <span>
          <div data-testid="hello">Hi</div>
        </span>
      </div>
    </div>
  `;

  const div = getByTestId(document.body, 'hello');
  const target = getParentWithClass(div, 'not in the dom');

  expect(target).toBe(null);
  expect(target).not.toBeInTheDocument();
});
