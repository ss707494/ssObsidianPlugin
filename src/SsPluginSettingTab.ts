import {App, PluginSettingTab, Setting} from 'obsidian'
import SsPlugin from '../main'
import {GenericTextSuggester} from './utils/genericTextSuggester'
import {newIcons} from './utils/icon'

export class SsPluginSettingTab extends PluginSettingTab {
	plugin: SsPlugin

	constructor(app: App, plugin: SsPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): any {
		const {containerEl} = this
		containerEl.empty()
		containerEl.createEl('h2', {text: 'LeftAction'});

		if (this.plugin.settings.leftAction?.length) {
			this.plugin.settings.leftAction.forEach((item, index) => {
				new Setting(containerEl)
					.setName(`command num ${index + 1}`)
					.setDesc('Add an Obsidian command')
					.addText(textComponent => {
						// @ts-ignore
						new GenericTextSuggester(this.app, textComponent.inputEl, Object.keys(this.app.commands.commands).map(v => `${this.app.commands.commands[v].id}&&${this.app.commands.commands[v].name}`));
						textComponent
							.setValue(this.plugin.settings.leftAction[index].command)
							.onChange(async (value) => {
								this.plugin.settings.leftAction[index].command = value
								await this.plugin.saveSettings()
								})
						},
					)
				new Setting(containerEl)
					.setName(`说明 num ${index + 1}`)
					.setDesc('chose desc')
					.addText(textComponent => {
							// @ts-ignore
							textComponent
								.setValue(this.plugin.settings.leftAction[index].desc)
								.onChange(async (value) => {
									this.plugin.settings.leftAction[index].desc = value
									await this.plugin.saveSettings()
								})
						},
					)
				// new Setting(containerEl)
				// 	.setName(`icon num ${index + 1}`)
				// 	.setDesc('chose icon')
				// 	.addText(textComponent => {
				// 			// @ts-ignore
				// 			new GenericTextSuggester(this.app, textComponent.inputEl, iconList);
				// 			textComponent
				// 				.setValue(this.plugin.settings.leftAction[index].icon)
				// 				.onChange(async (value) => {
				// 					this.plugin.settings.leftAction[index].icon = value
				// 					await this.plugin.saveSettings()
				// 				})
				// 		},
				// 	)
			})
		}
		new Setting(containerEl)
			.addButton(component => {
				component.setIcon('plus-with-circle')
					.onClick(async () => {
						this.plugin.settings.leftAction = [
							...(this.plugin.settings?.leftAction || []),
							{
								icon: '',
								command: '',
								desc: '',
							}
						]
						await this.plugin.saveSettings()
						this.display()
					})
			})
	}

	async hide() {
		this.plugin.settings.leftAction = this.plugin.settings?.leftAction?.filter(v => v.command && v.desc)
		await this.plugin.saveSettings()

		return super.hide()
	}

}
