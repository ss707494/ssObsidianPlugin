// @ts-nocheck
import React from "react"
import {executeObsidianCommand, getIconSvg} from './utils'
import {LeftAction} from '../../main'
import {createRoot} from 'react-dom/client'
import {LeftActionButton} from './LeftActionButton'

export const addLeftAction = (app, setting) => {
	const contentDom = document.querySelector('.app-container .workspace-leaf-content[data-type=markdown] .view-content');
	const domAction = document.createElement('div')
	const root = createRoot(domAction)
	root.render(<LeftActionButton actionList={setting.leftAction} />)

	domAction.className = 'ssPluginLeftAction'
	contentDom.appendChild(domAction)

	// ;[...setting.leftAction].reverse().forEach(item => addOneLeftAction(app, item))
}
const addOneLeftAction = (app, leftAction: LeftAction) => {
	const domA = document.createElement('a')
	domA.className = 'view-action ssPluginLeftAction'
	domA.appendChild(getIconSvg(leftAction.icon))
	domA.addEventListener('click', () => {
		executeObsidianCommand(app, leftAction.command.split('&&')[0])
	})
	Array.from(document.querySelectorAll('.workspace .view-header .view-actions')).forEach(dom => {
		dom.prepend(domA)
	})
}
