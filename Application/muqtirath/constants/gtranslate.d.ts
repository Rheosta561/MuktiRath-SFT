declare module 'gtranslate' {
  export interface TranslateOptions {
    from?: string;
    to?: string;
  }

  function gtranslate(
    text: string,
    targetLang: string,
    options?: TranslateOptions
  ): Promise<string>;

  export = gtranslate;
}
