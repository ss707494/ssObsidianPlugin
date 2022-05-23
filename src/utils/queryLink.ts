// @ts-nocheck
import {App} from 'obsidian'
import {addSsAction} from './utils'

export const initQuery = (app: App) => {
	addSsAction(app, {
		queryLink,
	})
}

const keyMap = [
	'F','D','S','A','J','K','L',';','G','H','Q','W','E','R','T','Y','U','I','O','P','Z','X','C','V','B','N','M','5','6','4','7','3','8','2','9','1',
]

const clear = (links) => {
	links.forEach(node => {
		node.querySelector('p')?.remove()
	})
}
export const queryLink = () => {
	if (!document) return
	const mode = app.workspace.activeLeaf.view.getState().mode
	const boxClass = `markdown-${mode === 'source' ? 'source' : 'reading'}-view`
	const links = [
		...Array.from(document.querySelectorAll(`.${boxClass} a.internal-link, .${boxClass} .block-language-ssReact .ssPluginBtn`)),
	]
	links.slice(0, keyMap.length).forEach((node, index) => {
		node.addClass('ssQueryLinkBox')
		const pDom = document.createElement('p')
		pDom.innerHTML = `${keyMap[index]}`
		pDom.id = `ssQueryLinkP_${keyMap[index]}`
		node.appendChild(pDom)
	})
	const doAction = (event) => {
		clear(links)
		const findIndex = keyMap.findIndex(v => `${event.key}`.toLocaleLowerCase() === v.toLocaleLowerCase())
		if (findIndex > -1) {
			links[findIndex]?.click()
		}
		document.body.removeEventListener('keyup', doAction, false)
	}
	setTimeout(() => {
		document.body.addEventListener('keyup', doAction, false);
	}, 400)
}
