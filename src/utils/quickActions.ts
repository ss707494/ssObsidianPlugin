// @ts-nocheck
import {SuggesterModal} from './SuggesterModal'
import {changeFileType, changeMeta, doFinish, enumToArray, getMetaedit} from './utils'
import {refresh} from '../render'
import {replaceSelection, selectDateValue} from '../anki/ankiTools'

enum ActionType {
	doFinish,
	changeFileType,
	changeMeta,
	selectDateValue,
	replaceANKI,
}
const actionString = {
	[ActionType.doFinish]: '归档',
	[ActionType.changeFileType]: '修改文件类型',
	[ActionType.selectDateValue]: '选择复习日期',
	[ActionType.replaceANKI]: '问答格式',
}

export const initQuickActions = (that) => {
	that.addCommand({
		id: 'ss-plugins-quickActions',
		icon: 'wrench-screwdriver-glyph',
		name: 'quickActions',
		callback: () => {
			quickActions()
		},
	})
}

export const quickActions = async (file?: string) => {
	const filePath = file ? file : app.workspace.activeLeaf.view.file.path
	const {metaApi} = getMetaedit(app)

	const items = enumToArray(ActionType, actionString)
	const res = await SuggesterModal.initSuggest({
		app,
		text_items: items.keys,
		items: items.values,
	})
	const actionObj = {
		[ActionType.doFinish]: async () => {
			await doFinish(filePath)
		},
		[ActionType.changeMeta]: async () => changeMeta(filePath, app),
		[ActionType.changeFileType]: async () => changeFileType(filePath, app),
		[ActionType.selectDateValue]: async () => selectDateValue(filePath),
		[ActionType.replaceANKI]: async () => replaceSelection(app),
	}
	if (actionObj[res]) {
		await actionObj[res]()
		refresh(app)
	}
}
