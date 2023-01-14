
interface ExtensionConfigType {
	/**
	 * RegExp string or asterisk `*` (means all). Only auto open links that match the regexp.\n\nExample: `^https://www.reddit.com\\/?.*`
	 */
	linkRegex: string;
}

export type ExtensionConfig = Readonly<ExtensionConfigType>;
