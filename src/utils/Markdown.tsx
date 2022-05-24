import {MarkdownRenderer} from 'obsidian'
import React, {useEffect, useRef} from 'react'

export function Markdown({
							 content,
							 sourcePath,
							 inline = true,
						 }: {
	content: string;
	sourcePath: string;
	inline?: boolean;
}) {
	const container = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!container.current) return;

		container.current.innerHTML = "";
		MarkdownRenderer.renderMarkdown(content, container.current, sourcePath, null).then(() => {
			if (!container.current || !inline) return;

			// Unwrap any created paragraph elements if we are inline.
			let paragraph = container.current.querySelector("p");
			while (paragraph) {
				let children = paragraph.childNodes;
				paragraph.replaceWith(...Array.from(children));
				paragraph = container.current.querySelector("p");
			}
		});
	}, [content, sourcePath, container.current]);

	return <span ref={container} />;
}
