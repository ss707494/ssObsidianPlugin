import {MarkdownPostProcessorContext, Plugin} from 'obsidian'
import {initRenderReact, refresh} from './src/render'
import {initHomePage} from './src/homePage'
import {initQuery, queryLink} from './src/utils/queryLink'
import {renameFileQuick} from './src/utils/utils'
import {SsPluginSettingTab} from './src/SsPluginSettingTab'
import {addLeftAction} from './src/utils/leftAction'
import {initAnki} from './src/anki/ankiTools'
import {initQuickActions} from './src/utils/quickActions'

export type LeftAction = {
	icon: string
	command: string
}

interface SsPluginSettings {
	ssSetting: string;
	leftAction: LeftAction[];
}

const DEFAULT_SETTINGS: SsPluginSettings = {
	ssSetting: 'default',
	leftAction: [],
}

export default class SsPlugin extends Plugin {
	settings: SsPluginSettings

	public registerPriorityCodeblockPostProcessor(
		language: string,
		priority: number,
		processor: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<void>,
	) {
		let registered = this.registerMarkdownCodeBlockProcessor(language, processor)
		registered.sortOrder = priority
	}

	async onload() {
		await this.loadSettings()
		initQuery(this.app)
		initHomePage(this.app, this)

		initRenderReact(this)

		initAnki(this.app, this)

		initQuickActions(this)

		this.addCommand({
			id: 'ss-plugins-queryLink',
			icon: 'Link2',
			name: 'ss-plugins-queryLink',
			callback: () => {
				queryLink()
			},
		})
		this.addCommand({
			id: 'ss-plugins-rename',
			icon: 'Edit2',
			name: 'quick rename',
			callback: () => {
				renameFileQuick()
			},
		})
		this.addCommand({
			id: 'ss-plugins-refresh',
			icon: 'RefreshCcw',
			name: 'refresh',
			callback: () => {
				refresh(app)
			},
		})

		this.registerInterval(window.setInterval(() => {
			// window.location.reload()
			refresh(app)
		}, 10 * 1000))

		this.addSettingTab(new SsPluginSettingTab(this.app, this))
		this.app.workspace?.onLayoutReady(() => {
			addLeftAction(app, this.settings)
			refresh(app)
		})
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
