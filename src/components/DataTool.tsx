import React, {useEffect, useState} from 'react'
import {getDataviewApi} from '../utils/utils'
import {css, cx} from '@emotion/css'
import {Markdown} from '../utils/Markdown'
import {getFileList, MarkdownBox} from './Table'
import moment from 'moment'

const getData = async (pathName: string) => {
	return await getFileList(`lib/工具/${pathName}/data`)
}
export const DataTool = (props: any) => {
	const {pathName, footFn, column} = props
	const [primaryKey, ...restColumn] = column ?? ['date', 'record', 'money']
	const [data, setData] = useState([])

	const dataApi = getDataviewApi()
	useEffect(() => {
		getData(pathName).then(data => {
			setData(data)
		})
	}, [])

	return <div>
		<div className={css`
		display: grid;
		grid-auto-flow: row;
		grid-template-columns: repeat(${column?.length ?? 3}, minmax(max-content, 1fr));
		align-items: stretch;
		grid-row-gap: 8px;
		padding-bottom: 8px;
		.link {
			position: relative;
			cursor: pointer;
			padding-left: 4px;
			&:after {
				content: '';
				height: 1px;
				width: 100%;
				background: rgba(135, 213, 110, 0.11);
				position: absolute;
				left: 0;
				bottom: -4px;
			}

		}
	`}>{
			data.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()).map(d => (
				<React.Fragment key={`dataList${d.file.path}`}>
					<MarkdownBox className={css`&&&:after {
					width: 100%
				}`}>
						<Markdown content={`[${d[primaryKey]}](${d.file.path})`}
								  sourcePath={d.file.path}/>
					</MarkdownBox>
					{restColumn.map((columnKey: any) => <a key={`column${columnKey}`} className={cx('link')}>{d[columnKey]}</a>)}
				</React.Fragment>
			))
		}</div>
		<div>{(typeof footFn === 'function' && data) && footFn(Array.from(data), dataApi)}</div>
	</div>
}
