import React, {useEffect, useState} from 'react'
import {getDataviewApi} from '../utils/utils'
import {css, cx} from '@emotion/css'
import {Markdown} from '../utils/Markdown'
import {MarkdownBox} from './Table'
import moment from 'moment'

const getData = (pathName: string) => {
	const dataApi = getDataviewApi()
	return dataApi.pages(`"pages/工具/${pathName}/data"`)
}
export const DataTool = (props: any) => {
	const [data, setData] = useState([])

	const dataApi = getDataviewApi()
	const {pathName, footFn} = props
	useEffect(() => {
		const data = getData(pathName)
		setData(data)
	}, [])

	return <div>
		<div className={css`
		display: grid;
		grid-auto-flow: row;
		grid-template-columns: 2fr 2fr 1fr max-content;
		align-items: stretch;
		grid-row-gap: 8px;
		padding-bottom: 8px;

		.link {
			position: relative;
			cursor: pointer;

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
						<Markdown content={`[${d.date}](${d.file.path})`}
								  sourcePath={d.file.path}/>
					</MarkdownBox>
					<a className={cx('link')}>{d.record}</a>
					<a className={cx('link')}>{d.money}</a>
					<a className={cx('link')}></a>
				</React.Fragment>
			))
		}</div>
		<div>{(typeof footFn === 'function' && data) && footFn(Array.from(data), dataApi)}</div>
	</div>
}
