// @ts-nocheck
import React, {useEffect, useState} from 'react'
import {getMetaedit} from '../utils/utils'

export const TestBox = (props: any) => {
	const dataViewApi = app.plugins.plugins.dataview.api
	const {metaApi} = getMetaedit(app)
	const [arr, setArr] = useState([])
	useEffect(() => {
		Promise.all([
  app.ssAction.getFileList('pages/记录'),
  app.ssAction.getFileList('pages/知识'),
]).then(([l1, l2]) => [...l1, ...l2].sort((a,b) => moment(b.date).valueOf() - moment(a.date).valueOf()).map(v => v.file.name)).then(res => {
	setArr(res)
		})
	}, [])
	return <div>
		{app.ssAction.seedrandom(moment().format('YYYY/MM/DD'))()}
		{
			arr.map((v, i) => <div>{i}.{v}</div>)
		}
	</div>
}
