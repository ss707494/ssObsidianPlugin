import esbuild from 'esbuild'
import process from 'process'
import builtins from 'builtin-modules'
import {copy} from 'esbuild-plugin-copy'

const banner =
	`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`

const prod = (process.argv[2] === 'production')

const outpath = 'D:/ss707494/note/.obsidianPC/plugins/ssPlugin'
const outpath2 = 'D:/ss707494/note/.obsidianPhone/plugins/ssPlugin'

esbuild.build({
	banner: {
		js: banner,
	},
	entryPoints: ['main.ts'],
	bundle: true,
	external: [
		'obsidian',
		'electron',
		'@codemirror/autocomplete',
		'@codemirror/closebrackets',
		'@codemirror/collab',
		'@codemirror/commands',
		'@codemirror/comment',
		'@codemirror/fold',
		'@codemirror/gutter',
		'@codemirror/highlight',
		'@codemirror/history',
		'@codemirror/language',
		'@codemirror/lint',
		'@codemirror/matchbrackets',
		'@codemirror/panel',
		'@codemirror/rangeset',
		'@codemirror/rectangular-selection',
		'@codemirror/search',
		'@codemirror/state',
		'@codemirror/stream-parser',
		'@codemirror/text',
		'@codemirror/tooltip',
		'@codemirror/view',
		...builtins],
	format: 'cjs',
	watch: !prod,
	target: 'es2016',
	logLevel: 'info',
	sourcemap: prod ? false : 'inline',
	treeShaking: true,
	outfile: `${outpath}/main.js`,
	plugins: [
		copy({
			assets: [
				{
					from: ['./manifest.json'],
					to: [`${outpath}/manifest.json`],
				},
				{
					from: ['./styles.css'],
					to: [`${outpath}/styles.css`],
				},
				{
					from: [`${outpath}/main.js`],
					to: [`${outpath2}/main.js`],
				},
				{
					from: ['./manifest.json'],
					to: [`${outpath2}/manifest.json`],
				},
				{
					from: ['./styles.css'],
					to: [`${outpath2}/styles.css`],
				},
				// {
				// 	from: ['D:/code/ss707494/obsidian/ssObsidianPlugin/src/config/metaeditdata.json'],
				// 	to: ['D:/ss707494/note/.obsidianPC/plugins/metaedit/data.json'],
				// },
				// {
				// 	from: ['D:/ss707494/note/.obsidianPC/command-palette.json'],
				// 	to: ['D:/ss707494/note/.obsidianPhone/command-palette.json'],
				// },
				// {
				// 	from: ['D:/ss707494/note/.obsidianPC/community-plugins.json'],
				// 	to: ['D:/ss707494/note/.obsidianPhone/community-plugins.json'],
				// },
				// {
				// 	keepStructure: true,
				// 	from: ['D:/ss707494/note/.obsidianPC/plugins/**/*'],
				// 	to: ['D:/ss707494/note/.obsidianPhone/plugins'],
				// },
			],
		}),
	],
}).catch(() => process.exit(1))
