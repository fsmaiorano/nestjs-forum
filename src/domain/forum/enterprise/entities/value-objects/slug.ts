export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Slug(value);
  }

  /**
   * Receives a string and normalize it as a slug
   * Example: "This is a title" -> "this-is-a-title"
   * @param {string} value
   */
  static createFromText(text: string) {
    const slug = text
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-$/, '');

    return new Slug(slug);
  }
}
