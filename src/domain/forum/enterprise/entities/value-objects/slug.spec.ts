import { Slug } from './slug';

test('should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('This is a title');
  expect(slug.value).toBe('this-is-a-title');
});
