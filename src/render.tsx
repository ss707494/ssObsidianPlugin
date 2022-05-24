// @ts-nocheck
import React from 'react'
import {getFileTypeByFile, Table} from './components/Table'
import {addSsAction} from './utils/utils'
import {TestBox} from './components/Test'
import {DataTool} from './components/DataTool'
import {createRoot} from 'react-dom/client'

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
	const root = createRoot(el)
	if (name === 'testBox') {
		root.render(<TestBox {...props} />)
		return
	}
	if (name === 'table') {
		root.render(<Table {...props} />)
		return
	}
	if (name === 'dataTool') {
		root.render(<DataTool {...props} />)
		return
	}
	root.render(<Table {...props} />)
}
