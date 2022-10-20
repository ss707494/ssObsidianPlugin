// @ts-nocheck
import React, {useEffect, useState} from 'react'
import {getMetaedit} from '../utils/utils'
import {css} from '@emotion/css'
import {getFileList} from './Table'
import moment from 'moment'
import {addRefresh} from '../render'

type TypeItem = {
	type: string
	number: number
}
type DoDataItem = {
	type: string
	finishDate: string
}
const finishDate = 'finishDate'
const createDayFile = async (folderStr: string, typeList: TypeItem[]) => {
	typeList.forEach(type => {
		[...Array(type.number).keys()].forEach(num => {
			app.vault.create(`${folderStr}/${type.type}xx${num}.md`, `---
type: ${type.type}
${finishDate}:
---
`)
		})
	})
}
const getHistoryData = async () => {
	const historyDir = app.vault.getAbstractFileByPath('lib/工具/打卡/data')?.children?.filter(v => v.name !== moment().format('YYYY_MM_DD'))
	return historyDir.reduce(async (pre, cur) => {
		const hisList = await getFileList(cur.path) as DoDataItem[]
		return [
			...(await pre),
			...hisList.filter(v => !v.finishDate),
		]
	}, Promise.resolve([]))
}
const getData = async () => {
	const folderStr = `lib/工具/打卡/data/${moment().format('YYYY_MM_DD')}`
	const typeList = (await getFileList('lib/工具/打卡')) as TypeItem[]
	if (!await app.vault.exists(folderStr)) {
		await app.vault.createFolder(folderStr)
		await createDayFile(folderStr, typeList)
		await new Promise(resolve => setTimeout(resolve, 3000))
	}
	const doDataList = await getFileList(folderStr) as DoDataItem[]
	return {
		typeList,
		doDataList,
	}
}
export const DidaTool = (props: any) => {
	const [doDataList, setDoDataList] = useState<DoDataItem[]>([])
	const [hisDataList, setHisDataList] = useState<DoDataItem[]>([])
	const [showHisDetail, showHisDetailSet] = useState(false)
	const [typeList, setTypeList] = useState<TypeItem[]>([])
	const {metaApi} = getMetaedit(app)

	const dealListDataCount = (doDataList) => {
		return doDataList.reduce((previousValue, currentValue) => {
			return {
				...previousValue,
				[currentValue.type]: {
					...previousValue[currentValue.type] ?? {
						type: currentValue.type,
					},
					number: (previousValue[currentValue.type]?.number ?? 0) + 1,
				},
			}
		}, {})
	}
	const finishData = dealListDataCount(doDataList.filter(v => v.finishDate))
	const hisDataObjCount = dealListDataCount(hisDataList)
	const getDataRefresh = () => {
		getData().then(({
							doDataList,
							typeList,
						}) => {
			setDoDataList(doDataList)
			setTypeList(typeList)
		})
		setTimeout(async () => {
			const hisDataList = await getHistoryData() as DoDataItem[]
			setHisDataList(hisDataList)
		}, 0)
	}

	useEffect(() => {
		getDataRefresh()
		addRefresh(app, getDataRefresh)
	}, [])

	const doFinish = async (file) => {
		await metaApi.update(finishDate, moment().format('YYYY/MM/DD HH:mm'), file.path)
		setTimeout(getDataRefresh, 800)
	}
	const revert = async (type: string) => {
		const file = doDataList.filter(doData => doData.type === type && doData.finishDate).sort((a, b) => moment(b.finishDate).valueOf() - moment(a.finishDate).valueOf())[0]
		if (file?.file?.path) {
			await metaApi.update(finishDate, null, file?.file?.path)
			setTimeout(getDataRefresh, 800)
		}
	}

	return <div>
		<div className={css`
			padding: 8px 0;
		`}>
			<span className={css`
				margin-left: 1px;
			`}>已完成:
				{Object.keys(finishData).map(key => <span
					key={`key${key}`}
					onClick={() => revert(key)}
					className={css`
						padding: 0 2px;
					`}><span className={css`
					color: aqua;
				`}>{finishData[key]?.number}</span>{finishData[key]?.type}</span>)}
			</span>
		</div>
		{typeList.map(type => <div
			className={css`
				display: grid;
				grid-template-columns: repeat(5, 1fr);
			`}
			key={`list${type.type}`}>
			{doDataList.filter(doData => doData.type === type.type && !doData.finishDate).map(doData =>
				<a
					className={css`padding: 3px 0`}
					onClick={() => doFinish(doData.file)}
					key={`${type}${doData.file?.name}`}>
					{type.type}
				</a>)}
		</div>)}
		{!!hisDataList?.length ? <div
			className={css`
				display: grid;
				${showHisDetail ? 'grid-template-columns: repeat(5, 1fr);' : ''}
			`}
		>
			{!showHisDetail ? <div
				className={css`padding: 3px 0`}
				onClick={() => showHisDetailSet(true)}
			>历史未完成:
				{Object.keys(hisDataObjCount).map(key => <span
					key={`key${key}`}
					onClick={() => revert(key)}
					className={css`
						padding: 0 2px;
					`}><span className={css`
					color: aqua;
				`}>{hisDataObjCount[key]?.number}</span>{hisDataObjCount[key]?.type}</span>)}
			</div> : <>
				<div
					className={css`padding: 3px 0`}
					onClick={() => showHisDetailSet(false)}
				>历史</div>
				{hisDataList.filter(doData => !doData.finishDate).map(doData =>
					<a
						className={css`padding: 3px 0`}
						onClick={() => doFinish(doData.file)}
						key={`his${doData.file?.path}`}>
						{doData.type}
					</a>)}
			</>}
		</div> : null}
	</div>
}
