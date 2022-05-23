// @ts-nocheck
import {App, ButtonComponent} from 'obsidian'
import {SuggesterModal} from './SuggesterModal'

export const enumToArray = (enu: any, strObj?: any) => {
	const k = Object.values(enu).filter(value => typeof value === 'string')
	return {
		keys: (k.map(v => strObj?.[enu[v]] ?? v)) as string[],
		// @ts-ignore
		values: k.map(v => enu[v]),
	}
}

export const getFilePath = (filePath: any) => {
	return filePath ? filePath : app.workspace.activeLeaf.view.file.path
}
export const addSsAction = (app: App, obj: any) => {
	if (!app.ssAction) {
		app.ssAction = {}
	}
	app.ssAction = {
		...app.ssAction,
		...obj,
	}
}

export const getMetaedit = (app: App) => {
	const metaedit = app.plugins.plugins['metaedit']
	const metaApi = metaedit.api
	const properties = metaedit.settings.AutoProperties.properties
	const type = properties?.find(v => v.name === 'type')?.choices
	return {
		metaedit,
		metaApi,
		properties,
		type,
	}
}

export const changeOneMeta = async (filePath, editField, app) => {
	const typeChoise = editField?.choices
	const {metaApi} = getMetaedit(app)
	const res = await SuggesterModal.initSuggest({
		app,
		text_items: typeChoise,
		items: typeChoise,
	})
	await metaApi.update(editField.name, res, filePath)
}

export const changeMeta = async (filePath: any, app: any) => {
	const {properties} = getMetaedit(app)
	const editField = await SuggesterModal.initSuggest({
		app,
		text_items: (p) => p.name,
		items: properties,
	})

	await changeOneMeta(filePath, editField, app)
}
const fileTypeList = ['便签', '记录', '知识', '资料']
export const changeFileType = async (filePath: any, app: any) => {
	const {metaApi, properties} = getMetaedit(app)
	const res = await SuggesterModal.initSuggest({
		app,
		text_items: fileTypeList,
		items: fileTypeList,
	})
	const tfile = app.vault.getAbstractFileByPath(filePath)
	if ((await metaApi.getPropertyValue('type', filePath)) === '空') {
		await changeOneMeta(filePath, properties.find(v => v.name === 'type'), app)
	}
	await app.fileManager.renameFile(tfile, `pages/${res}/${tfile.name}`)
}
export const doFinish = async (filePath?: any) => {
	const tfile = app.vault.getAbstractFileByPath(getFilePath(filePath))
	await app.fileManager.renameFile(tfile, `归档/${tfile.name}`)
}

export const renameFile = async (txt, file, app) => {
	const tfile = app.vault.getAbstractFileByPath(file.path)
	await app.fileManager.renameFile(tfile, `${tfile.parent.path}/${txt}.${tfile.extension}`)
}

export const renameFileQuick = async () => {
	if (!document) return
	const select = app.workspace.activeLeaf.view.editor.getSelection()
	if (!select) return
	await renameFile(select.replaceAll(/[【】<>\/\\|:*?]/g, '_'), app.workspace.getActiveFile(), app)
}

export const executeObsidianCommand = (app, commandId) => {
	app.commands.executeCommandById(commandId)
}

export const getIconSvg = (name) => {
	if (!document) return
	const cache = document.createElement('div')
	const btn = new ButtonComponent(cache)
	btn.setIcon(name)
	const svg = btn.buttonEl.querySelector('svg')
	svg.setAttr('width', 17)
	svg.setAttr('height', 17)
	return svg
}

export const globalSearch = () => {
	this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch('path:pages')
}
