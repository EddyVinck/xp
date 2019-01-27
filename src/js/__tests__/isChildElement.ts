import 'jest-dom/extend-expect';
import isChildElement from '../utils/isChildElement';
import { getByTestId } from 'dom-testing-library';

test("isChildElement returns true if an element is a parents' child element", () => {
  document.body.innerHTML = `
    <div>
      <div class="parent">
        <span>
          <div data-testid="hello">Hi</div>
        </span>
      </div>
    </div>
  `;

  const div = getByTestId(document.body, 'hello');
  const parent = document.querySelector('.parent') as HTMLElement;

  const isChild = isChildElement(div, parent);

  expect(isChild).toBeTruthy();
});

test("isChildElement returns true if an element is a parents' child element", () => {
  document.body.innerHTML = `
    <div>
      <span>
        <div data-testid="hello">Hi</div>
      </span>
      <div class="parent"></div>
    </div>
  `;

  const div = getByTestId(document.body, 'hello');
  const parent = document.querySelector('.parent') as HTMLElement;

  const isChild = isChildElement(div, parent);

  expect(isChild).toBeFalsy();
});
