// @ts-nocheck
import {render} from 'preact'
import * as React from 'preact/compat'
import {getFileTypeByFile, Table} from './components/Table'
import {addSsAction} from './utils/utils'
import {TestBox} from './components/Test'

export const addRefresh = (app, fn) => {
	if (app?.ssAction?.renderReactRefreshTool?.list) {
		app?.ssAction?.renderReactRefreshTool?.list.push(fn)
	}
}

export const refresh = (app) => {
	setTimeout(() => {
		if (app?.ssAction?.renderReactRefreshTool?.list) {
			app?.ssAction?.renderReactRefreshTool?.list?.forEach(item => {
				item?.()
			})
		}
	}, 200)
}
export const initRenderReact = (that) => {
	that.registerPriorityCodeblockPostProcessor('ssReact', -100, async (source, el, ctx) => {
			try {
				eval(`var params = ${source}`)
				renderReact(params, el)
			} catch (e) {
				console.log(e)
			}
		},
	)
	addSsAction(that.app, {
		getFileTypeByFile,
		renderReactRefreshTool: {
			list: [],
			refresh: () => refresh(that.app),
		},
	})
}
const comObj = {
	table: (render, el, props) => render(com(props), el),
	testBox: TestBox,
}
export const renderReact = (props: any = {}, el: HTMLElement) => {
	const {name} = props
	if (name === 'testBox') {
		render(<TestBox {...props} />, el)
		return
	}
	if (name === 'table') {
		render(<Table {...props} />, el)
		return
	}
	render(<Table {...props} />, el)
}
