import React, {useState} from 'react'
import {css} from '@emotion/css'
import {FootballSvg} from '../svg/football'
import {LeftAction} from '../../main'
import {executeObsidianCommand} from './utils'

export const LeftActionButton = ({actionList}: { actionList: LeftAction[] }) => {
	const [showAction, showActionSet] = useState(false)

	if (!showAction) {
		return <div
			onClick={() => {
				showActionSet(true)
			}}
			className={css`
				& svg {
					width: 44px;
					height: 44px;
				}
			`}
		>
			<FootballSvg/>
		</div>
	}
	const box = css`
		padding: 12px;
		background: rgba(126, 119, 119, 0.81);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	`
	return <div className={css`
	`}>
		<div
			className={css`
				${box};
			`}
			onClick={() => showActionSet(false)}
		>
			close
		</div>
		{actionList.map((action) => <div
			key={`action${action.command}${action.desc}`}
			className={css`
				margin-top: 18px;
				${box};
			`}
			onClick={() => {
				showActionSet(false)
				executeObsidianCommand(app, action.command.split('&&')[0])
			}}
		>
			{action.desc}
		</div>)}
	</div>
}
