class CifraCollection extends Array {
	ready(callback) {
		const is_ready = this.some((e) => {
			return e.readyState != null && e.readyState != "loading"
		})

		if (is_ready) {
			callback()
		} else {
			this.on("DOMContentLoaded", callback)
		}

		return this
	}

	on(event, callback_selector, callback) {
		if (typeof callback_selector === "function") {
			this.forEach((e) => e.addEventListener(event, callback_selector))
		} else {
			this.forEach((elem) => {
				elem.addEventListener(event, (e) => {
					if (e.target.matches(callback_selector)) {
						callback(e)
					}
				})
			})
		}

		return this
	}

	trigger(event, bubbles = true, selector = false) {
		if (!selector) {
			this.forEach((e) => e.dispatchEvent(new Event(event, { bubbles: bubbles })))
		} else {
			this.forEach((elem) => {
				if (elem.target.matches(selector)) {
					elem.dispatchEvent(new Event(event, { bubbles: bubbles }))
				}
			})
		}

		return this
	}

	next(selector = null) {
		return this.map((e) => e.nextElementSibling).filter((e) => e != null && (selector == null || e.matches(selector)))
	}

	prev(selector = null) {
		return this.map((e) => e.previousElementSibling).filter((e) => e != null && (selector == null || e.matches(selector)))
	}

	after(selector = null) {
		return this.flatMap((e) => {
			let siblings = []
			let next = e.nextElementSibling

			while (next) {
				if (selector == null || next.matches(selector)) {
					siblings.push(next)
				}

				next = next.nextElementSibling
			}

			return siblings
		})
	}

	before(selector = null) {
		return this.flatMap((e) => {
			let siblings = []
			let prev = e.previousElementSibling

			while (prev) {
				if (selector == null || prev.matches(selector)) {
					siblings.push(prev)
				}

				prev = prev.previousElementSibling
			}

			return siblings
		}).reverse()
	}

	parent(selector = null) {
		return this.map((e) => e.parentElement).filter((e) => e != null && (selector == null || e.matches(selector)))
	}

	query(selector) {
		let results = []
		this.forEach((e) => {
			results = results.concat(Array.from(e.querySelectorAll(selector)))
		})

		return new CifraCollection(...results)
	}

	removeClass(class_name) {
		this.forEach((e) => e.classList.remove(class_name))
		return this
	}

	addClass(class_name) {
		this.forEach((e) => e.classList.add(class_name))
		return this
	}

	toggleClass(class_name) {
		this.forEach((e) => e.classList.toggle(class_name))
		return this
	}

	attr(attribute, value) {
		this.forEach((e) => e.setAttribute(attribute, value))
		return this
	}

	html(content) {
		this.forEach((e) => (e.innerHTML = content))
		return this
	}

	text(content) {
		this.forEach((e) => (e.textContent = content))
		return this
	}

	css(property, value) {
		this.forEach((e) => (e.style[property] = value))
		return this
	}

	append(content) {
		this.forEach((e) => {
			if (typeof content === "string") {
				e.insertAdjacentHTML("beforeend", content)
			} else {
				e.appendChild(content)
			}
		})

		return this
	}

	prepend(content) {
		this.forEach((e) => {
			if (typeof content === "string") {
				e.insertAdjacentHTML("afterbegin", content)
			} else {
				e.insertBefore(content, e.firstChild)
			}
		})

		return this
	}

	insertAfter(content) {
		this.forEach((e) => {
			if (typeof content === "string") {
				e.insertAdjacentHTML("afterend", content)
			} else {
				e.parentNode.insertBefore(content, e.nextSibling)
			}
		})

		return this
	}

	insertBefore(content) {
		this.forEach((e) => {
			if (typeof content === "string") {
				e.insertAdjacentHTML("beforebegin", content)
			} else {
				e.parentNode.insertBefore(content, e)
			}
		})

		return this
	}

	remove() {
		this.forEach((e) => {
			e.parentElement.removeChild(e)
		})

		return this
	}

	hide() {
		this.forEach((e) => {
			e.style.display = "none"
		})

		return this
	}

	show() {
		this.forEach((e) => {
			e.style.display = ""
		})

		return this
	}

	toggle() {
		this.forEach((e) => {
			if (e.style["display"] == "none") {
				e.style["display"] = ""
			} else {
				e.style["display"] = "none"
			}
		})

		return this
	}
}

const $ = (param = document.body) => {
	if (typeof param === "string") {
		return new CifraCollection(...document.querySelectorAll(param))
	} else {
		return new CifraCollection(param)
	}
}

$.observe = function (element, check, success) {
	const observer = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (check(node)) {
						success(node)
					}
				})
			}
		}
	})

	observer.observe(element, { childList: true, subtree: true })

	return observer
}

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
$.copy_fallback = function (text) {
	var textArea = document.createElement("textarea")
	textArea.value = text

	textArea.style.top = "0"
	textArea.style.left = "0"
	textArea.style.position = "fixed"

	document.body.appendChild(textArea)
	textArea.focus()
	textArea.select()

	try {
		var successful = document.execCommand("copy")
		var msg = successful ? "successful" : "unsuccessful"
		console.log("Fallback: Copying text command was " + msg)
	} catch (err) {
		console.error("Fallback: Oops, unable to copy", err)
	}

	document.body.removeChild(textArea)
}

$.copy = function (text) {
	if (!navigator.clipboard) {
		$.copy_fallback(text)
		return
	}

	navigator.clipboard.writeText(text).then(console.log, (err) => {
		console.error("Error: Could not copy text: ", err)
	})
}

$.addStyle = function (styles) {
	const styleElement = document.createElement("style")
	styleElement.type = "text/css"

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = styles
	} else {
		styleElement.appendChild(document.createTextNode(styles))
	}

	document.head.appendChild(styleElement)
}

$.create = function (tagName, options = {}) {
	const { attributes = {}, events = {}, innerHTML = "", children = [] } = options

	let match = /^(?<tag>[a-z]+)(?<id>#\w+)?(?<classes>(\.\w+)*)$/i.exec(tagName)

	if (!match) {
		throw new Error("Invalid tag format")
	}

	const { tag, id, classes } = match.groups

	const element = document.createElement(tag)

	if (id) {
		element.id = id.slice(1)
	}

	if (classes) {
		element.className = classes
			.split(".")
			.filter((cls) => cls)
			.join(" ")
	}

	for (const [attr, value] of Object.entries(attributes)) {
		element.setAttribute(attr, value)
	}

	for (const [type, callback] of Object.entries(events)) {
		element.addEventListener(type, callback)
	}

	element.innerHTML = innerHTML

	for (const child of children) {
		$(element).append(child)
	}

	return element
}

$.empty = function (element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild)
	}
}

$.clone = function (element) {
	return element.cloneNode(true)
}

$.attr = function (element, attribute, value) {
	if (value === undefined) {
		return element.getAttribute(attribute)
	} else {
		element.setAttribute(attribute, value)
	}
}

$.prop = function (element, property, value) {
	if (value === undefined) {
		return element[property]
	} else {
		element[property] = value
	}
}

$.dataset = function (element, key, value) {
	if (value === undefined) {
		return element.dataset[key]
	} else {
		element.dataset[key] = value
	}
}

$.notify = function (message, type = "default") {
	let notification = $.create("div", { attributes: { class: "CifraNotification show" }, innerHTML: message })

	let classes = { default: "CifraDefault", success: "CifraSuccess", danger: "CifraDanger", warning: "CifraWarning", info: "CifraInfo" }

	notification.classList.add(classes[type])

	setTimeout(
		(e) => {
			$(e).addClass("hide")
			setTimeout(
				(e) => {
					$(e).remove(e)
				},
				250,
				e
			)
		},
		2000,
		notification
	)

	$("#CifraNotificationContainer").append(notification)
}

$.bind = function (key, callback) {
	document.addEventListener("keyup", function (event) {
		if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA" || event.target.isContentEditable) {
			return
		}

		if (event.key.toLowerCase() === key.toLowerCase()) {
			event.preventDefault()
			callback()
		}
	})
}

$.storage = {
	get(key, defaultValue = null) {
		let value = localStorage.getItem(key)
		return value ? value : defaultValue
	},
	set(key, value) {
		return localStorage.setItem(key, value)
	},
	remove(key) {
		return localStorage.removeItem(key)
	},
	clear() {
		return localStorage.clear()
	},
}

$.download = function (filename, content, mime = "text/plain") {
	let blob = new Blob([content], { type: mime + "charset=utf-8" })
	let url = URL.createObjectURL(blob)

	let el = $.create("a", {
		attributes: {
			href: url,
			download: filename,
		},
	})
	$(el).css("display", "none")

	document.body.appendChild(el)
	el.click()
	document.body.removeChild(el)

	URL.revokeObjectURL(url)
}

document.addEventListener("DOMContentLoaded", () => {
	$.addStyle(
		"#CifraNotificationContainer{position:fixed;top:20px;right:20px;display:flex;flex-direction:column;align-items:end}.CifraNotification{min-width:150px;width:fit-content;padding:10px 20px;display:flex;align-items:center;z-index:999999;margin-bottom:10px;color:#000;border:1px solid #44444444;border-right:5px solid #444;border-radius:5px;box-shadow:0 2px 3px rgba(0,0,0,.5);font-family:Arial,sans-serif}.CifraNotification.CifraSuccess{border-right:5px solid #3bc574;background-color:#d3f2e0}.CifraNotification.CifraDanger{border-right:5px solid #be253a;background-color:#f2d3d8}.CifraNotification.CifraWarning{border-right:5px solid #ffc500;background-color:#fff3cc}.CifraNotification.CifraInfo{border-right:5px solid #257bbe;background-color:#d3e5f2}@keyframes slideIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}@keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100%)}}.CifraNotification.show{animation:.5s forwards slideIn}.CifraNotification.hide{animation:.25s forwards slideOut}"
	)
	$(document.body).append($.create("div", { attributes: { id: "CifraNotificationContainer" } }))
})
