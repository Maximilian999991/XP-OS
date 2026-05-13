import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
	{
		ignores: ["out/**"],
	},

	js.configs.recommended,

	...tseslint.configs.recommended,

	prettierConfig,

	{
		plugins: {
			prettier: prettierPlugin,
		},

		rules: {
			indent: "off",
			"max-len": ["warn", { code: 120 }],
			"no-trailing-spaces": "warn",
			"no-multiple-empty-lines": ["warn", { max: 1 }],
			semi: ["warn", "always"],
			curly: ["warn", "multi-line"],
			"no-extra-parens": "off",
			"no-extra-semi": "warn",
			"no-console": "off",
			"no-lonely-if": "warn",
			eqeqeq: ["warn", "smart"],
			"no-fallthrough": "warn",
			"object-curly-spacing": ["warn", "always"],
			"array-bracket-spacing": "off",
			"semi-spacing": ["warn", { before: false, after: true }],
			"require-await": "off",
			"no-return-await": "warn",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/ban-ts-comment": "off",

			"prettier/prettier": "warn",
		},
	},
];
