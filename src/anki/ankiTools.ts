// @ts-nocheck
import {Notice} from 'obsidian'
import {addSsAction, getMetaedit} from '../utils/utils'
import GenericInputPrompt from '../utils/GenericInputPrompt'
import {SuggesterModal} from '../utils/SuggesterModal'

const moment = window.moment
const dateFormatStr = 'YYYY/MM/DD HH:mm'

export const changeReviewDate = async (value?: any, filePath?: any) => {
	const file = filePath ? (
		typeof filePath === 'string' ? app.vault.getAbstractFileByPath(filePath)
			: filePath
	) : app.workspace.activeLeaf.view.file
	const {metaApi} = getMetaedit(app)
	const propList = await metaApi.getPropertiesInFile(file)
	const hasReview = propList.some((v: any) => v.key === 'review')
	// const res = await GenericInputPrompt.Prompt(app, 'time', '', '')
	await (metaApi[hasReview ? 'update' : 'createYamlProperty']('review', value, file))
}

const dateChoice = [
	'add_days',
	'add_hours',
	'add_minutes',
	'add_months',
	'customize_string'
]

const numChoice = [
	'1', '3', '5', '7', '10', '15', '20', '30', '50',
	'customize',
]

const selectNum = async (title: string) => {
	const res = await SuggesterModal.initSuggest({
		app,
		text_items: numChoice,
		items: numChoice,
	})
	if (res === 'customize') {
		return Number(await GenericInputPrompt.Prompt(app, `customize ${title}`))
	}
	return Number(res)
}
const selectType = async () => {
	const res = await SuggesterModal.initSuggest({
		app,
		text_items: dateChoice,
		items: dateChoice,
	})
	if (res.includes('add')) {
		const type = res.split('_')[1]
		const num = await selectNum(type)
		return moment().add(num, type).format(dateFormatStr)
	}
	if (res.includes('customize')) {
		const cus = await GenericInputPrompt.Prompt(app, 'customize date')
		const dateM = moment(cus)
		if (!dateM.isValid()) {
			return new Notice('无效的日期')
		}
		return dateM.format(dateFormatStr)
	}
}
export const selectDateValue = async (file) => {
	const date = await selectType()
	await changeReviewDate(date, file)
}

export const ankiTest = async (value: any) => {
	// changeReviewDate(app)(momentObj().format(dateFormatStr))
	// await GenericInputPrompt.Prompt(app, )
}

export const replaceSelection = (app: any) => {
	if (!app.workspace) return
	const sel = app.workspace.activeLeaf.view.editor.getSelection()
	if (!sel) {
		return new Notice('请选择划线区域')
	}
	app.workspace.activeLeaf.view.editor.replaceSelection(`<b>${sel}</b>`)
}

export const initAnki = (app: any, that: any) => {
	if (!app.workspace) return
	addSsAction(app, {
		anki: {
			dateFormatStr,
			ankiTest,
			replaceSelection,
		},
	})
	that.addCommand({
		id: 'ss-plugins-replaceSelection',
		icon: 'Eye',
		name: 'replaceSelection',
		callback: () => {
			replaceSelection(app)
		},
	})
	that.addCommand({
		id: 'ss-plugins-changeReviewDate',
		icon: 'AlarmClock',
		name: 'changeReviewDate',
		callback: () => {
			selectDateValue()
		},
	})
}
