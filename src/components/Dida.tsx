// @ts-nocheck
import React, {useEffect, useState} from 'react'
import {getMetaedit} from '../utils/utils'
import {css} from '@emotion/css'
import {getFileList} from './Table'
import moment from 'moment'
import {addRefresh} from '../render'
import {getDatabase, setDatabase} from '../database/databaseInit'
import {pick, Promise, toDate, uuid} from 'licia'

type TypeItem = {
	type: string
	number: number
}
type DoDataItem = {
	type: string
	finishDate: string
	id: any
	name: string
}
const finishDate = 'finishDate'
const createDayFile = async (typeList: TypeItem[]) => {
	const res = await getDatabase('daka')
	const todayStr = moment().format('YYYY_MM_DD')

	await setDatabase('daka', {
		...res,
		dakaList: [
			...res.dakaList,
			...typeList.reduce((previousValue, currentValue) => {
				return [
					...previousValue,
					...[...Array(currentValue.number).keys()].map(num => ({
						name: `${currentValue.type}xx${num}`,
						finishDate: null,
						type: currentValue.type,
						ctime: moment().valueOf(),
						date: todayStr,
						id: uuid(),
					})),
				]
			}, []),
		],
	})
	await new Promise(resolve => setTimeout(resolve, 100))
}
const getData = async () => {
	const typeList = (JSON.parse(await app.vault.read(await app.vault.getAbstractFileByPath(`lib/工具/打卡/config.md`)))) as TypeItem[]

	const {history = [], today = [], todayFinish = []} = await getTodoDatabase()
	return {
		typeList,
		history,
		today,
		todayFinish,
	}
}
const getTodoDatabase = async () => {
	const res = await getDatabase('daka')
	const todayStr = moment().format('YYYY_MM_DD')
	return {
		todayFinish: res?.finishList?.filter(v => v.date === todayStr),
		...res.dakaList?.reduce((previousValue, currentValue) => {
			if (currentValue.date === todayStr) {
				return {
					...previousValue,
					today: [
						...(previousValue.today ?? []),
						currentValue,
					],
				}
			} else if (!currentValue.finishDate) {
				return {
					...previousValue,
					history: [
						...(previousValue.history ?? []),
						currentValue,
					],
				}
			}
			return previousValue
		}, {}),
	}
}
export const DidaTool = (props: any) => {
	const [todayFinish, setTodayFinish] = useState<DoDataItem[]>([])
	const [doDataList, setDoDataList] = useState<DoDataItem[]>([])
	const [hisDataList, setHisDataList] = useState<DoDataItem[]>([])
	const [showHisDetail, showHisDetailSet] = useState(false)
	const [typeList, setTypeList] = useState<TypeItem[]>([])

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
	const todayFinishData = dealListDataCount(todayFinish)
	const hisDataObjCount = dealListDataCount(hisDataList)

	const getDataRefresh = async () => {
		getData().then(({
							typeList,
							history,
							today,
							todayFinish,
						}) => {
			if (app.isMobile && today?.length === 0 && todayFinish?.length === 0) {
				createDayFile(typeList).then(() => {
					getDataRefresh()
				})
			} else {
				setTypeList(typeList)
				setDoDataList(today)
				setHisDataList(history)
				setTodayFinish(todayFinish)
			}
		})
	}

	const deal = async () => {
		// const res = await getDatabase('daka')
		// console.log(res)
		// const todayStr = moment().format('YYYY_MM_DD')
		// await setDatabase('daka', {
		// 	dakaList: res.dakaList.filter(v => v.date !== todayStr),
		// 	finishList: res.finishList.filter(v => v.date !== todayStr),
		// })
		// await app.vault.modify(await app.vault.getAbstractFileByPath(`lib/database/${name}.json`), JSON.stringify(data))

	}
	useEffect(() => {
		deal()
		getDataRefresh()
		addRefresh(app, getDataRefresh)
	}, [])

	const doFinish = async (data: TypeItem) => {
		const res = await getDatabase('daka')
		await setDatabase('daka', {
			dakaList: res.dakaList.filter(v => v.id !== data.id),
			finishList: [
				...res.finishList,
				{
					...data,
					finishDate: moment().format('YYYY/MM/DD HH:mm'),
				},
			],
		})
		setTimeout(getDataRefresh, 100)
	}
	const revert = async (type: string, date: string) => {
		const res = await getDatabase('daka')
		const item = res.finishList?.filter(v => {
			if (date) {
				return v.type === type && v.date === date
			} else {
				const todayStr = moment().format('YYYY_MM_DD')
				return v.type === type && v.date !== todayStr
			}
		})?.sort((a, b) => moment(b.finishDate).valueOf() - moment(a.finishDate).valueOf())[0]
		await setDatabase('daka', {
			dakaList: [
				...res.dakaList,
				{
					...item,
					finishDate: null,
				},
			],
			finishList: [
				...res.finishList.filter(v => v.id !== item.id),
			],
		})
		setTimeout(getDataRefresh, 100)
	}


	return <div>
		<div className={css`
			padding: 8px 0;
		`}>
			<span className={css`
				margin-left: 1px;
			`}>已完成:
				{Object.keys(todayFinishData).map(key => <span
					key={`key${key}`}
					onClick={() => revert(key)}
					className={css`
						padding: 0 2px;
					`}><span className={css`
					color: aqua;
				`}>{todayFinishData[key]?.number}</span>{todayFinishData[key]?.type}</span>)}
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
					onClick={() => doFinish(doData)}
					key={`${type}${doData.name}${doData.id}`}>
					{type.type}
				</a>)}
		</div>)}
		{!!hisDataList?.length ? <div
			className={css`
				display: grid;
				${showHisDetail ? 'grid-template-columns: repeat(5, 1fr);' : ''}
			`}
		>
			{!showHisDetail ? <div className={css`
				padding: 3px 0;
				display: flex;
			`}>
				<div
					className={css`
padding-right: 8px;
						`}
					onClick={() => showHisDetailSet(true)}
				>历史未完成:</div>
				{Object.keys(hisDataObjCount).map(key => <span
					key={`key${key}`}
					onClick={() => revert(key)}
					className={css`
						padding: 0 4px;
					`}><span className={css`
					color: aqua;
				`}>{hisDataObjCount[key]?.number}</span>{hisDataObjCount[key]?.type}</span>)}
			</div> : <>
				<div
					className={css`padding: 3px 0`}
					onClick={() => showHisDetailSet(false)}
				>历史
				</div>
				{hisDataList.map(doData =>
					<a
						className={css`padding: 3px 0`}
						onClick={() => doFinish(doData)}
						key={`his${doData.id}`}>
						{doData.type}
					</a>)}
			</>}
		</div> : null}
	</div>
}
