import cloneCustomNode from '../utils/cloneCustomNode';

test('cloneCustomNode clones all custom attributes on a DOM element', () => {
  interface TestDivWithCustomProperty extends HTMLDivElement {
    myCustomProperty: string;
  }

  const div = document.createElement('div') as TestDivWithCustomProperty;
  const propertyValue = 'It works!';
  div.myCustomProperty = propertyValue;

  const div2 = cloneCustomNode(div);

  expect(div2.myCustomProperty).toBe(propertyValue);
});
