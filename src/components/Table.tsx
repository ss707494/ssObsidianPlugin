// @ts-nocheck
import React from 'react'
import {useEffect, useState} from 'react'
import {Markdown} from '../utils/Markdown'
// import styled from 'styled-components'
import styled from '@emotion/styled';
import {changeFileType, changeOneMeta, getMetaedit} from '../utils/utils'
import {addRefresh, refresh} from '../render'
import {selectDateValue} from '../anki/ankiTools'
import {quickActions} from '../utils/quickActions'
import moment from 'moment'
import {pick} from 'licia'

type TableProps = {
	query?: string
}

const Box = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: 8fr max-content;
	grid-gap: 8px;
	padding-bottom: 8px;
	align-items: stretch;
`
export const MarkdownBox = styled.div`
	position: relative;

	.internal-link {
		text-decoration: none;
		word-break: break-all;
	}

	&:after {
		content: '';
		height: 1px;
		width: calc(100% + 8px);
		background: rgba(135, 213, 110, 0.11);
		position: absolute;
		left: 0;
		bottom: -4px;
	}
`
const Actions = styled.div`
	display: grid;
	grid-auto-flow: column;
	align-items: stretch;
	position: relative;

	&:after {
		content: '';
		height: 1px;
		width: 100%;
		background: rgba(135, 213, 110, 0.11);
		position: absolute;
		left: 0;
		bottom: -4px;
	}

`
const Button = styled.a`
	min-width: 50px;
	display: grid;
	align-items: center;
	justify-items: center;
	cursor: pointer;
`
const IconButton = styled(Button)`
	min-width: 30px;
`
const Header = styled.div`
	font-size: large;
	font-weight: bold;
	padding: 12px 0;
`

const calcStoreKey = (title) => `tableDataStore${title}`

const getFileByPath = (path) => {
	if (Array.isArray(path)) {
		return path.reduce((pre, cur) => [
			...pre,
			...(app.vault.getAbstractFileByPath(cur)?.children ?? []),
		], [])?.filter(v => !v.children)
	}
	return app.vault.getAbstractFileByPath(path).children?.filter(v => !v.children)
}
export const getFileList = (path) => {
  const arr = Promise.all(getFileByPath(path).map(v => ({
    file: {
      ...v,
      name: v.basename,
      folder: v.parent.path,
    },
  })).map(v => new Promise(resolve => {
    app.plugins.plugins['metaedit'].api.getPropertiesInFile(v.file.path).then(meta => {
      resolve({
        ...v,
        ...meta.reduce((pre, cur) => ({
          ...pre,
          [cur.key]: cur.content,
        }), {}),
        meta,
      })
    })
  })))
  arr.__proto__.filter = function (filterFun) {
    return this.then(res => res.filter(filterFun))
  }
  return arr
}

export const getFileTypeByFile = (item) => {
	return item?.file?.folder?.replace('pages/', '')
}
export const Table = (props: TableProps) => {
	const {query, filter = {}, getDataFn, hideFileType, isReview, title = ''} = props
	const app: any = window.app
	const {properties} = getMetaedit(app)
	const dataViewApi = app.plugins.plugins.dataview.api
	const [pages, setPages] = useState([])
	const getData = async () => {
		if (title) {
			try {
				const cacheData = JSON.parse(localStorage.getItem(calcStoreKey(title)))
				if (cacheData?.length) {
					setPages(cacheData)
				}
			} catch (e) {}
		}
		let pages = await (getDataFn ? getDataFn(dataViewApi) : dataViewApi.pages(query ?? '"pages"'))
		const output = Array.from(pages)
			.filter(v => {
				return Object.keys(filter).every(key => {
					if (filter[key] === '!' && !v[key]) {
						return true
					}
					if (!v[key]) return false
					if (Array.isArray(filter[key])) {
						if (filter[key]?.includes(v[key])) {
							return true
						}
					} else {
						if (filter[key] === v[key]) {
							return true
						}
					}
					return false
				})
			})
			.sort((a,b) => moment(b.date).valueOf() - moment(a.date).valueOf())
		if (title) {
			localStorage.setItem(calcStoreKey(title), JSON.stringify(output?.map(item => ({
				...pick(item, ['review', 'type']),
				file: pick(item.file, ['name', 'path', 'folder'])
			}))))
		}
		setPages(output)
	}

	useEffect(() => {
    (async () => {
      await getData()
      addRefresh(app, getData)
    })()
	}, [])
	return (pages.length ? <>
		<Header>{title}</Header>
		<Box>
			{pages.map(v => (
				<React.Fragment key={`table${v.file.path}`}>
					<MarkdownBox>
						<Markdown content={`[[${v.file.name}]]`}
								  sourcePath={v.file.path}/>
					</MarkdownBox>
					<Actions>
						{isReview ? <>
								<Button
									onClick={async () => {
										await selectDateValue(v.file.path)
										refresh(app)
									}}
								>
									{v.review}
								</Button>
							</> :
							<>
								<Button
									onClick={async () => {
										await changeOneMeta(v.file.path, properties.find(v => v.name === 'type'), app)
										refresh(app)
									}}
								>
									{v.type}
								</Button>
								{!hideFileType && <Button
									onClick={async () => {
										await changeFileType(v.file.path, app)
										refresh(app)
									}}
								>{getFileTypeByFile(v)}</Button>}
							</>
						}
						<IconButton
							className={'ssPluginBtn'}
							onClick={async () => quickActions(v.file.path)}
						>
							<svg xmlns="http://www.w3.org/2000/svg"
								 width="17"
								 height="17"
								 viewBox="0 0 24 24"
								 fill="none"
								 stroke="currentColor"
								 strokeWidth="2"
								 strokeLinecap="round"
								 strokeLinejoin="round"
								 className="PenTool">
								<path d="M12 19l7-7 3 3-7 7-3-3z"></path>
								<path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
								<path d="M2 2l7.586 7.586"></path>
								<circle cx="11"
										cy="11"
										r="2"></circle>
							</svg>
						</IconButton>
					</Actions>
				</React.Fragment>
			))}
		</Box>
	</> : '')
}
