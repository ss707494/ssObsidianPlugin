// @ts-nocheck
import {executeObsidianCommand, getIconSvg} from './utils'
import {LeftAction} from '../../main'

export const addLeftAction = (app, setting) => {
	[...setting.leftAction].reverse().forEach(item => addOneLeftAction(app, item))
}
const addOneLeftAction = (app, leftAction: LeftAction) => {
	const domA = document.createElement('a')
	domA.className = 'view-action ssPluginLeftAction'
	domA.appendChild(getIconSvg(leftAction.icon))
	domA.addEventListener('click', () => {
		executeObsidianCommand(app, leftAction.command.split('&&')[0])
	})
	document.querySelector('.workspace .view-header .view-actions').prepend(domA)
}
