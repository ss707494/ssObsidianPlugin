// @ts-nocheck
import * as React from 'preact/compat'
import {getMetaedit} from '../utils/utils'

export const TestBox = (props: any) => {
	const dataViewApi = app.plugins.plugins.dataview.api
	const {metaApi} = getMetaedit(app)
	return <div>
		<button
			onClick={async () => {
				const pages = dataViewApi.pages('"归档"')
				// pages.map(async (v) => {
				// 	metaApi.createYamlProperty('pageType', '便签', v.file.path)
				// 	console.log(v)
				// 	// if (v.file.path) {
				// 	// 	await doFinish(v.file.path)
				// 	// }
				// })
			}}
		>批量移动</button>
	</div>
}
