// @ts-nocheck

import {DakaData} from './daka'

const sqlDataName = {
	daka: 'daka'
}
type SqlData = {
	daka: DakaData
}


export const getDatabase = async (name: keyof typeof sqlDataName) => {
	return JSON.parse(await app.vault.read(await app.vault.getAbstractFileByPath(`lib/database/${name}.json`))) as SqlData[typeof name]
}

export const setDatabase = async (name: keyof sqlDataName, data: any) => {
	await app.vault.modify(await app.vault.getAbstractFileByPath(`lib/database/${name}.json`), JSON.stringify(data))
}

export const dealOldData = async () => {
	// const historyDir = app.vault.getAbstractFileByPath('lib/工具/打卡/data')?.children
	// const his = await historyDir.reduce(async (pre, cur) => {
	// 	const hisList = await getFileList(cur.path) as DoDataItem[]
	// 	return [
	// 		...(await pre),
	// 		...hisList,
	// 	]
	// }, Promise.resolve([]))
	// const allData = his.map(v => {
	// 	return {
	// 		name: v.file.basename,
	// 		finishDate: v.finishDate,
	// 		type: v.type,
	// 		ctime: v.file.stat.ctime,
	// 		date: v.file.parent.name,
	// 		id: uuid(),
	// 	}
	// })
	// console.log(allData)
	// setDatabase('daka', {
	// 	dakaList: allData.filter(v => !v.finishDate),
	// 	finishList: allData.filter(v => v.finishDate),
	// })

}
export const databaseInit = async () => {
	const dakaContent = await getDatabase('daka')
	console.log(dakaContent)
}
