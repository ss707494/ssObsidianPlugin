// @ts-nocheck
import {App, debounce, WorkspaceLeaf} from 'obsidian'
import {addSsAction, getMetaedit} from '../utils/utils'

export const initHomePage = (app: App, that: any) => {
	if (app.workspace.activeLeaf == null) {
		//only do on startup, not plugin activation
		app.workspace.onLayoutReady(async () => {
			await openHomepage(app)
			addSsAction(app, {
				metaedit: getMetaedit(app),
			})
		})
	}
	const statusBarItemEl = that.addStatusBarItem()
	that.registerEvent(
		app.workspace.on(
			'active-leaf-change',
			debounce((leaf) => readViewModeFromFrontmatterAndToggle(leaf, app, statusBarItemEl), 500),
		),
	)
}

const readViewModeFromFrontmatterAndToggle = async (
	leaf: WorkspaceLeaf,
	app: App,
	statusBarItemEl: any,
) => {
	if (leaf.getViewState().type === 'markdown' && !['首页Home', 'Graph view'].includes(leaf.getDisplayText())) {
		const state = leaf.view.getState()
		const mode = leaf.app.vault.config.defaultViewMode || 'source'
		if (state.mode !== mode) {
			state.mode = mode
			state.source = false
			await leaf.setViewState({type: 'markdown', state: state})
		}
		if (!app.isMobile) {
			setTimeout(() => {
				const editor = leaf.view.editor
				editor.focus()
				if (editor.lastLine() > 4) {
					editor.setSelection({line: 4, ch: 0})
				} else {
					editor.setSelection({line: editor.lastLine(), ch: 0})
				}
			}, 300)
		}
		if (app.isMobile && !leaf.getViewState().state.file.includes('/data/') && !leaf.getViewState().state.file.includes('lib/工具')) {
			document.querySelector('.cm-fold-indicator').click()
		}
	}
	if (app.workspace.activeLeaf?.view?.file?.parent?.name) {
		statusBarItemEl.setText(`${app.workspace.activeLeaf.view.file.parent.name}`)
	}
}

export const openHomepage = async (app: App) => {
	await app.workspace.openLinkText(
		'/lib/首页Home', '', false, {active: true},
	)
	const leaf = app.workspace.activeLeaf
	const state = leaf.view.getState()
	state.mode = 'preview'
	state.source = false
	await leaf.setViewState({type: 'markdown', state: state})
}
