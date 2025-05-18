var app = (function () {
	'use strict';

	/** @returns {void} */
	function noop$1() {}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	let src_url_equal_anchor;

	/**
	 * @param {string} element_src
	 * @param {string} url
	 * @returns {boolean}
	 */
	function src_url_equal(element_src, url) {
		if (element_src === url) return true;
		if (!src_url_equal_anchor) {
			src_url_equal_anchor = document.createElement('a');
		}
		// This is actually faster than doing URL(..).href
		src_url_equal_anchor.href = url;
		return element_src === src_url_equal_anchor.href;
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	var global$1 = (typeof global !== "undefined" ? global :
	  typeof self !== "undefined" ? self :
	  typeof window !== "undefined" ? window : {});

	/** @type {typeof globalThis} */
	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: // @ts-ignore Node typings have this
			  global$1;

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @returns {void} */
	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @template {keyof SVGElementTagNameMap} K
	 * @param {K} name
	 * @returns {SVGElement}
	 */
	function svg_element(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @returns {Text} */
	function empty() {
		return text('');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @returns {(event: any) => any} */
	function prevent_default(fn) {
		return function (event) {
			event.preventDefault();
			// @ts-ignore
			return fn.call(this, event);
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data(text, data) {
		data = '' + data;
		if (text.data === data) return;
		text.data = /** @type {string} */ (data);
	}

	/**
	 * @returns {void} */
	function set_input_value(input, value) {
		input.value = value == null ? '' : value;
	}

	/**
	 * @returns {void} */
	function set_style(node, key, value, important) {
		{
			node.style.setProperty(key, value, '');
		}
	}

	/**
	 * @returns {void} */
	function toggle_class(element, name, toggle) {
		// The `!!` is required because an `undefined` flag means flipping the current state.
		element.classList.toggle(name, !!toggle);
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	/**
	 * Schedules a callback to run immediately before the component is unmounted.
	 *
	 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	 * only one that runs inside a server-side component.
	 *
	 * https://svelte.dev/docs/svelte#ondestroy
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
	}

	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](https://svelte.dev/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
	 * ```ts
	 * const dispatch = createEventDispatcher<{
	 *  loaded: never; // does not take a detail argument
	 *  change: string; // takes a detail argument of type string, which is required
	 *  optional: number | null; // takes an optional detail argument of type number
	 * }>();
	 * ```
	 *
	 * https://svelte.dev/docs/svelte#createeventdispatcher
	 * @template {Record<string, any>} [EventMap=any]
	 * @returns {import('./public.js').EventDispatcher<EventMap>}
	 */
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail, { cancelable = false } = {}) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
				callbacks.slice().forEach((fn) => {
					fn.call(component, event);
				});
				return !event.defaultPrevented;
			}
			return true;
		};
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	/** @returns {void} */
	function add_flush_callback(fn) {
		flush_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @returns {void} */
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}

	/**
	 * @returns {void} */
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	/** @returns {void} */
	function bind(component, name, callback) {
		const index = component.$$.props[name];
		if (index !== undefined) {
			component.$$.bound[index] = callback;
			callback(component.$$.ctx[index]);
		}
	}

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop$1,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop$1;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop$1;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	const PUBLIC_VERSION = '4';

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	// Material Design Icons v7.4.47
	var mdiCamera = "M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z";
	var mdiCameraOff = "M1.2,4.47L2.5,3.2L20,20.72L18.73,22L16.73,20H4A2,2 0 0,1 2,18V6C2,5.78 2.04,5.57 2.1,5.37L1.2,4.47M7,4L9,2H15L17,4H20A2,2 0 0,1 22,6V18C22,18.6 21.74,19.13 21.32,19.5L16.33,14.5C16.76,13.77 17,12.91 17,12A5,5 0 0,0 12,7C11.09,7 10.23,7.24 9.5,7.67L5.82,4H7M7,12A5,5 0 0,0 12,17C12.5,17 13.03,16.92 13.5,16.77L11.72,15C10.29,14.85 9.15,13.71 9,12.28L7.23,10.5C7.08,10.97 7,11.5 7,12M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9Z";
	var mdiConnection = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z";
	var mdiFullscreen = "M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z";
	var mdiFullscreenExit = "M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z";
	var mdiPause = "M14,19H18V5H14M6,19H10V5H6V19Z";
	var mdiPlayPause = "M3,5V19L11,12M13,19H16V5H13M18,5V19H21V5";
	var mdiRecord = "M19,12C19,15.86 15.86,19 12,19C8.14,19 5,15.86 5,12C5,8.14 8.14,5 12,5C15.86,5 19,8.14 19,12Z";
	var mdiStop = "M18,18H6V6H18V18Z";

	/* node_modules\mdi-svelte\src\Index.svelte generated by Svelte v4.2.19 */

	function create_if_block_2$1(ctx) {
		let title_1;
		let t;

		return {
			c() {
				title_1 = svg_element("title");
				t = text(/*title*/ ctx[2]);
			},
			m(target, anchor) {
				insert(target, title_1, anchor);
				append(title_1, t);
			},
			p(ctx, dirty) {
				if (dirty & /*title*/ 4) set_data(t, /*title*/ ctx[2]);
			},
			d(detaching) {
				if (detaching) {
					detach(title_1);
				}
			}
		};
	}

	// (69:3) {:else}
	function create_else_block_1$1(ctx) {
		let path_1;

		return {
			c() {
				path_1 = svg_element("path");
				attr(path_1, "d", /*path*/ ctx[0]);
			},
			m(target, anchor) {
				insert(target, path_1, anchor);
			},
			p(ctx, dirty) {
				if (dirty & /*path*/ 1) {
					attr(path_1, "d", /*path*/ ctx[0]);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(path_1);
				}
			}
		};
	}

	// (60:0) {#if spin !== false}
	function create_if_block$4(ctx) {
		let g;
		let path_1;
		let g_style_value;

		function select_block_type_1(ctx, dirty) {
			if (/*inverse*/ ctx[3]) return create_if_block_1$2;
			return create_else_block$2;
		}

		let current_block_type = select_block_type_1(ctx);
		let if_block = current_block_type(ctx);

		return {
			c() {
				if_block.c();
				g = svg_element("g");
				path_1 = svg_element("path");
				attr(path_1, "d", /*path*/ ctx[0]);
				attr(g, "style", g_style_value = `animation: ${/*spinfunc*/ ctx[5]} linear ${/*spintime*/ ctx[6]}s infinite; transform-origin: center`);
			},
			m(target, anchor) {
				if_block.m(target, anchor);
				insert(target, g, anchor);
				append(g, path_1);
			},
			p(ctx, dirty) {
				if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
					if_block.d(1);
					if_block = current_block_type(ctx);

					if (if_block) {
						if_block.c();
						if_block.m(g.parentNode, g);
					}
				}

				if (dirty & /*path*/ 1) {
					attr(path_1, "d", /*path*/ ctx[0]);
				}

				if (dirty & /*spinfunc, spintime*/ 96 && g_style_value !== (g_style_value = `animation: ${/*spinfunc*/ ctx[5]} linear ${/*spintime*/ ctx[6]}s infinite; transform-origin: center`)) {
					attr(g, "style", g_style_value);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(g);
				}

				if_block.d(detaching);
			}
		};
	}

	// (63:2) {:else}
	function create_else_block$2(ctx) {
		let style_1;
		let t;

		return {
			c() {
				style_1 = svg_element("style");
				t = text("@keyframes spin { to { transform: rotate(360deg) } }");
			},
			m(target, anchor) {
				insert(target, style_1, anchor);
				append(style_1, t);
			},
			d(detaching) {
				if (detaching) {
					detach(style_1);
				}
			}
		};
	}

	// (61:2) {#if inverse}
	function create_if_block_1$2(ctx) {
		let style_1;
		let t;

		return {
			c() {
				style_1 = svg_element("style");
				t = text("@keyframes spin-inverse { to { transform: rotate(-360deg) } }");
			},
			m(target, anchor) {
				insert(target, style_1, anchor);
				append(style_1, t);
			},
			d(detaching) {
				if (detaching) {
					detach(style_1);
				}
			}
		};
	}

	function create_fragment$5(ctx) {
		let svg;
		let if_block0_anchor;
		let if_block0 = /*title*/ ctx[2] && create_if_block_2$1(ctx);

		function select_block_type(ctx, dirty) {
			if (/*spin*/ ctx[1] !== false) return create_if_block$4;
			return create_else_block_1$1;
		}

		let current_block_type = select_block_type(ctx);
		let if_block1 = current_block_type(ctx);

		return {
			c() {
				svg = svg_element("svg");
				if (if_block0) if_block0.c();
				if_block0_anchor = empty();
				if_block1.c();
				attr(svg, "viewBox", "0 0 24 24");
				attr(svg, "style", /*style*/ ctx[4]);
				attr(svg, "class", "svelte-dmmfjb");
			},
			m(target, anchor) {
				insert(target, svg, anchor);
				if (if_block0) if_block0.m(svg, null);
				append(svg, if_block0_anchor);
				if_block1.m(svg, null);
			},
			p(ctx, [dirty]) {
				if (/*title*/ ctx[2]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_2$1(ctx);
						if_block0.c();
						if_block0.m(svg, if_block0_anchor);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1.d(1);
					if_block1 = current_block_type(ctx);

					if (if_block1) {
						if_block1.c();
						if_block1.m(svg, null);
					}
				}

				if (dirty & /*style*/ 16) {
					attr(svg, "style", /*style*/ ctx[4]);
				}
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) {
					detach(svg);
				}

				if (if_block0) if_block0.d();
				if_block1.d();
			}
		};
	}

	function instance$5($$self, $$props, $$invalidate) {
		let inverse;
		let spintime;
		let spinfunc;
		let style;
		let { path } = $$props;
		let { size = 1 } = $$props;
		let { color = null } = $$props;
		let { flip = null } = $$props;
		let { rotate = 0 } = $$props;
		let { spin = false } = $$props;
		let { title = '' } = $$props;

		// size
		if (Number(size)) size = Number(size);

		const getStyles = () => {
			const transform = [];
			const styles = [];

			if (size !== null) {
				const width = typeof size === "string" ? size : `${size * 1.5}rem`;
				styles.push(['width', width]);
				styles.push(['height', width]);
			}

			styles.push(['fill', color !== null ? color : 'currentColor']);

			if (flip === true || flip === 'h') {
				transform.push("scaleX(-1)");
			}

			if (flip === true || flip === 'v') {
				transform.push("scaleY(-1)");
			}

			if (rotate != 0) {
				transform.push(`rotate(${rotate}deg)`);
			}

			if (transform.length > 0) {
				styles.push(['transform', transform.join(' ')]);
				styles.push(['transform-origin', 'center']);
			}

			return styles.reduce(
				(cur, item) => {
					return `${cur} ${item[0]}:${item[1]};`;
				},
				''
			);
		};

		$$self.$$set = $$props => {
			if ('path' in $$props) $$invalidate(0, path = $$props.path);
			if ('size' in $$props) $$invalidate(7, size = $$props.size);
			if ('color' in $$props) $$invalidate(8, color = $$props.color);
			if ('flip' in $$props) $$invalidate(9, flip = $$props.flip);
			if ('rotate' in $$props) $$invalidate(10, rotate = $$props.rotate);
			if ('spin' in $$props) $$invalidate(1, spin = $$props.spin);
			if ('title' in $$props) $$invalidate(2, title = $$props.title);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*spin*/ 2) {
				// SPIN properties
				$$invalidate(3, inverse = typeof spin !== "boolean" && spin < 0 ? true : false);
			}

			if ($$self.$$.dirty & /*spin*/ 2) {
				$$invalidate(6, spintime = Math.abs(spin === true ? 2 : spin));
			}

			if ($$self.$$.dirty & /*inverse*/ 8) {
				$$invalidate(5, spinfunc = inverse ? 'spin-inverse' : 'spin');
			}

			if ($$self.$$.dirty & /*size, color, flip, rotate*/ 1920) {
				$$invalidate(4, style = getStyles());
			}
		};

		return [
			path,
			spin,
			title,
			inverse,
			style,
			spinfunc,
			spintime,
			size,
			color,
			flip,
			rotate
		];
	}

	class Index extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$5, create_fragment$5, safe_not_equal, {
				path: 0,
				size: 7,
				color: 8,
				flip: 9,
				rotate: 10,
				spin: 1,
				title: 2
			});
		}
	}

	const semver = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
	const validateAndParse = (version) => {
	    if (typeof version !== 'string') {
	        throw new TypeError('Invalid argument expected string');
	    }
	    const match = version.match(semver);
	    if (!match) {
	        throw new Error(`Invalid argument not valid semver ('${version}' received)`);
	    }
	    match.shift();
	    return match;
	};
	const isWildcard = (s) => s === '*' || s === 'x' || s === 'X';
	const tryParse = (v) => {
	    const n = parseInt(v, 10);
	    return isNaN(n) ? v : n;
	};
	const forceType = (a, b) => typeof a !== typeof b ? [String(a), String(b)] : [a, b];
	const compareStrings = (a, b) => {
	    if (isWildcard(a) || isWildcard(b))
	        return 0;
	    const [ap, bp] = forceType(tryParse(a), tryParse(b));
	    if (ap > bp)
	        return 1;
	    if (ap < bp)
	        return -1;
	    return 0;
	};
	const compareSegments = (a, b) => {
	    for (let i = 0; i < Math.max(a.length, b.length); i++) {
	        const r = compareStrings(a[i] || '0', b[i] || '0');
	        if (r !== 0)
	            return r;
	    }
	    return 0;
	};

	/**
	 * Compare [semver](https://semver.org/) version strings to find greater, equal or lesser.
	 * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
	 * @param v1 - First version to compare
	 * @param v2 - Second version to compare
	 * @returns Numeric value compatible with the [Array.sort(fn) interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).
	 */
	const compareVersions = (v1, v2) => {
	    // validate input and split into segments
	    const n1 = validateAndParse(v1);
	    const n2 = validateAndParse(v2);
	    // pop off the patch
	    const p1 = n1.pop();
	    const p2 = n2.pop();
	    // validate numbers
	    const r = compareSegments(n1, n2);
	    if (r !== 0)
	        return r;
	    // validate pre-release
	    if (p1 && p2) {
	        return compareSegments(p1.split('.'), p2.split('.'));
	    }
	    else if (p1 || p2) {
	        return p1 ? -1 : 1;
	    }
	    return 0;
	};

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;
	if (typeof global$1.setTimeout === 'function') {
	    cachedSetTimeout = setTimeout;
	}
	if (typeof global$1.clearTimeout === 'function') {
	    cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	function nextTick(fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	var title = 'browser';
	var platform = 'browser';
	var browser$1 = true;
	var env = {};
	var argv = [];
	var version = ''; // empty string to avoid regexp issues
	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;

	function binding(name) {
	    throw new Error('process.binding is not supported');
	}

	function cwd () { return '/' }
	function chdir (dir) {
	    throw new Error('process.chdir is not supported');
	}function umask() { return 0; }

	// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
	var performance = global$1.performance || {};
	var performanceNow =
	  performance.now        ||
	  performance.mozNow     ||
	  performance.msNow      ||
	  performance.oNow       ||
	  performance.webkitNow  ||
	  function(){ return (new Date()).getTime() };

	// generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime
	function hrtime(previousTimestamp){
	  var clocktime = performanceNow.call(performance)*1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor((clocktime%1)*1e9);
	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];
	    if (nanoseconds<0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }
	  return [seconds,nanoseconds]
	}

	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}

	var browser$1$1 = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser$1,
	  env: env,
	  argv: argv,
	  version: version,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	var browser = {exports: {}};

	/**
	 * Helpers.
	 */

	var ms;
	var hasRequiredMs;

	function requireMs () {
		if (hasRequiredMs) return ms;
		hasRequiredMs = 1;
		var s = 1000;
		var m = s * 60;
		var h = m * 60;
		var d = h * 24;
		var w = d * 7;
		var y = d * 365.25;

		/**
		 * Parse or format the given `val`.
		 *
		 * Options:
		 *
		 *  - `long` verbose formatting [false]
		 *
		 * @param {String|Number} val
		 * @param {Object} [options]
		 * @throws {Error} throw an error if val is not a non-empty string or a number
		 * @return {String|Number}
		 * @api public
		 */

		ms = function (val, options) {
		  options = options || {};
		  var type = typeof val;
		  if (type === 'string' && val.length > 0) {
		    return parse(val);
		  } else if (type === 'number' && isFinite(val)) {
		    return options.long ? fmtLong(val) : fmtShort(val);
		  }
		  throw new Error(
		    'val is not a non-empty string or a valid number. val=' +
		      JSON.stringify(val)
		  );
		};

		/**
		 * Parse the given `str` and return milliseconds.
		 *
		 * @param {String} str
		 * @return {Number}
		 * @api private
		 */

		function parse(str) {
		  str = String(str);
		  if (str.length > 100) {
		    return;
		  }
		  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
		    str
		  );
		  if (!match) {
		    return;
		  }
		  var n = parseFloat(match[1]);
		  var type = (match[2] || 'ms').toLowerCase();
		  switch (type) {
		    case 'years':
		    case 'year':
		    case 'yrs':
		    case 'yr':
		    case 'y':
		      return n * y;
		    case 'weeks':
		    case 'week':
		    case 'w':
		      return n * w;
		    case 'days':
		    case 'day':
		    case 'd':
		      return n * d;
		    case 'hours':
		    case 'hour':
		    case 'hrs':
		    case 'hr':
		    case 'h':
		      return n * h;
		    case 'minutes':
		    case 'minute':
		    case 'mins':
		    case 'min':
		    case 'm':
		      return n * m;
		    case 'seconds':
		    case 'second':
		    case 'secs':
		    case 'sec':
		    case 's':
		      return n * s;
		    case 'milliseconds':
		    case 'millisecond':
		    case 'msecs':
		    case 'msec':
		    case 'ms':
		      return n;
		    default:
		      return undefined;
		  }
		}

		/**
		 * Short format for `ms`.
		 *
		 * @param {Number} ms
		 * @return {String}
		 * @api private
		 */

		function fmtShort(ms) {
		  var msAbs = Math.abs(ms);
		  if (msAbs >= d) {
		    return Math.round(ms / d) + 'd';
		  }
		  if (msAbs >= h) {
		    return Math.round(ms / h) + 'h';
		  }
		  if (msAbs >= m) {
		    return Math.round(ms / m) + 'm';
		  }
		  if (msAbs >= s) {
		    return Math.round(ms / s) + 's';
		  }
		  return ms + 'ms';
		}

		/**
		 * Long format for `ms`.
		 *
		 * @param {Number} ms
		 * @return {String}
		 * @api private
		 */

		function fmtLong(ms) {
		  var msAbs = Math.abs(ms);
		  if (msAbs >= d) {
		    return plural(ms, msAbs, d, 'day');
		  }
		  if (msAbs >= h) {
		    return plural(ms, msAbs, h, 'hour');
		  }
		  if (msAbs >= m) {
		    return plural(ms, msAbs, m, 'minute');
		  }
		  if (msAbs >= s) {
		    return plural(ms, msAbs, s, 'second');
		  }
		  return ms + ' ms';
		}

		/**
		 * Pluralization helper.
		 */

		function plural(ms, msAbs, n, name) {
		  var isPlural = msAbs >= n * 1.5;
		  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
		}
		return ms;
	}

	var common;
	var hasRequiredCommon;

	function requireCommon () {
		if (hasRequiredCommon) return common;
		hasRequiredCommon = 1;
		/**
		 * This is the common logic for both the Node.js and web browser
		 * implementations of `debug()`.
		 */

		function setup(env) {
			createDebug.debug = createDebug;
			createDebug.default = createDebug;
			createDebug.coerce = coerce;
			createDebug.disable = disable;
			createDebug.enable = enable;
			createDebug.enabled = enabled;
			createDebug.humanize = requireMs();
			createDebug.destroy = destroy;

			Object.keys(env).forEach(key => {
				createDebug[key] = env[key];
			});

			/**
			* The currently active debug mode names, and names to skip.
			*/

			createDebug.names = [];
			createDebug.skips = [];

			/**
			* Map of special "%n" handling functions, for the debug "format" argument.
			*
			* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
			*/
			createDebug.formatters = {};

			/**
			* Selects a color for a debug namespace
			* @param {String} namespace The namespace string for the debug instance to be colored
			* @return {Number|String} An ANSI color code for the given namespace
			* @api private
			*/
			function selectColor(namespace) {
				let hash = 0;

				for (let i = 0; i < namespace.length; i++) {
					hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
					hash |= 0; // Convert to 32bit integer
				}

				return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
			}
			createDebug.selectColor = selectColor;

			/**
			* Create a debugger with the given `namespace`.
			*
			* @param {String} namespace
			* @return {Function}
			* @api public
			*/
			function createDebug(namespace) {
				let prevTime;
				let enableOverride = null;
				let namespacesCache;
				let enabledCache;

				function debug(...args) {
					// Disabled?
					if (!debug.enabled) {
						return;
					}

					const self = debug;

					// Set `diff` timestamp
					const curr = Number(new Date());
					const ms = curr - (prevTime || curr);
					self.diff = ms;
					self.prev = prevTime;
					self.curr = curr;
					prevTime = curr;

					args[0] = createDebug.coerce(args[0]);

					if (typeof args[0] !== 'string') {
						// Anything else let's inspect with %O
						args.unshift('%O');
					}

					// Apply any `formatters` transformations
					let index = 0;
					args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
						// If we encounter an escaped % then don't increase the array index
						if (match === '%%') {
							return '%';
						}
						index++;
						const formatter = createDebug.formatters[format];
						if (typeof formatter === 'function') {
							const val = args[index];
							match = formatter.call(self, val);

							// Now we need to remove `args[index]` since it's inlined in the `format`
							args.splice(index, 1);
							index--;
						}
						return match;
					});

					// Apply env-specific formatting (colors, etc.)
					createDebug.formatArgs.call(self, args);

					const logFn = self.log || createDebug.log;
					logFn.apply(self, args);
				}

				debug.namespace = namespace;
				debug.useColors = createDebug.useColors();
				debug.color = createDebug.selectColor(namespace);
				debug.extend = extend;
				debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

				Object.defineProperty(debug, 'enabled', {
					enumerable: true,
					configurable: false,
					get: () => {
						if (enableOverride !== null) {
							return enableOverride;
						}
						if (namespacesCache !== createDebug.namespaces) {
							namespacesCache = createDebug.namespaces;
							enabledCache = createDebug.enabled(namespace);
						}

						return enabledCache;
					},
					set: v => {
						enableOverride = v;
					}
				});

				// Env-specific initialization logic for debug instances
				if (typeof createDebug.init === 'function') {
					createDebug.init(debug);
				}

				return debug;
			}

			function extend(namespace, delimiter) {
				const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
				newDebug.log = this.log;
				return newDebug;
			}

			/**
			* Enables a debug mode by namespaces. This can include modes
			* separated by a colon and wildcards.
			*
			* @param {String} namespaces
			* @api public
			*/
			function enable(namespaces) {
				createDebug.save(namespaces);
				createDebug.namespaces = namespaces;

				createDebug.names = [];
				createDebug.skips = [];

				const split = (typeof namespaces === 'string' ? namespaces : '')
					.trim()
					.replace(' ', ',')
					.split(',')
					.filter(Boolean);

				for (const ns of split) {
					if (ns[0] === '-') {
						createDebug.skips.push(ns.slice(1));
					} else {
						createDebug.names.push(ns);
					}
				}
			}

			/**
			 * Checks if the given string matches a namespace template, honoring
			 * asterisks as wildcards.
			 *
			 * @param {String} search
			 * @param {String} template
			 * @return {Boolean}
			 */
			function matchesTemplate(search, template) {
				let searchIndex = 0;
				let templateIndex = 0;
				let starIndex = -1;
				let matchIndex = 0;

				while (searchIndex < search.length) {
					if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
						// Match character or proceed with wildcard
						if (template[templateIndex] === '*') {
							starIndex = templateIndex;
							matchIndex = searchIndex;
							templateIndex++; // Skip the '*'
						} else {
							searchIndex++;
							templateIndex++;
						}
					} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
						// Backtrack to the last '*' and try to match more characters
						templateIndex = starIndex + 1;
						matchIndex++;
						searchIndex = matchIndex;
					} else {
						return false; // No match
					}
				}

				// Handle trailing '*' in template
				while (templateIndex < template.length && template[templateIndex] === '*') {
					templateIndex++;
				}

				return templateIndex === template.length;
			}

			/**
			* Disable debug output.
			*
			* @return {String} namespaces
			* @api public
			*/
			function disable() {
				const namespaces = [
					...createDebug.names,
					...createDebug.skips.map(namespace => '-' + namespace)
				].join(',');
				createDebug.enable('');
				return namespaces;
			}

			/**
			* Returns true if the given mode name is enabled, false otherwise.
			*
			* @param {String} name
			* @return {Boolean}
			* @api public
			*/
			function enabled(name) {
				for (const skip of createDebug.skips) {
					if (matchesTemplate(name, skip)) {
						return false;
					}
				}

				for (const ns of createDebug.names) {
					if (matchesTemplate(name, ns)) {
						return true;
					}
				}

				return false;
			}

			/**
			* Coerce `val`.
			*
			* @param {Mixed} val
			* @return {Mixed}
			* @api private
			*/
			function coerce(val) {
				if (val instanceof Error) {
					return val.stack || val.message;
				}
				return val;
			}

			/**
			* XXX DO NOT USE. This is a temporary stub function.
			* XXX It WILL be removed in the next major release.
			*/
			function destroy() {
				console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
			}

			createDebug.enable(createDebug.load());

			return createDebug;
		}

		common = setup;
		return common;
	}

	var hasRequiredBrowser;

	function requireBrowser () {
		if (hasRequiredBrowser) return browser.exports;
		hasRequiredBrowser = 1;
		(function (module, exports) {
			/**
			 * This is the web browser implementation of `debug()`.
			 */

			exports.formatArgs = formatArgs;
			exports.save = save;
			exports.load = load;
			exports.useColors = useColors;
			exports.storage = localstorage();
			exports.destroy = (() => {
				let warned = false;

				return () => {
					if (!warned) {
						warned = true;
						console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
					}
				};
			})();

			/**
			 * Colors.
			 */

			exports.colors = [
				'#0000CC',
				'#0000FF',
				'#0033CC',
				'#0033FF',
				'#0066CC',
				'#0066FF',
				'#0099CC',
				'#0099FF',
				'#00CC00',
				'#00CC33',
				'#00CC66',
				'#00CC99',
				'#00CCCC',
				'#00CCFF',
				'#3300CC',
				'#3300FF',
				'#3333CC',
				'#3333FF',
				'#3366CC',
				'#3366FF',
				'#3399CC',
				'#3399FF',
				'#33CC00',
				'#33CC33',
				'#33CC66',
				'#33CC99',
				'#33CCCC',
				'#33CCFF',
				'#6600CC',
				'#6600FF',
				'#6633CC',
				'#6633FF',
				'#66CC00',
				'#66CC33',
				'#9900CC',
				'#9900FF',
				'#9933CC',
				'#9933FF',
				'#99CC00',
				'#99CC33',
				'#CC0000',
				'#CC0033',
				'#CC0066',
				'#CC0099',
				'#CC00CC',
				'#CC00FF',
				'#CC3300',
				'#CC3333',
				'#CC3366',
				'#CC3399',
				'#CC33CC',
				'#CC33FF',
				'#CC6600',
				'#CC6633',
				'#CC9900',
				'#CC9933',
				'#CCCC00',
				'#CCCC33',
				'#FF0000',
				'#FF0033',
				'#FF0066',
				'#FF0099',
				'#FF00CC',
				'#FF00FF',
				'#FF3300',
				'#FF3333',
				'#FF3366',
				'#FF3399',
				'#FF33CC',
				'#FF33FF',
				'#FF6600',
				'#FF6633',
				'#FF9900',
				'#FF9933',
				'#FFCC00',
				'#FFCC33'
			];

			/**
			 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
			 * and the Firebug extension (any Firefox version) are known
			 * to support "%c" CSS customizations.
			 *
			 * TODO: add a `localStorage` variable to explicitly enable/disable colors
			 */

			// eslint-disable-next-line complexity
			function useColors() {
				// NB: In an Electron preload script, document will be defined but not fully
				// initialized. Since we know we're in Chrome, we'll just detect this case
				// explicitly
				if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
					return true;
				}

				// Internet Explorer and Edge do not support colors.
				if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
					return false;
				}

				let m;

				// Is webkit? http://stackoverflow.com/a/16459606/376773
				// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
				// eslint-disable-next-line no-return-assign
				return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
					// Is firebug? http://stackoverflow.com/a/398120/376773
					(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
					// Is firefox >= v31?
					// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
					(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
					// Double check webkit in userAgent just in case we are in a worker
					(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
			}

			/**
			 * Colorize log arguments if enabled.
			 *
			 * @api public
			 */

			function formatArgs(args) {
				args[0] = (this.useColors ? '%c' : '') +
					this.namespace +
					(this.useColors ? ' %c' : ' ') +
					args[0] +
					(this.useColors ? '%c ' : ' ') +
					'+' + module.exports.humanize(this.diff);

				if (!this.useColors) {
					return;
				}

				const c = 'color: ' + this.color;
				args.splice(1, 0, c, 'color: inherit');

				// The final "%c" is somewhat tricky, because there could be other
				// arguments passed either before or after the %c, so we need to
				// figure out the correct index to insert the CSS into
				let index = 0;
				let lastC = 0;
				args[0].replace(/%[a-zA-Z%]/g, match => {
					if (match === '%%') {
						return;
					}
					index++;
					if (match === '%c') {
						// We only are interested in the *last* %c
						// (the user may have provided their own)
						lastC = index;
					}
				});

				args.splice(lastC, 0, c);
			}

			/**
			 * Invokes `console.debug()` when available.
			 * No-op when `console.debug` is not a "function".
			 * If `console.debug` is not available, falls back
			 * to `console.log`.
			 *
			 * @api public
			 */
			exports.log = console.debug || console.log || (() => {});

			/**
			 * Save `namespaces`.
			 *
			 * @param {String} namespaces
			 * @api private
			 */
			function save(namespaces) {
				try {
					if (namespaces) {
						exports.storage.setItem('debug', namespaces);
					} else {
						exports.storage.removeItem('debug');
					}
				} catch (error) {
					// Swallow
					// XXX (@Qix-) should we be logging these?
				}
			}

			/**
			 * Load `namespaces`.
			 *
			 * @return {String} returns the previously persisted debug modes
			 * @api private
			 */
			function load() {
				let r;
				try {
					r = exports.storage.getItem('debug');
				} catch (error) {
					// Swallow
					// XXX (@Qix-) should we be logging these?
				}

				// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
				if (!r && typeof browser$1$1 !== 'undefined' && 'env' in browser$1$1) {
					r = browser$1$1.env.DEBUG;
				}

				return r;
			}

			/**
			 * Localstorage attempts to return the localstorage.
			 *
			 * This is necessary because safari throws
			 * when a user disables cookies/localstorage
			 * and you attempt to access it.
			 *
			 * @return {LocalStorage}
			 * @api private
			 */

			function localstorage() {
				try {
					// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
					// The Browser also has localStorage in the global context.
					return localStorage;
				} catch (error) {
					// Swallow
					// XXX (@Qix-) should we be logging these?
				}
			}

			module.exports = requireCommon()(exports);

			const {formatters} = module.exports;

			/**
			 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
			 */

			formatters.j = function (v) {
				try {
					return JSON.stringify(v);
				} catch (error) {
					return '[UnexpectedJSONParseError]: ' + error.message;
				}
			}; 
		} (browser, browser.exports));
		return browser.exports;
	}

	var browserExports = requireBrowser();
	var createDebug = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

	var eventemitter3 = {exports: {}};

	var hasRequiredEventemitter3;

	function requireEventemitter3 () {
		if (hasRequiredEventemitter3) return eventemitter3.exports;
		hasRequiredEventemitter3 = 1;
		(function (module) {

			var has = Object.prototype.hasOwnProperty
			  , prefix = '~';

			/**
			 * Constructor to create a storage for our `EE` objects.
			 * An `Events` instance is a plain object whose properties are event names.
			 *
			 * @constructor
			 * @private
			 */
			function Events() {}

			//
			// We try to not inherit from `Object.prototype`. In some engines creating an
			// instance in this way is faster than calling `Object.create(null)` directly.
			// If `Object.create(null)` is not supported we prefix the event names with a
			// character to make sure that the built-in object properties are not
			// overridden or used as an attack vector.
			//
			if (Object.create) {
			  Events.prototype = Object.create(null);

			  //
			  // This hack is needed because the `__proto__` property is still inherited in
			  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
			  //
			  if (!new Events().__proto__) prefix = false;
			}

			/**
			 * Representation of a single event listener.
			 *
			 * @param {Function} fn The listener function.
			 * @param {*} context The context to invoke the listener with.
			 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
			 * @constructor
			 * @private
			 */
			function EE(fn, context, once) {
			  this.fn = fn;
			  this.context = context;
			  this.once = once || false;
			}

			/**
			 * Add a listener for a given event.
			 *
			 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
			 * @param {(String|Symbol)} event The event name.
			 * @param {Function} fn The listener function.
			 * @param {*} context The context to invoke the listener with.
			 * @param {Boolean} once Specify if the listener is a one-time listener.
			 * @returns {EventEmitter}
			 * @private
			 */
			function addListener(emitter, event, fn, context, once) {
			  if (typeof fn !== 'function') {
			    throw new TypeError('The listener must be a function');
			  }

			  var listener = new EE(fn, context || emitter, once)
			    , evt = prefix ? prefix + event : event;

			  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
			  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
			  else emitter._events[evt] = [emitter._events[evt], listener];

			  return emitter;
			}

			/**
			 * Clear event by name.
			 *
			 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
			 * @param {(String|Symbol)} evt The Event name.
			 * @private
			 */
			function clearEvent(emitter, evt) {
			  if (--emitter._eventsCount === 0) emitter._events = new Events();
			  else delete emitter._events[evt];
			}

			/**
			 * Minimal `EventEmitter` interface that is molded against the Node.js
			 * `EventEmitter` interface.
			 *
			 * @constructor
			 * @public
			 */
			function EventEmitter() {
			  this._events = new Events();
			  this._eventsCount = 0;
			}

			/**
			 * Return an array listing the events for which the emitter has registered
			 * listeners.
			 *
			 * @returns {Array}
			 * @public
			 */
			EventEmitter.prototype.eventNames = function eventNames() {
			  var names = []
			    , events
			    , name;

			  if (this._eventsCount === 0) return names;

			  for (name in (events = this._events)) {
			    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
			  }

			  if (Object.getOwnPropertySymbols) {
			    return names.concat(Object.getOwnPropertySymbols(events));
			  }

			  return names;
			};

			/**
			 * Return the listeners registered for a given event.
			 *
			 * @param {(String|Symbol)} event The event name.
			 * @returns {Array} The registered listeners.
			 * @public
			 */
			EventEmitter.prototype.listeners = function listeners(event) {
			  var evt = prefix ? prefix + event : event
			    , handlers = this._events[evt];

			  if (!handlers) return [];
			  if (handlers.fn) return [handlers.fn];

			  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
			    ee[i] = handlers[i].fn;
			  }

			  return ee;
			};

			/**
			 * Return the number of listeners listening to a given event.
			 *
			 * @param {(String|Symbol)} event The event name.
			 * @returns {Number} The number of listeners.
			 * @public
			 */
			EventEmitter.prototype.listenerCount = function listenerCount(event) {
			  var evt = prefix ? prefix + event : event
			    , listeners = this._events[evt];

			  if (!listeners) return 0;
			  if (listeners.fn) return 1;
			  return listeners.length;
			};

			/**
			 * Calls each of the listeners registered for a given event.
			 *
			 * @param {(String|Symbol)} event The event name.
			 * @returns {Boolean} `true` if the event had listeners, else `false`.
			 * @public
			 */
			EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
			  var evt = prefix ? prefix + event : event;

			  if (!this._events[evt]) return false;

			  var listeners = this._events[evt]
			    , len = arguments.length
			    , args
			    , i;

			  if (listeners.fn) {
			    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

			    switch (len) {
			      case 1: return listeners.fn.call(listeners.context), true;
			      case 2: return listeners.fn.call(listeners.context, a1), true;
			      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
			      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
			      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
			      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
			    }

			    for (i = 1, args = new Array(len -1); i < len; i++) {
			      args[i - 1] = arguments[i];
			    }

			    listeners.fn.apply(listeners.context, args);
			  } else {
			    var length = listeners.length
			      , j;

			    for (i = 0; i < length; i++) {
			      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

			      switch (len) {
			        case 1: listeners[i].fn.call(listeners[i].context); break;
			        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
			        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
			        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
			        default:
			          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
			            args[j - 1] = arguments[j];
			          }

			          listeners[i].fn.apply(listeners[i].context, args);
			      }
			    }
			  }

			  return true;
			};

			/**
			 * Add a listener for a given event.
			 *
			 * @param {(String|Symbol)} event The event name.
			 * @param {Function} fn The listener function.
			 * @param {*} [context=this] The context to invoke the listener with.
			 * @returns {EventEmitter} `this`.
			 * @public
			 */
			EventEmitter.prototype.on = function on(event, fn, context) {
			  return addListener(this, event, fn, context, false);
			};

			/**
			 * Add a one-time listener for a given event.
			 *
			 * @param {(String|Symbol)} event The event name.
			 * @param {Function} fn The listener function.
			 * @param {*} [context=this] The context to invoke the listener with.
			 * @returns {EventEmitter} `this`.
			 * @public
			 */
			EventEmitter.prototype.once = function once(event, fn, context) {
			  return addListener(this, event, fn, context, true);
			};

			/**
			 * Remove the listeners of a given event.
			 *
			 * @param {(String|Symbol)} event The event name.
			 * @param {Function} fn Only remove the listeners that match this function.
			 * @param {*} context Only remove the listeners that have this context.
			 * @param {Boolean} once Only remove one-time listeners.
			 * @returns {EventEmitter} `this`.
			 * @public
			 */
			EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
			  var evt = prefix ? prefix + event : event;

			  if (!this._events[evt]) return this;
			  if (!fn) {
			    clearEvent(this, evt);
			    return this;
			  }

			  var listeners = this._events[evt];

			  if (listeners.fn) {
			    if (
			      listeners.fn === fn &&
			      (!once || listeners.once) &&
			      (!context || listeners.context === context)
			    ) {
			      clearEvent(this, evt);
			    }
			  } else {
			    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
			      if (
			        listeners[i].fn !== fn ||
			        (once && !listeners[i].once) ||
			        (context && listeners[i].context !== context)
			      ) {
			        events.push(listeners[i]);
			      }
			    }

			    //
			    // Reset the array, or remove it completely if we have no more listeners.
			    //
			    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
			    else clearEvent(this, evt);
			  }

			  return this;
			};

			/**
			 * Remove all listeners, or those of the specified event.
			 *
			 * @param {(String|Symbol)} [event] The event name.
			 * @returns {EventEmitter} `this`.
			 * @public
			 */
			EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
			  var evt;

			  if (event) {
			    evt = prefix ? prefix + event : event;
			    if (this._events[evt]) clearEvent(this, evt);
			  } else {
			    this._events = new Events();
			    this._eventsCount = 0;
			  }

			  return this;
			};

			//
			// Alias methods names because people roll like that.
			//
			EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
			EventEmitter.prototype.addListener = EventEmitter.prototype.on;

			//
			// Expose the prefix.
			//
			EventEmitter.prefixed = prefix;

			//
			// Allow `EventEmitter` to be imported as module namespace.
			//
			EventEmitter.EventEmitter = EventEmitter;

			//
			// Expose the module.
			//
			{
			  module.exports = EventEmitter;
			} 
		} (eventemitter3));
		return eventemitter3.exports;
	}

	var eventemitter3Exports = requireEventemitter3();
	var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventemitter3Exports);

	// https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

	var ws = null;

	if (typeof WebSocket !== 'undefined') {
	  ws = WebSocket;
	} else if (typeof MozWebSocket !== 'undefined') {
	  ws = MozWebSocket;
	} else if (typeof global$1 !== 'undefined') {
	  ws = global$1.WebSocket || global$1.MozWebSocket;
	} else if (typeof window !== 'undefined') {
	  ws = window.WebSocket || window.MozWebSocket;
	} else if (typeof self !== 'undefined') {
	  ws = self.WebSocket || self.MozWebSocket;
	}

	var sha256$2 = {exports: {}};

	function commonjsRequire(path) {
		throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
	}

	var core$1 = {exports: {}};

	var _polyfillNode_crypto = {};

	var _polyfillNode_crypto$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: _polyfillNode_crypto
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_crypto$1);

	var core = core$1.exports;

	var hasRequiredCore;

	function requireCore () {
		if (hasRequiredCore) return core$1.exports;
		hasRequiredCore = 1;
		(function (module, exports) {
	(function (root, factory) {
				{
					// CommonJS
					module.exports = factory();
				}
			}(core, function () {

				/*globals window, global, require*/

				/**
				 * CryptoJS core components.
				 */
				var CryptoJS = CryptoJS || (function (Math, undefined$1) {

				    var crypto;

				    // Native crypto from window (Browser)
				    if (typeof window !== 'undefined' && window.crypto) {
				        crypto = window.crypto;
				    }

				    // Native crypto in web worker (Browser)
				    if (typeof self !== 'undefined' && self.crypto) {
				        crypto = self.crypto;
				    }

				    // Native crypto from worker
				    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
				        crypto = globalThis.crypto;
				    }

				    // Native (experimental IE 11) crypto from window (Browser)
				    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
				        crypto = window.msCrypto;
				    }

				    // Native crypto from global (NodeJS)
				    if (!crypto && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
				        crypto = commonjsGlobal.crypto;
				    }

				    // Native crypto import via require (NodeJS)
				    if (!crypto && typeof commonjsRequire === 'function') {
				        try {
				            crypto = require$$0;
				        } catch (err) {}
				    }

				    /*
				     * Cryptographically secure pseudorandom number generator
				     *
				     * As Math.random() is cryptographically not safe to use
				     */
				    var cryptoSecureRandomInt = function () {
				        if (crypto) {
				            // Use getRandomValues method (Browser)
				            if (typeof crypto.getRandomValues === 'function') {
				                try {
				                    return crypto.getRandomValues(new Uint32Array(1))[0];
				                } catch (err) {}
				            }

				            // Use randomBytes method (NodeJS)
				            if (typeof crypto.randomBytes === 'function') {
				                try {
				                    return crypto.randomBytes(4).readInt32LE();
				                } catch (err) {}
				            }
				        }

				        throw new Error('Native crypto module could not be used to get secure random number.');
				    };

				    /*
				     * Local polyfill of Object.create

				     */
				    var create = Object.create || (function () {
				        function F() {}

				        return function (obj) {
				            var subtype;

				            F.prototype = obj;

				            subtype = new F();

				            F.prototype = null;

				            return subtype;
				        };
				    }());

				    /**
				     * CryptoJS namespace.
				     */
				    var C = {};

				    /**
				     * Library namespace.
				     */
				    var C_lib = C.lib = {};

				    /**
				     * Base object for prototypal inheritance.
				     */
				    var Base = C_lib.Base = (function () {


				        return {
				            /**
				             * Creates a new object that inherits from this object.
				             *
				             * @param {Object} overrides Properties to copy into the new object.
				             *
				             * @return {Object} The new object.
				             *
				             * @static
				             *
				             * @example
				             *
				             *     var MyType = CryptoJS.lib.Base.extend({
				             *         field: 'value',
				             *
				             *         method: function () {
				             *         }
				             *     });
				             */
				            extend: function (overrides) {
				                // Spawn
				                var subtype = create(this);

				                // Augment
				                if (overrides) {
				                    subtype.mixIn(overrides);
				                }

				                // Create default initializer
				                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
				                    subtype.init = function () {
				                        subtype.$super.init.apply(this, arguments);
				                    };
				                }

				                // Initializer's prototype is the subtype object
				                subtype.init.prototype = subtype;

				                // Reference supertype
				                subtype.$super = this;

				                return subtype;
				            },

				            /**
				             * Extends this object and runs the init method.
				             * Arguments to create() will be passed to init().
				             *
				             * @return {Object} The new object.
				             *
				             * @static
				             *
				             * @example
				             *
				             *     var instance = MyType.create();
				             */
				            create: function () {
				                var instance = this.extend();
				                instance.init.apply(instance, arguments);

				                return instance;
				            },

				            /**
				             * Initializes a newly created object.
				             * Override this method to add some logic when your objects are created.
				             *
				             * @example
				             *
				             *     var MyType = CryptoJS.lib.Base.extend({
				             *         init: function () {
				             *             // ...
				             *         }
				             *     });
				             */
				            init: function () {
				            },

				            /**
				             * Copies properties into this object.
				             *
				             * @param {Object} properties The properties to mix in.
				             *
				             * @example
				             *
				             *     MyType.mixIn({
				             *         field: 'value'
				             *     });
				             */
				            mixIn: function (properties) {
				                for (var propertyName in properties) {
				                    if (properties.hasOwnProperty(propertyName)) {
				                        this[propertyName] = properties[propertyName];
				                    }
				                }

				                // IE won't copy toString using the loop above
				                if (properties.hasOwnProperty('toString')) {
				                    this.toString = properties.toString;
				                }
				            },

				            /**
				             * Creates a copy of this object.
				             *
				             * @return {Object} The clone.
				             *
				             * @example
				             *
				             *     var clone = instance.clone();
				             */
				            clone: function () {
				                return this.init.prototype.extend(this);
				            }
				        };
				    }());

				    /**
				     * An array of 32-bit words.
				     *
				     * @property {Array} words The array of 32-bit words.
				     * @property {number} sigBytes The number of significant bytes in this word array.
				     */
				    var WordArray = C_lib.WordArray = Base.extend({
				        /**
				         * Initializes a newly created word array.
				         *
				         * @param {Array} words (Optional) An array of 32-bit words.
				         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
				         *
				         * @example
				         *
				         *     var wordArray = CryptoJS.lib.WordArray.create();
				         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
				         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
				         */
				        init: function (words, sigBytes) {
				            words = this.words = words || [];

				            if (sigBytes != undefined$1) {
				                this.sigBytes = sigBytes;
				            } else {
				                this.sigBytes = words.length * 4;
				            }
				        },

				        /**
				         * Converts this word array to a string.
				         *
				         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
				         *
				         * @return {string} The stringified word array.
				         *
				         * @example
				         *
				         *     var string = wordArray + '';
				         *     var string = wordArray.toString();
				         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
				         */
				        toString: function (encoder) {
				            return (encoder || Hex).stringify(this);
				        },

				        /**
				         * Concatenates a word array to this word array.
				         *
				         * @param {WordArray} wordArray The word array to append.
				         *
				         * @return {WordArray} This word array.
				         *
				         * @example
				         *
				         *     wordArray1.concat(wordArray2);
				         */
				        concat: function (wordArray) {
				            // Shortcuts
				            var thisWords = this.words;
				            var thatWords = wordArray.words;
				            var thisSigBytes = this.sigBytes;
				            var thatSigBytes = wordArray.sigBytes;

				            // Clamp excess bits
				            this.clamp();

				            // Concat
				            if (thisSigBytes % 4) {
				                // Copy one byte at a time
				                for (var i = 0; i < thatSigBytes; i++) {
				                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
				                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
				                }
				            } else {
				                // Copy one word at a time
				                for (var j = 0; j < thatSigBytes; j += 4) {
				                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
				                }
				            }
				            this.sigBytes += thatSigBytes;

				            // Chainable
				            return this;
				        },

				        /**
				         * Removes insignificant bits.
				         *
				         * @example
				         *
				         *     wordArray.clamp();
				         */
				        clamp: function () {
				            // Shortcuts
				            var words = this.words;
				            var sigBytes = this.sigBytes;

				            // Clamp
				            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
				            words.length = Math.ceil(sigBytes / 4);
				        },

				        /**
				         * Creates a copy of this word array.
				         *
				         * @return {WordArray} The clone.
				         *
				         * @example
				         *
				         *     var clone = wordArray.clone();
				         */
				        clone: function () {
				            var clone = Base.clone.call(this);
				            clone.words = this.words.slice(0);

				            return clone;
				        },

				        /**
				         * Creates a word array filled with random bytes.
				         *
				         * @param {number} nBytes The number of random bytes to generate.
				         *
				         * @return {WordArray} The random word array.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var wordArray = CryptoJS.lib.WordArray.random(16);
				         */
				        random: function (nBytes) {
				            var words = [];

				            for (var i = 0; i < nBytes; i += 4) {
				                words.push(cryptoSecureRandomInt());
				            }

				            return new WordArray.init(words, nBytes);
				        }
				    });

				    /**
				     * Encoder namespace.
				     */
				    var C_enc = C.enc = {};

				    /**
				     * Hex encoding strategy.
				     */
				    var Hex = C_enc.Hex = {
				        /**
				         * Converts a word array to a hex string.
				         *
				         * @param {WordArray} wordArray The word array.
				         *
				         * @return {string} The hex string.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
				         */
				        stringify: function (wordArray) {
				            // Shortcuts
				            var words = wordArray.words;
				            var sigBytes = wordArray.sigBytes;

				            // Convert
				            var hexChars = [];
				            for (var i = 0; i < sigBytes; i++) {
				                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
				                hexChars.push((bite >>> 4).toString(16));
				                hexChars.push((bite & 0x0f).toString(16));
				            }

				            return hexChars.join('');
				        },

				        /**
				         * Converts a hex string to a word array.
				         *
				         * @param {string} hexStr The hex string.
				         *
				         * @return {WordArray} The word array.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
				         */
				        parse: function (hexStr) {
				            // Shortcut
				            var hexStrLength = hexStr.length;

				            // Convert
				            var words = [];
				            for (var i = 0; i < hexStrLength; i += 2) {
				                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
				            }

				            return new WordArray.init(words, hexStrLength / 2);
				        }
				    };

				    /**
				     * Latin1 encoding strategy.
				     */
				    var Latin1 = C_enc.Latin1 = {
				        /**
				         * Converts a word array to a Latin1 string.
				         *
				         * @param {WordArray} wordArray The word array.
				         *
				         * @return {string} The Latin1 string.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
				         */
				        stringify: function (wordArray) {
				            // Shortcuts
				            var words = wordArray.words;
				            var sigBytes = wordArray.sigBytes;

				            // Convert
				            var latin1Chars = [];
				            for (var i = 0; i < sigBytes; i++) {
				                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
				                latin1Chars.push(String.fromCharCode(bite));
				            }

				            return latin1Chars.join('');
				        },

				        /**
				         * Converts a Latin1 string to a word array.
				         *
				         * @param {string} latin1Str The Latin1 string.
				         *
				         * @return {WordArray} The word array.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
				         */
				        parse: function (latin1Str) {
				            // Shortcut
				            var latin1StrLength = latin1Str.length;

				            // Convert
				            var words = [];
				            for (var i = 0; i < latin1StrLength; i++) {
				                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
				            }

				            return new WordArray.init(words, latin1StrLength);
				        }
				    };

				    /**
				     * UTF-8 encoding strategy.
				     */
				    var Utf8 = C_enc.Utf8 = {
				        /**
				         * Converts a word array to a UTF-8 string.
				         *
				         * @param {WordArray} wordArray The word array.
				         *
				         * @return {string} The UTF-8 string.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
				         */
				        stringify: function (wordArray) {
				            try {
				                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
				            } catch (e) {
				                throw new Error('Malformed UTF-8 data');
				            }
				        },

				        /**
				         * Converts a UTF-8 string to a word array.
				         *
				         * @param {string} utf8Str The UTF-8 string.
				         *
				         * @return {WordArray} The word array.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
				         */
				        parse: function (utf8Str) {
				            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
				        }
				    };

				    /**
				     * Abstract buffered block algorithm template.
				     *
				     * The property blockSize must be implemented in a concrete subtype.
				     *
				     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
				     */
				    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
				        /**
				         * Resets this block algorithm's data buffer to its initial state.
				         *
				         * @example
				         *
				         *     bufferedBlockAlgorithm.reset();
				         */
				        reset: function () {
				            // Initial values
				            this._data = new WordArray.init();
				            this._nDataBytes = 0;
				        },

				        /**
				         * Adds new data to this block algorithm's buffer.
				         *
				         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
				         *
				         * @example
				         *
				         *     bufferedBlockAlgorithm._append('data');
				         *     bufferedBlockAlgorithm._append(wordArray);
				         */
				        _append: function (data) {
				            // Convert string to WordArray, else assume WordArray already
				            if (typeof data == 'string') {
				                data = Utf8.parse(data);
				            }

				            // Append
				            this._data.concat(data);
				            this._nDataBytes += data.sigBytes;
				        },

				        /**
				         * Processes available data blocks.
				         *
				         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
				         *
				         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
				         *
				         * @return {WordArray} The processed data.
				         *
				         * @example
				         *
				         *     var processedData = bufferedBlockAlgorithm._process();
				         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
				         */
				        _process: function (doFlush) {
				            var processedWords;

				            // Shortcuts
				            var data = this._data;
				            var dataWords = data.words;
				            var dataSigBytes = data.sigBytes;
				            var blockSize = this.blockSize;
				            var blockSizeBytes = blockSize * 4;

				            // Count blocks ready
				            var nBlocksReady = dataSigBytes / blockSizeBytes;
				            if (doFlush) {
				                // Round up to include partial blocks
				                nBlocksReady = Math.ceil(nBlocksReady);
				            } else {
				                // Round down to include only full blocks,
				                // less the number of blocks that must remain in the buffer
				                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
				            }

				            // Count words ready
				            var nWordsReady = nBlocksReady * blockSize;

				            // Count bytes ready
				            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

				            // Process blocks
				            if (nWordsReady) {
				                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
				                    // Perform concrete-algorithm logic
				                    this._doProcessBlock(dataWords, offset);
				                }

				                // Remove processed words
				                processedWords = dataWords.splice(0, nWordsReady);
				                data.sigBytes -= nBytesReady;
				            }

				            // Return processed words
				            return new WordArray.init(processedWords, nBytesReady);
				        },

				        /**
				         * Creates a copy of this object.
				         *
				         * @return {Object} The clone.
				         *
				         * @example
				         *
				         *     var clone = bufferedBlockAlgorithm.clone();
				         */
				        clone: function () {
				            var clone = Base.clone.call(this);
				            clone._data = this._data.clone();

				            return clone;
				        },

				        _minBufferSize: 0
				    });

				    /**
				     * Abstract hasher template.
				     *
				     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
				     */
				    C_lib.Hasher = BufferedBlockAlgorithm.extend({
				        /**
				         * Configuration options.
				         */
				        cfg: Base.extend(),

				        /**
				         * Initializes a newly created hasher.
				         *
				         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
				         *
				         * @example
				         *
				         *     var hasher = CryptoJS.algo.SHA256.create();
				         */
				        init: function (cfg) {
				            // Apply config defaults
				            this.cfg = this.cfg.extend(cfg);

				            // Set initial values
				            this.reset();
				        },

				        /**
				         * Resets this hasher to its initial state.
				         *
				         * @example
				         *
				         *     hasher.reset();
				         */
				        reset: function () {
				            // Reset data buffer
				            BufferedBlockAlgorithm.reset.call(this);

				            // Perform concrete-hasher logic
				            this._doReset();
				        },

				        /**
				         * Updates this hasher with a message.
				         *
				         * @param {WordArray|string} messageUpdate The message to append.
				         *
				         * @return {Hasher} This hasher.
				         *
				         * @example
				         *
				         *     hasher.update('message');
				         *     hasher.update(wordArray);
				         */
				        update: function (messageUpdate) {
				            // Append
				            this._append(messageUpdate);

				            // Update the hash
				            this._process();

				            // Chainable
				            return this;
				        },

				        /**
				         * Finalizes the hash computation.
				         * Note that the finalize operation is effectively a destructive, read-once operation.
				         *
				         * @param {WordArray|string} messageUpdate (Optional) A final message update.
				         *
				         * @return {WordArray} The hash.
				         *
				         * @example
				         *
				         *     var hash = hasher.finalize();
				         *     var hash = hasher.finalize('message');
				         *     var hash = hasher.finalize(wordArray);
				         */
				        finalize: function (messageUpdate) {
				            // Final message update
				            if (messageUpdate) {
				                this._append(messageUpdate);
				            }

				            // Perform concrete-hasher logic
				            var hash = this._doFinalize();

				            return hash;
				        },

				        blockSize: 512/32,

				        /**
				         * Creates a shortcut function to a hasher's object interface.
				         *
				         * @param {Hasher} hasher The hasher to create a helper for.
				         *
				         * @return {Function} The shortcut function.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
				         */
				        _createHelper: function (hasher) {
				            return function (message, cfg) {
				                return new hasher.init(cfg).finalize(message);
				            };
				        },

				        /**
				         * Creates a shortcut function to the HMAC's object interface.
				         *
				         * @param {Hasher} hasher The hasher to use in this HMAC helper.
				         *
				         * @return {Function} The shortcut function.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
				         */
				        _createHmacHelper: function (hasher) {
				            return function (message, key) {
				                return new C_algo.HMAC.init(hasher, key).finalize(message);
				            };
				        }
				    });

				    /**
				     * Algorithm namespace.
				     */
				    var C_algo = C.algo = {};

				    return C;
				}(Math));


				return CryptoJS;

			})); 
		} (core$1));
		return core$1.exports;
	}

	var sha256$1 = sha256$2.exports;

	var hasRequiredSha256;

	function requireSha256 () {
		if (hasRequiredSha256) return sha256$2.exports;
		hasRequiredSha256 = 1;
		(function (module, exports) {
	(function (root, factory) {
				{
					// CommonJS
					module.exports = factory(requireCore());
				}
			}(sha256$1, function (CryptoJS) {

				(function (Math) {
				    // Shortcuts
				    var C = CryptoJS;
				    var C_lib = C.lib;
				    var WordArray = C_lib.WordArray;
				    var Hasher = C_lib.Hasher;
				    var C_algo = C.algo;

				    // Initialization and round constants tables
				    var H = [];
				    var K = [];

				    // Compute constants
				    (function () {
				        function isPrime(n) {
				            var sqrtN = Math.sqrt(n);
				            for (var factor = 2; factor <= sqrtN; factor++) {
				                if (!(n % factor)) {
				                    return false;
				                }
				            }

				            return true;
				        }

				        function getFractionalBits(n) {
				            return ((n - (n | 0)) * 0x100000000) | 0;
				        }

				        var n = 2;
				        var nPrime = 0;
				        while (nPrime < 64) {
				            if (isPrime(n)) {
				                if (nPrime < 8) {
				                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
				                }
				                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

				                nPrime++;
				            }

				            n++;
				        }
				    }());

				    // Reusable object
				    var W = [];

				    /**
				     * SHA-256 hash algorithm.
				     */
				    var SHA256 = C_algo.SHA256 = Hasher.extend({
				        _doReset: function () {
				            this._hash = new WordArray.init(H.slice(0));
				        },

				        _doProcessBlock: function (M, offset) {
				            // Shortcut
				            var H = this._hash.words;

				            // Working variables
				            var a = H[0];
				            var b = H[1];
				            var c = H[2];
				            var d = H[3];
				            var e = H[4];
				            var f = H[5];
				            var g = H[6];
				            var h = H[7];

				            // Computation
				            for (var i = 0; i < 64; i++) {
				                if (i < 16) {
				                    W[i] = M[offset + i] | 0;
				                } else {
				                    var gamma0x = W[i - 15];
				                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
				                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
				                                   (gamma0x >>> 3);

				                    var gamma1x = W[i - 2];
				                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
				                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
				                                   (gamma1x >>> 10);

				                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
				                }

				                var ch  = (e & f) ^ (~e & g);
				                var maj = (a & b) ^ (a & c) ^ (b & c);

				                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
				                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

				                var t1 = h + sigma1 + ch + K[i] + W[i];
				                var t2 = sigma0 + maj;

				                h = g;
				                g = f;
				                f = e;
				                e = (d + t1) | 0;
				                d = c;
				                c = b;
				                b = a;
				                a = (t1 + t2) | 0;
				            }

				            // Intermediate hash value
				            H[0] = (H[0] + a) | 0;
				            H[1] = (H[1] + b) | 0;
				            H[2] = (H[2] + c) | 0;
				            H[3] = (H[3] + d) | 0;
				            H[4] = (H[4] + e) | 0;
				            H[5] = (H[5] + f) | 0;
				            H[6] = (H[6] + g) | 0;
				            H[7] = (H[7] + h) | 0;
				        },

				        _doFinalize: function () {
				            // Shortcuts
				            var data = this._data;
				            var dataWords = data.words;

				            var nBitsTotal = this._nDataBytes * 8;
				            var nBitsLeft = data.sigBytes * 8;

				            // Add padding
				            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
				            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
				            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
				            data.sigBytes = dataWords.length * 4;

				            // Hash final blocks
				            this._process();

				            // Return final computed hash
				            return this._hash;
				        },

				        clone: function () {
				            var clone = Hasher.clone.call(this);
				            clone._hash = this._hash.clone();

				            return clone;
				        }
				    });

				    /**
				     * Shortcut function to the hasher's object interface.
				     *
				     * @param {WordArray|string} message The message to hash.
				     *
				     * @return {WordArray} The hash.
				     *
				     * @static
				     *
				     * @example
				     *
				     *     var hash = CryptoJS.SHA256('message');
				     *     var hash = CryptoJS.SHA256(wordArray);
				     */
				    C.SHA256 = Hasher._createHelper(SHA256);

				    /**
				     * Shortcut function to the HMAC's object interface.
				     *
				     * @param {WordArray|string} message The message to hash.
				     * @param {WordArray|string} key The secret key.
				     *
				     * @return {WordArray} The HMAC.
				     *
				     * @static
				     *
				     * @example
				     *
				     *     var hmac = CryptoJS.HmacSHA256(message, key);
				     */
				    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
				}(Math));


				return CryptoJS.SHA256;

			})); 
		} (sha256$2));
		return sha256$2.exports;
	}

	var sha256Exports = requireSha256();
	var sha256 = /*@__PURE__*/getDefaultExportFromCjs(sha256Exports);

	var encBase64$1 = {exports: {}};

	var encBase64 = encBase64$1.exports;

	var hasRequiredEncBase64;

	function requireEncBase64 () {
		if (hasRequiredEncBase64) return encBase64$1.exports;
		hasRequiredEncBase64 = 1;
		(function (module, exports) {
	(function (root, factory) {
				{
					// CommonJS
					module.exports = factory(requireCore());
				}
			}(encBase64, function (CryptoJS) {

				(function () {
				    // Shortcuts
				    var C = CryptoJS;
				    var C_lib = C.lib;
				    var WordArray = C_lib.WordArray;
				    var C_enc = C.enc;

				    /**
				     * Base64 encoding strategy.
				     */
				    C_enc.Base64 = {
				        /**
				         * Converts a word array to a Base64 string.
				         *
				         * @param {WordArray} wordArray The word array.
				         *
				         * @return {string} The Base64 string.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
				         */
				        stringify: function (wordArray) {
				            // Shortcuts
				            var words = wordArray.words;
				            var sigBytes = wordArray.sigBytes;
				            var map = this._map;

				            // Clamp excess bits
				            wordArray.clamp();

				            // Convert
				            var base64Chars = [];
				            for (var i = 0; i < sigBytes; i += 3) {
				                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
				                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
				                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

				                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

				                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
				                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
				                }
				            }

				            // Add padding
				            var paddingChar = map.charAt(64);
				            if (paddingChar) {
				                while (base64Chars.length % 4) {
				                    base64Chars.push(paddingChar);
				                }
				            }

				            return base64Chars.join('');
				        },

				        /**
				         * Converts a Base64 string to a word array.
				         *
				         * @param {string} base64Str The Base64 string.
				         *
				         * @return {WordArray} The word array.
				         *
				         * @static
				         *
				         * @example
				         *
				         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
				         */
				        parse: function (base64Str) {
				            // Shortcuts
				            var base64StrLength = base64Str.length;
				            var map = this._map;
				            var reverseMap = this._reverseMap;

				            if (!reverseMap) {
				                    reverseMap = this._reverseMap = [];
				                    for (var j = 0; j < map.length; j++) {
				                        reverseMap[map.charCodeAt(j)] = j;
				                    }
				            }

				            // Ignore padding
				            var paddingChar = map.charAt(64);
				            if (paddingChar) {
				                var paddingIndex = base64Str.indexOf(paddingChar);
				                if (paddingIndex !== -1) {
				                    base64StrLength = paddingIndex;
				                }
				            }

				            // Convert
				            return parseLoop(base64Str, base64StrLength, reverseMap);

				        },

				        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
				    };

				    function parseLoop(base64Str, base64StrLength, reverseMap) {
				      var words = [];
				      var nBytes = 0;
				      for (var i = 0; i < base64StrLength; i++) {
				          if (i % 4) {
				              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
				              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
				              var bitsCombined = bits1 | bits2;
				              words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
				              nBytes++;
				          }
				      }
				      return WordArray.create(words, nBytes);
				    }
				}());


				return CryptoJS.enc.Base64;

			})); 
		} (encBase64$1));
		return encBase64$1.exports;
	}

	var encBase64Exports = requireEncBase64();
	var Base64 = /*@__PURE__*/getDefaultExportFromCjs(encBase64Exports);

	// src/types.ts
	function authenticationHashing_default(salt, challenge, msg) {
	  const hash = Base64.stringify(sha256(msg + salt));
	  return Base64.stringify(sha256(hash + challenge));
	}

	// src/base.ts
	var debug = createDebug("obs-websocket-js");
	var OBSWebSocketError = class extends Error {
	  constructor(code, message) {
	    super(message);
	    this.code = code;
	  }
	};
	var BaseOBSWebSocket = class _BaseOBSWebSocket extends EventEmitter {
	  static requestCounter = 1;
	  static generateMessageId() {
	    return String(_BaseOBSWebSocket.requestCounter++);
	  }
	  _identified = false;
	  internalListeners = new EventEmitter();
	  socket;
	  get identified() {
	    return this._identified;
	  }
	  /**
	   * Connect to an obs-websocket server
	   * @param url Websocket server to connect to (including ws:// or wss:// protocol)
	   * @param password Password
	   * @param identificationParams Data for Identify event
	   * @returns Hello & Identified messages data (combined)
	   */
	  async connect(url = "ws://127.0.0.1:4455", password, identificationParams = {}) {
	    if (this.socket) {
	      await this.disconnect();
	    }
	    try {
	      const connectionClosedPromise = this.internalEventPromise("ConnectionClosed");
	      const connectionErrorPromise = this.internalEventPromise("ConnectionError");
	      return await Promise.race([
	        (async () => {
	          const hello = await this.createConnection(url);
	          this.emit("Hello", hello);
	          return this.identify(hello, password, identificationParams);
	        })(),
	        // Choose the best promise for connection error/close
	        // In browser connection close has close code + reason,
	        // while in node error event has these
	        new Promise((resolve, reject) => {
	          void connectionErrorPromise.then((e) => {
	            if (e.message) {
	              reject(e);
	            }
	          });
	          void connectionClosedPromise.then((e) => {
	            reject(e);
	          });
	        })
	      ]);
	    } catch (error) {
	      await this.disconnect();
	      throw error;
	    }
	  }
	  /**
	   * Disconnect from obs-websocket server
	   */
	  async disconnect() {
	    if (!this.socket || this.socket.readyState === ws.CLOSED) {
	      return;
	    }
	    const connectionClosedPromise = this.internalEventPromise("ConnectionClosed");
	    this.socket.close();
	    await connectionClosedPromise;
	  }
	  /**
	   * Update session parameters
	   * @param data Reidentify data
	   * @returns Identified message data
	   */
	  async reidentify(data) {
	    const identifiedPromise = this.internalEventPromise(`op:${2 /* Identified */}`);
	    await this.message(3 /* Reidentify */, data);
	    return identifiedPromise;
	  }
	  /**
	   * Send a request to obs-websocket
	   * @param requestType Request name
	   * @param requestData Request data
	   * @returns Request response
	   */
	  async call(requestType, requestData) {
	    const requestId = _BaseOBSWebSocket.generateMessageId();
	    const responsePromise = this.internalEventPromise(`res:${requestId}`);
	    await this.message(6 /* Request */, {
	      requestId,
	      requestType,
	      requestData
	    });
	    const { requestStatus, responseData } = await responsePromise;
	    if (!requestStatus.result) {
	      throw new OBSWebSocketError(requestStatus.code, requestStatus.comment);
	    }
	    return responseData;
	  }
	  /**
	   * Send a batch request to obs-websocket
	   * @param requests Array of Request objects (type and data)
	   * @param options A set of options for how the batch will be executed
	   * @param options.executionType The mode of execution obs-websocket will run the batch in
	   * @param options.haltOnFailure Whether obs-websocket should stop executing the batch if one request fails
	   * @returns RequestBatch response
	   */
	  async callBatch(requests, options = {}) {
	    const requestId = _BaseOBSWebSocket.generateMessageId();
	    const responsePromise = this.internalEventPromise(`res:${requestId}`);
	    await this.message(8 /* RequestBatch */, {
	      requestId,
	      requests,
	      ...options
	    });
	    const { results } = await responsePromise;
	    return results;
	  }
	  /**
	   * Cleanup from socket disconnection
	   */
	  cleanup() {
	    if (!this.socket) {
	      return;
	    }
	    this.socket.onopen = null;
	    this.socket.onmessage = null;
	    this.socket.onerror = null;
	    this.socket.onclose = null;
	    this.socket = void 0;
	    this._identified = false;
	    this.internalListeners.removeAllListeners();
	  }
	  /**
	   * Create connection to specified obs-websocket server
	   *
	   * @private
	   * @param url Websocket address
	   * @returns Promise for hello data
	   */
	  async createConnection(url) {
	    var _a;
	    const connectionOpenedPromise = this.internalEventPromise("ConnectionOpened");
	    const helloPromise = this.internalEventPromise(`op:${0 /* Hello */}`);
	    this.socket = new ws(url, this.protocol);
	    this.socket.onopen = this.onOpen.bind(this);
	    this.socket.onmessage = this.onMessage.bind(this);
	    this.socket.onerror = this.onError.bind(this);
	    this.socket.onclose = this.onClose.bind(this);
	    await connectionOpenedPromise;
	    const protocol = (_a = this.socket) == null ? void 0 : _a.protocol;
	    if (!protocol) {
	      throw new OBSWebSocketError(-1, "Server sent no subprotocol");
	    }
	    if (protocol !== this.protocol) {
	      throw new OBSWebSocketError(-1, "Server sent an invalid subprotocol");
	    }
	    return helloPromise;
	  }
	  /**
	   * Send identify message
	   *
	   * @private
	   * @param hello Hello message data
	   * @param password Password
	   * @param identificationParams Identification params
	   * @returns Hello & Identified messages data (combined)
	   */
	  async identify({
	    authentication,
	    rpcVersion,
	    ...helloRest
	  }, password, identificationParams = {}) {
	    const data = {
	      rpcVersion,
	      ...identificationParams
	    };
	    if (authentication && password) {
	      data.authentication = authenticationHashing_default(authentication.salt, authentication.challenge, password);
	    }
	    const identifiedPromise = this.internalEventPromise(`op:${2 /* Identified */}`);
	    await this.message(1 /* Identify */, data);
	    const identified = await identifiedPromise;
	    this._identified = true;
	    this.emit("Identified", identified);
	    return {
	      rpcVersion,
	      ...helloRest,
	      ...identified
	    };
	  }
	  /**
	   * Send message to obs-websocket
	   *
	   * @private
	   * @param op WebSocketOpCode
	   * @param d Message data
	   */
	  async message(op, d) {
	    if (!this.socket) {
	      throw new Error("Not connected");
	    }
	    if (!this.identified && op !== 1) {
	      throw new Error("Socket not identified");
	    }
	    const encoded = await this.encodeMessage({
	      op,
	      d
	    });
	    this.socket.send(encoded);
	  }
	  /**
	   * Create a promise to listen for an event on internal listener
	   * (will be cleaned up on disconnect)
	   *
	   * @private
	   * @param event Event to listen to
	   * @returns Event data
	   */
	  async internalEventPromise(event) {
	    return new Promise((resolve) => {
	      this.internalListeners.once(event, resolve);
	    });
	  }
	  /**
	   * Websocket open event listener
	   *
	   * @private
	   * @param e Event
	   */
	  onOpen(e) {
	    debug("socket.open");
	    this.emit("ConnectionOpened");
	    this.internalListeners.emit("ConnectionOpened", e);
	  }
	  /**
	   * Websocket message event listener
	   *
	   * @private
	   * @param e Event
	   */
	  async onMessage(e) {
	    try {
	      const { op, d } = await this.decodeMessage(e.data);
	      debug("socket.message: %d %j", op, d);
	      if (op === void 0 || d === void 0) {
	        return;
	      }
	      switch (op) {
	        case 5 /* Event */: {
	          const { eventType, eventData } = d;
	          this.emit(eventType, eventData);
	          return;
	        }
	        case 7 /* RequestResponse */:
	        case 9 /* RequestBatchResponse */: {
	          const { requestId } = d;
	          this.internalListeners.emit(`res:${requestId}`, d);
	          return;
	        }
	        default:
	          this.internalListeners.emit(`op:${op}`, d);
	      }
	    } catch (error) {
	      debug("error handling message: %o", error);
	    }
	  }
	  /**
	   * Websocket error event listener
	   *
	   * @private
	   * @param e ErrorEvent
	   */
	  onError(e) {
	    debug("socket.error: %o", e);
	    const error = new OBSWebSocketError(-1, e.message);
	    this.emit("ConnectionError", error);
	    this.internalListeners.emit("ConnectionError", error);
	  }
	  /**
	   * Websocket close event listener
	   *
	   * @private
	   * @param e Event
	   */
	  onClose(e) {
	    debug("socket.close: %s (%d)", e.reason, e.code);
	    const error = new OBSWebSocketError(e.code, e.reason);
	    this.emit("ConnectionClosed", error);
	    this.internalListeners.emit("ConnectionClosed", error);
	    this.cleanup();
	  }
	};
	if (typeof exports !== "undefined") {
	  Object.defineProperty(exports, "__esModule", { value: true });
	}

	// src/json.ts
	var OBSWebSocket = class extends BaseOBSWebSocket {
	  protocol = "obswebsocket.json";
	  async encodeMessage(data) {
	    return JSON.stringify(data);
	  }
	  async decodeMessage(data) {
	    return JSON.parse(data);
	  }
	};
	var json_default = OBSWebSocket;

	const obs = new json_default();

	async function sendCommand (command, params) {
	  try {
	    // if (command.indexOf('Set') === 0)
	    //  console.log('Sending command:', command, 'with params:', params)
	    return await obs.call(command, params || {})
	  } catch (e) {
	    console.log('Error sending command', command, ' - error is:', e.message);
	    return {}
	  }
	}

	obs.on('error', err => {
	  console.error('Socket error:', err);
	});

	/* src\ProgramPreview.svelte generated by Svelte v4.2.19 */

	function get_each_context$3(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[12] = list[i];
		return child_ctx;
	}

	// (103:2) {#if isStudioMode}
	function create_if_block$3(ctx) {
		let div0;
		let img;
		let t;
		let div1;
		let each_value = ensure_array_like(/*transitions*/ ctx[3]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
		}

		return {
			c() {
				div0 = element("div");
				img = element("img");
				t = space();
				div1 = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr(img, "class", "has-background-dark");
				attr(img, "alt", "Preview");
				attr(div0, "class", "column");
				attr(div1, "class", "column is-narrow");
			},
			m(target, anchor) {
				insert(target, div0, anchor);
				append(div0, img);
				/*img_binding*/ ctx[7](img);
				insert(target, t, anchor);
				insert(target, div1, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div1, null);
					}
				}
			},
			p(ctx, dirty) {
				if (dirty & /*transitions*/ 8) {
					each_value = ensure_array_like(/*transitions*/ ctx[3]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$3(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$3(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div1, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}
			},
			d(detaching) {
				if (detaching) {
					detach(div0);
					detach(t);
					detach(div1);
				}

				/*img_binding*/ ctx[7](null);
				destroy_each(each_blocks, detaching);
			}
		};
	}

	// (108:6) {#each transitions as transition}
	function create_each_block$3(ctx) {
		let button;
		let t_value = /*transition*/ ctx[12].transitionName + "";
		let t;
		let mounted;
		let dispose;

		function click_handler() {
			return /*click_handler*/ ctx[8](/*transition*/ ctx[12]);
		}

		return {
			c() {
				button = element("button");
				t = text(t_value);
				attr(button, "class", "button is-fullwidth is-info");
				set_style(button, "margin-bottom", ".5rem");
			},
			m(target, anchor) {
				insert(target, button, anchor);
				append(button, t);

				if (!mounted) {
					dispose = listen(button, "click", click_handler);
					mounted = true;
				}
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;
				if (dirty & /*transitions*/ 8 && t_value !== (t_value = /*transition*/ ctx[12].transitionName + "")) set_data(t, t_value);
			},
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				mounted = false;
				dispose();
			}
		};
	}

	function create_fragment$4(ctx) {
		let div1;
		let t;
		let div0;
		let img;
		let if_block = /*isStudioMode*/ ctx[0] && create_if_block$3(ctx);

		return {
			c() {
				div1 = element("div");
				if (if_block) if_block.c();
				t = space();
				div0 = element("div");
				img = element("img");
				attr(img, "alt", "Program");
				attr(div0, "class", "column");
				attr(div1, "class", "columns is-centered is-vcentered has-text-centered");
			},
			m(target, anchor) {
				insert(target, div1, anchor);
				if (if_block) if_block.m(div1, null);
				append(div1, t);
				append(div1, div0);
				append(div0, img);
				/*img_binding_1*/ ctx[9](img);
			},
			p(ctx, [dirty]) {
				if (/*isStudioMode*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$3(ctx);
						if_block.c();
						if_block.m(div1, t);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) {
					detach(div1);
				}

				if (if_block) if_block.d();
				/*img_binding_1*/ ctx[9](null);
			}
		};
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { imageFormat = 'jpg' } = $$props;
		let isStudioMode = false;
		let programScene = '';
		let previewScene = '';
		let program = {};
		let preview = {};
		let screenshotInterval;
		let transitions = [];

		// let currentTransition = ''
		onMount(async () => {
			let data;

			if (!programScene) {
				data = await sendCommand('GetCurrentProgramScene');
				$$invalidate(5, programScene = data.currentProgramSceneName || '');
			}

			data = await sendCommand('GetStudioModeEnabled');

			if (data && data.studioModeEnabled) {
				$$invalidate(0, isStudioMode = true);
				data = await sendCommand('GetCurrentPreviewScene');
				$$invalidate(6, previewScene = data.currentPreviewSceneName || '');
			}

			data = await sendCommand('GetSceneTransitionList');
			console.log('GetSceneTransitionList', data);
			$$invalidate(3, transitions = data.transitions || []);

			// currentTransition = data.currentSceneTransitionName || ''
			screenshotInterval = setInterval(getScreenshot, 250);
		});

		onDestroy(() => {
			clearInterval(screenshotInterval);
		});

		obs.on('StudioModeStateChanged', async data => {
			console.log('StudioModeStateChanged', data.studioModeEnabled);
			$$invalidate(0, isStudioMode = data.studioModeEnabled);

			if (isStudioMode) {
				$$invalidate(6, previewScene = programScene);
			}
		});

		obs.on('CurrentPreviewSceneChanged', async data => {
			console.log('CurrentPreviewSceneChanged', data.sceneName);
			$$invalidate(6, previewScene = data.sceneName);
		});

		obs.on('CurrentProgramSceneChanged', async data => {
			console.log('CurrentProgramSceneChanged', data.sceneName);
			$$invalidate(5, programScene = data.sceneName);
		});

		obs.on('SceneNameChanged', async data => {
			if (data.oldSceneName === programScene) $$invalidate(5, programScene = data.sceneName);
			if (data.oldSceneName === previewScene) $$invalidate(6, previewScene = data.sceneName);
		});

		// TODO: does not exist???
		obs.on('TransitionListChanged', async data => {
			console.log('TransitionListChanged', data);
			$$invalidate(3, transitions = data.transitions || []);
		});

		async function getScreenshot() {
			if (!programScene) return;

			let data = await sendCommand('GetSourceScreenshot', {
				sourceName: programScene,
				imageFormat,
				imageWidth: 960,
				imageHeight: 540
			});

			if (data && data.imageData && program) {
				$$invalidate(1, program.src = data.imageData, program);
				$$invalidate(1, program.className = '', program);
			}

			if (isStudioMode) {
				if (previewScene !== programScene) {
					data = await sendCommand('GetSourceScreenshot', {
						sourceName: previewScene,
						imageFormat,
						imageWidth: 960,
						imageHeight: 540
					});
				}

				if (data && data.imageData && preview) {
					$$invalidate(2, preview.src = data.imageData, preview);
				}
			}
		}

		function img_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				preview = $$value;
				$$invalidate(2, preview);
			});
		}

		const click_handler = async transition => {
			await sendCommand('SetCurrentSceneTransition', {
				transitionName: transition.transitionName
			});

			await sendCommand('TriggerStudioModeTransition');
		};

		function img_binding_1($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				program = $$value;
				$$invalidate(1, program);
			});
		}

		$$self.$$set = $$props => {
			if ('imageFormat' in $$props) $$invalidate(4, imageFormat = $$props.imageFormat);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*programScene, previewScene*/ 96) {
				// eslint-disable-next-line
				(getScreenshot());
			}
		};

		return [
			isStudioMode,
			program,
			preview,
			transitions,
			imageFormat,
			programScene,
			previewScene,
			img_binding,
			click_handler,
			img_binding_1
		];
	}

	class ProgramPreview extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$4, create_fragment$4, safe_not_equal, { imageFormat: 4 });
		}
	}

	/* src\SourceButton.svelte generated by Svelte v4.2.19 */

	function create_if_block_1$1(ctx) {
		let img_1;
		let img_1_src_value;

		return {
			c() {
				img_1 = element("img");
				if (!src_url_equal(img_1.src, img_1_src_value = /*img*/ ctx[4])) attr(img_1, "src", img_1_src_value);
				attr(img_1, "alt", /*name*/ ctx[0]);
				attr(img_1, "class", "thumbnail svelte-xcafbk");
			},
			m(target, anchor) {
				insert(target, img_1, anchor);
			},
			p(ctx, dirty) {
				if (dirty & /*img*/ 16 && !src_url_equal(img_1.src, img_1_src_value = /*img*/ ctx[4])) {
					attr(img_1, "src", img_1_src_value);
				}

				if (dirty & /*name*/ 1) {
					attr(img_1, "alt", /*name*/ ctx[0]);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(img_1);
				}
			}
		};
	}

	// (27:2) {#if buttonStyle !== 'icon'}
	function create_if_block$2(ctx) {
		let t;

		return {
			c() {
				t = text(/*name*/ ctx[0]);
			},
			m(target, anchor) {
				insert(target, t, anchor);
			},
			p(ctx, dirty) {
				if (dirty & /*name*/ 1) set_data(t, /*name*/ ctx[0]);
			},
			d(detaching) {
				if (detaching) {
					detach(t);
				}
			}
		};
	}

	function create_fragment$3(ctx) {
		let button;
		let t;
		let button_style_value;
		let mounted;
		let dispose;
		let if_block0 = /*img*/ ctx[4] && create_if_block_1$1(ctx);
		let if_block1 = /*buttonStyle*/ ctx[1] !== 'icon' && create_if_block$2(ctx);

		return {
			c() {
				button = element("button");
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();

				attr(button, "style", button_style_value = /*buttonStyle*/ ctx[1] === 'icon'
				? /*style*/ ctx[5]
				: '');

				attr(button, "title", /*name*/ ctx[0]);
				attr(button, "class", "svelte-xcafbk");
				toggle_class(button, "title", /*buttonStyle*/ ctx[1] === 'text');
				toggle_class(button, "program", /*isProgram*/ ctx[2]);
				toggle_class(button, "preview", /*isPreview*/ ctx[3]);
				toggle_class(button, "with-icon", /*buttonStyle*/ ctx[1] === 'icon');
			},
			m(target, anchor) {
				insert(target, button, anchor);
				if (if_block0) if_block0.m(button, null);
				append(button, t);
				if (if_block1) if_block1.m(button, null);

				if (!mounted) {
					dispose = listen(button, "click", /*click_handler*/ ctx[8]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (/*img*/ ctx[4]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_1$1(ctx);
						if_block0.c();
						if_block0.m(button, t);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*buttonStyle*/ ctx[1] !== 'icon') {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block$2(ctx);
						if_block1.c();
						if_block1.m(button, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (dirty & /*buttonStyle, style*/ 34 && button_style_value !== (button_style_value = /*buttonStyle*/ ctx[1] === 'icon'
				? /*style*/ ctx[5]
				: '')) {
					attr(button, "style", button_style_value);
				}

				if (dirty & /*name*/ 1) {
					attr(button, "title", /*name*/ ctx[0]);
				}

				if (dirty & /*buttonStyle*/ 2) {
					toggle_class(button, "title", /*buttonStyle*/ ctx[1] === 'text');
				}

				if (dirty & /*isProgram*/ 4) {
					toggle_class(button, "program", /*isProgram*/ ctx[2]);
				}

				if (dirty & /*isPreview*/ 8) {
					toggle_class(button, "preview", /*isPreview*/ ctx[3]);
				}

				if (dirty & /*buttonStyle*/ 2) {
					toggle_class(button, "with-icon", /*buttonStyle*/ ctx[1] === 'icon');
				}
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				mounted = false;
				dispose();
			}
		};
	}

	function instance$3($$self, $$props, $$invalidate) {
		let style;
		let { name } = $$props;
		let { buttonStyle = 'text' } = $$props;
		let { icon = '#ffffff' } = $$props;
		let { isProgram = false } = $$props;
		let { isPreview = false } = $$props;
		let { img = '' } = $$props;
		const dispatch = createEventDispatcher();
		const click_handler = () => dispatch('click');

		$$self.$$set = $$props => {
			if ('name' in $$props) $$invalidate(0, name = $$props.name);
			if ('buttonStyle' in $$props) $$invalidate(1, buttonStyle = $$props.buttonStyle);
			if ('icon' in $$props) $$invalidate(7, icon = $$props.icon);
			if ('isProgram' in $$props) $$invalidate(2, isProgram = $$props.isProgram);
			if ('isPreview' in $$props) $$invalidate(3, isPreview = $$props.isPreview);
			if ('img' in $$props) $$invalidate(4, img = $$props.img);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*icon*/ 128) {
				$$invalidate(5, style = icon.startsWith('#')
				? `background-color: ${icon};`
				: `background-image: url(${icon});`);
			}
		};

		return [
			name,
			buttonStyle,
			isProgram,
			isPreview,
			img,
			style,
			dispatch,
			icon,
			click_handler
		];
	}

	class SourceButton extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$3, create_fragment$3, safe_not_equal, {
				name: 0,
				buttonStyle: 1,
				icon: 7,
				isProgram: 2,
				isPreview: 3,
				img: 4
			});
		}
	}

	/* src\SceneSwitcher.svelte generated by Svelte v4.2.19 */

	function get_each_context_1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[11] = list[i];
		return child_ctx;
	}

	function get_each_context$2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[11] = list[i];
		return child_ctx;
	}

	// (111:2) {:else}
	function create_else_block$1(ctx) {
		let each_1_anchor;
		let current;
		let each_value_1 = ensure_array_like(/*scenesFiltered*/ ctx[6]);
		let each_blocks = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		return {
			c() {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},
			m(target, anchor) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(target, anchor);
					}
				}

				insert(target, each_1_anchor, anchor);
				current = true;
			},
			p(ctx, dirty) {
				if (dirty & /*scenesFiltered, programScene, previewScene, buttonStyle, sceneIcons, Math, sceneClicker*/ 238) {
					each_value_1 = ensure_array_like(/*scenesFiltered*/ ctx[6]);
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_1, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block_1(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					group_outros();

					for (i = each_value_1.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i(local) {
				if (current) return;

				for (let i = 0; i < each_value_1.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(each_1_anchor);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	// (100:2) {#if editable}
	function create_if_block$1(ctx) {
		let each_1_anchor;
		let each_value = ensure_array_like(/*scenes*/ ctx[0].reverse());
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
		}

		return {
			c() {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},
			m(target, anchor) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(target, anchor);
					}
				}

				insert(target, each_1_anchor, anchor);
			},
			p(ctx, dirty) {
				if (dirty & /*scenes, sceneIcons, onIconChange, onNameChange*/ 801) {
					each_value = ensure_array_like(/*scenes*/ ctx[0].reverse());
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$2(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) {
					detach(each_1_anchor);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	// (112:4) {#each scenesFiltered as scene}
	function create_each_block_1(ctx) {
		let li;
		let sourcebutton;
		let t;
		let current;

		sourcebutton = new SourceButton({
				props: {
					name: /*scene*/ ctx[11].sceneName,
					isProgram: /*programScene*/ ctx[1] === /*scene*/ ctx[11].sceneName,
					isPreview: /*previewScene*/ ctx[2] === /*scene*/ ctx[11].sceneName,
					buttonStyle: /*buttonStyle*/ ctx[3],
					icon: /*sceneIcons*/ ctx[5][/*scene*/ ctx[11].sceneName] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
				}
			});

		sourcebutton.$on("click", function () {
			if (is_function(/*sceneClicker*/ ctx[7](/*scene*/ ctx[11]))) /*sceneClicker*/ ctx[7](/*scene*/ ctx[11]).apply(this, arguments);
		});

		return {
			c() {
				li = element("li");
				create_component(sourcebutton.$$.fragment);
				t = space();
				attr(li, "class", "svelte-6kdm22");
			},
			m(target, anchor) {
				insert(target, li, anchor);
				mount_component(sourcebutton, li, null);
				append(li, t);
				current = true;
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;
				const sourcebutton_changes = {};
				if (dirty & /*scenesFiltered*/ 64) sourcebutton_changes.name = /*scene*/ ctx[11].sceneName;
				if (dirty & /*programScene, scenesFiltered*/ 66) sourcebutton_changes.isProgram = /*programScene*/ ctx[1] === /*scene*/ ctx[11].sceneName;
				if (dirty & /*previewScene, scenesFiltered*/ 68) sourcebutton_changes.isPreview = /*previewScene*/ ctx[2] === /*scene*/ ctx[11].sceneName;
				if (dirty & /*buttonStyle*/ 8) sourcebutton_changes.buttonStyle = /*buttonStyle*/ ctx[3];
				if (dirty & /*sceneIcons, scenesFiltered*/ 96) sourcebutton_changes.icon = /*sceneIcons*/ ctx[5][/*scene*/ ctx[11].sceneName] || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
				sourcebutton.$set(sourcebutton_changes);
			},
			i(local) {
				if (current) return;
				transition_in(sourcebutton.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(sourcebutton.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(li);
				}

				destroy_component(sourcebutton);
			}
		};
	}

	// (101:4) {#each scenes.reverse() as scene}
	function create_each_block$2(ctx) {
		let li;
		let label0;
		let t1;
		let input0;
		let input0_title_value;
		let input0_value_value;
		let t2;
		let label1;
		let t4;
		let input1;
		let input1_title_value;
		let input1_value_value;
		let t5;
		let mounted;
		let dispose;

		return {
			c() {
				li = element("li");
				label0 = element("label");
				label0.textContent = "Name";
				t1 = space();
				input0 = element("input");
				t2 = space();
				label1 = element("label");
				label1.textContent = "Icon";
				t4 = space();
				input1 = element("input");
				t5 = space();
				attr(label0, "class", "label");
				attr(input0, "type", "text");
				attr(input0, "class", "input");
				attr(input0, "title", input0_title_value = /*scene*/ ctx[11].sceneName);
				input0.value = input0_value_value = /*scene*/ ctx[11].sceneName;
				attr(label1, "class", "label");
				attr(input1, "type", "text");
				attr(input1, "class", "input");
				attr(input1, "title", input1_title_value = /*scene*/ ctx[11].sceneName);
				input1.value = input1_value_value = /*sceneIcons*/ ctx[5][/*scene*/ ctx[11].sceneName] || '';
				attr(li, "class", "svelte-6kdm22");
			},
			m(target, anchor) {
				insert(target, li, anchor);
				append(li, label0);
				append(li, t1);
				append(li, input0);
				append(li, t2);
				append(li, label1);
				append(li, t4);
				append(li, input1);
				append(li, t5);

				if (!mounted) {
					dispose = [
						listen(input0, "change", /*onNameChange*/ ctx[8]),
						listen(input1, "change", /*onIconChange*/ ctx[9])
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (dirty & /*scenes*/ 1 && input0_title_value !== (input0_title_value = /*scene*/ ctx[11].sceneName)) {
					attr(input0, "title", input0_title_value);
				}

				if (dirty & /*scenes*/ 1 && input0_value_value !== (input0_value_value = /*scene*/ ctx[11].sceneName) && input0.value !== input0_value_value) {
					input0.value = input0_value_value;
				}

				if (dirty & /*scenes*/ 1 && input1_title_value !== (input1_title_value = /*scene*/ ctx[11].sceneName)) {
					attr(input1, "title", input1_title_value);
				}

				if (dirty & /*sceneIcons, scenes*/ 33 && input1_value_value !== (input1_value_value = /*sceneIcons*/ ctx[5][/*scene*/ ctx[11].sceneName] || '') && input1.value !== input1_value_value) {
					input1.value = input1_value_value;
				}
			},
			d(detaching) {
				if (detaching) {
					detach(li);
				}

				mounted = false;
				run_all(dispose);
			}
		};
	}

	function create_fragment$2(ctx) {
		let ol;
		let current_block_type_index;
		let if_block;
		let current;
		const if_block_creators = [create_if_block$1, create_else_block$1];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*editable*/ ctx[4]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		return {
			c() {
				ol = element("ol");
				if_block.c();
				attr(ol, "class", "svelte-6kdm22");
				toggle_class(ol, "column", /*editable*/ ctx[4]);
				toggle_class(ol, "with-icon", /*buttonStyle*/ ctx[3] === 'icon');
			},
			m(target, anchor) {
				insert(target, ol, anchor);
				if_blocks[current_block_type_index].m(ol, null);
				current = true;
			},
			p(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(ol, null);
				}

				if (!current || dirty & /*editable*/ 16) {
					toggle_class(ol, "column", /*editable*/ ctx[4]);
				}

				if (!current || dirty & /*buttonStyle*/ 8) {
					toggle_class(ol, "with-icon", /*buttonStyle*/ ctx[3] === 'icon');
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(ol);
				}

				if_blocks[current_block_type_index].d();
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { programScene = {} } = $$props;
		let { previewScene = {} } = $$props;
		let { scenes = [] } = $$props;
		let { buttonStyle = 'text' } = $$props; // text, screenshot, icon
		let { editable = false } = $$props;
		let scenesFiltered = [];
		let isStudioMode = false;
		const sceneIcons = JSON.parse(window.localStorage.getItem('sceneIcons') || '{}');

		onMount(async function () {
			let data = await sendCommand('GetSceneList');
			console.log('GetSceneList', data);
			$$invalidate(1, programScene = data.currentProgramSceneName || '');
			$$invalidate(2, previewScene = data.currentPreviewSceneName);
			$$invalidate(0, scenes = data.scenes);
			data = await sendCommand('GetStudioModeEnabled');

			if (data && data.studioModeEnabled) {
				isStudioMode = true;
				$$invalidate(2, previewScene = data.currentPreviewSceneName || '');
			}
		});

		obs.on('StudioModeStateChanged', async data => {
			console.log('StudioModeStateChanged', data.studioModeEnabled);
			isStudioMode = data.studioModeEnabled;
			$$invalidate(2, previewScene = programScene);
		});

		obs.on('SceneListChanged', async data => {
			console.log('SceneListChanged', data.scenes.length);
			$$invalidate(0, scenes = data.scenes);
		});

		obs.on('SceneCreated', async data => {
			console.log('SceneCreated', data);
		});

		obs.on('SceneRemoved', async data => {
			console.log('SceneRemoved', data);

			for (let i = 0; i < scenes.length; i++) {
				if (scenes[i].sceneName === data.sceneName) {
					delete scenes[i];
				}
			}
		});

		obs.on('SceneNameChanged', async data => {
			console.log('SceneNameChanged', data);

			for (let i = 0; i < scenes.length; i++) {
				if (scenes[i].sceneName === data.oldSceneName) {
					$$invalidate(0, scenes[i].sceneName = data.sceneName, scenes);
				}
			}

			// Rename in sceneIcons
			$$invalidate(5, sceneIcons[data.sceneName] = sceneIcons[data.oldSceneName], sceneIcons);
		});

		obs.on('CurrentProgramSceneChanged', data => {
			console.log('CurrentProgramSceneChanged', data);
			$$invalidate(1, programScene = data.sceneName || '');
		});

		obs.on('CurrentPreviewSceneChanged', async data => {
			console.log('CurrentPreviewSceneChanged', data);
			$$invalidate(2, previewScene = data.sceneName);
		});

		function sceneClicker(scene) {
			return async function () {
				if (isStudioMode) {
					await sendCommand('SetCurrentPreviewScene', { sceneName: scene.sceneName });
				} else {
					await sendCommand('SetCurrentProgramScene', { sceneName: scene.sceneName });
				}
			};
		}

		function onNameChange(event) {
			sendCommand('SetSceneName', {
				sceneName: event.target.title,
				newSceneName: event.target.value
			});
		}

		function onIconChange(event) {
			$$invalidate(5, sceneIcons[event.target.title] = event.target.value, sceneIcons);
		}

		$$self.$$set = $$props => {
			if ('programScene' in $$props) $$invalidate(1, programScene = $$props.programScene);
			if ('previewScene' in $$props) $$invalidate(2, previewScene = $$props.previewScene);
			if ('scenes' in $$props) $$invalidate(0, scenes = $$props.scenes);
			if ('buttonStyle' in $$props) $$invalidate(3, buttonStyle = $$props.buttonStyle);
			if ('editable' in $$props) $$invalidate(4, editable = $$props.editable);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*scenes*/ 1) {
				$$invalidate(6, scenesFiltered = scenes.filter(scene => scene.sceneName.indexOf('(hidden)') === -1).reverse());
			}

			if ($$self.$$.dirty & /*sceneIcons*/ 32) {
				// store sceneIcons on change
				window.localStorage.setItem('sceneIcons', JSON.stringify(sceneIcons));
			}
		};

		return [
			scenes,
			programScene,
			previewScene,
			buttonStyle,
			editable,
			sceneIcons,
			scenesFiltered,
			sceneClicker,
			onNameChange,
			onIconChange
		];
	}

	class SceneSwitcher extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$2, create_fragment$2, safe_not_equal, {
				programScene: 1,
				previewScene: 2,
				scenes: 0,
				buttonStyle: 3,
				editable: 4
			});
		}
	}

	/* src\SourceSwitcher.svelte generated by Svelte v4.2.19 */

	function get_each_context$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[11] = list[i];
		return child_ctx;
	}

	// (122:2) {#each items as item}
	function create_each_block$1(ctx) {
		let li;
		let sourcebutton;
		let t;
		let current;

		sourcebutton = new SourceButton({
				props: {
					name: /*item*/ ctx[11].sourceName,
					isProgram: /*item*/ ctx[11].sceneItemEnabled,
					img: /*item*/ ctx[11].img,
					buttonStyle: /*buttonStyle*/ ctx[0]
				}
			});

		sourcebutton.$on("click", function () {
			if (is_function(/*backgroundClicker*/ ctx[2](/*item*/ ctx[11].sceneItemId))) /*backgroundClicker*/ ctx[2](/*item*/ ctx[11].sceneItemId).apply(this, arguments);
		});

		return {
			c() {
				li = element("li");
				create_component(sourcebutton.$$.fragment);
				t = space();
				attr(li, "class", "svelte-1ottsv0");
			},
			m(target, anchor) {
				insert(target, li, anchor);
				mount_component(sourcebutton, li, null);
				append(li, t);
				current = true;
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;
				const sourcebutton_changes = {};
				if (dirty & /*items*/ 2) sourcebutton_changes.name = /*item*/ ctx[11].sourceName;
				if (dirty & /*items*/ 2) sourcebutton_changes.isProgram = /*item*/ ctx[11].sceneItemEnabled;
				if (dirty & /*items*/ 2) sourcebutton_changes.img = /*item*/ ctx[11].img;
				if (dirty & /*buttonStyle*/ 1) sourcebutton_changes.buttonStyle = /*buttonStyle*/ ctx[0];
				sourcebutton.$set(sourcebutton_changes);
			},
			i(local) {
				if (current) return;
				transition_in(sourcebutton.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(sourcebutton.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(li);
				}

				destroy_component(sourcebutton);
			}
		};
	}

	function create_fragment$1(ctx) {
		let ol;
		let t0;
		let button;
		let current;
		let mounted;
		let dispose;
		let each_value = ensure_array_like(/*items*/ ctx[1]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		return {
			c() {
				ol = element("ol");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t0 = space();
				button = element("button");
				button.textContent = "Load missing thumbnails";
				attr(ol, "class", "svelte-1ottsv0");
				attr(button, "class", "button");
			},
			m(target, anchor) {
				insert(target, ol, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(ol, null);
					}
				}

				insert(target, t0, anchor);
				insert(target, button, anchor);
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*loadMissingScreenshots*/ ctx[3]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (dirty & /*items, buttonStyle, backgroundClicker*/ 7) {
					each_value = ensure_array_like(/*items*/ ctx[1]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(ol, null);
						}
					}

					group_outros();

					for (i = each_value.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(ol);
					detach(t0);
					detach(button);
				}

				destroy_each(each_blocks, detaching);
				mounted = false;
				dispose();
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { buttonStyle = 'screenshot' } = $$props;
		let { name = 'Backgrounds (hidden)' } = $$props;
		let { imageFormat = 'jpg' } = $$props;
		let items = [];
		const itemsIndex = {};
		let currentItemId = '';
		const screenshottedIds = new Set();

		onMount(async function () {
			await refreshItems();
		});

		async function refreshItems() {
			const data = await sendCommand('GetSceneItemList', { sceneName: name });
			$$invalidate(1, items = data.sceneItems || items);

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				itemsIndex[item.sceneItemId] = i;

				if (item.sceneItemEnabled) {
					currentItemId = item.sceneItemId;
				}
			}

			for (let i = 0; i < items.length; i++) {
				$$invalidate(1, items[i].img = await getItemScreenshot(items[i]), items);
			}
		}

		obs.on('SceneItemEnableStateChanged', async data => {
			if (data.sceneName === name) {
				const i = itemsIndex[data.sceneItemId];
				$$invalidate(1, items[i].sceneItemEnabled = data.sceneItemEnabled, items);

				if (items[i].sceneItemEnabled && !items[i].img) {
					$$invalidate(1, items[i].img = await getItemScreenshot(items[i]), items);

					if (screenshottedIds.has(items[i].sceneItemId)) {
						$$invalidate(1, items[i].img = await getItemScreenshot(items[i]), items);

						await sendCommand('SetSceneItemEnabled', {
							sceneName: name,
							sceneItemId: items[i].sceneItemId,
							sceneItemEnabled: false
						});

						screenshottedIds.delete(items[i].sceneItemId);
					}
				}
			}
		});

		obs.on('SceneItemListReindexed', async data => {
			if (data.sceneName === name) {
				await refreshItems();
			}
		});

		obs.on('SceneItemCreated', async data => {
			if (data.sceneName === name) {
				await refreshItems();
			}
		});

		obs.on('SceneItemRemoved', async data => {
			if (data.sceneName === name) {
				await refreshItems();
			}
		});

		function backgroundClicker(itemId) {
			return async function () {
				await sendCommand('SetSceneItemEnabled', {
					sceneName: name,
					sceneItemId: itemId,
					sceneItemEnabled: true
				});

				if (currentItemId !== itemId) {
					await sendCommand('SetSceneItemEnabled', {
						sceneName: name,
						sceneItemId: currentItemId,
						sceneItemEnabled: false
					});
				}

				currentItemId = itemId;
			};
		}

		async function getItemScreenshot(item) {
			if (item.img) return item.img;
			let data = null;
			let retry = item.sceneItemEnabled ? 3 : 1;

			while (retry--) {
				// Random sleep to avoid burst of thumbnail rendering
				await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

				data = await sendCommand('GetSourceScreenshot', {
					sourceName: item.sourceName,
					imageFormat,
					width: 192,
					height: 108
				});

				if (data && data.imageData) {
					return data.imageData;
				}
			}
		}

		async function loadMissingScreenshots() {
			for (let i = 0; i < items.length; i++) {
				if (!items[i].img) {
					await sendCommand('SetSceneItemEnabled', {
						sceneName: name,
						sceneItemId: items[i].sceneItemId,
						sceneItemEnabled: true
					});

					screenshottedIds.add(items[i].sceneItemId);
				}
			}
		}

		$$self.$$set = $$props => {
			if ('buttonStyle' in $$props) $$invalidate(0, buttonStyle = $$props.buttonStyle);
			if ('name' in $$props) $$invalidate(4, name = $$props.name);
			if ('imageFormat' in $$props) $$invalidate(5, imageFormat = $$props.imageFormat);
		};

		return [
			buttonStyle,
			items,
			backgroundClicker,
			loadMissingScreenshots,
			name,
			imageFormat
		];
	}

	class SourceSwitcher extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$1, create_fragment$1, safe_not_equal, { buttonStyle: 0, name: 4, imageFormat: 5 });
		}
	}

	/* src\App.svelte generated by Svelte v4.2.19 */

	const { document: document_1 } = globals;

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[36] = list[i];
		return child_ctx;
	}

	// (536:10) {:else}
	function create_else_block_4(ctx) {
		let button;
		let t_value = (/*errorMessage*/ ctx[8] || 'Disconnected') + "";
		let t;

		return {
			c() {
				button = element("button");
				t = text(t_value);
				attr(button, "class", "button is-danger");
				button.disabled = true;
			},
			m(target, anchor) {
				insert(target, button, anchor);
				append(button, t);
			},
			p(ctx, dirty) {
				if (dirty[0] & /*errorMessage*/ 256 && t_value !== (t_value = (/*errorMessage*/ ctx[8] || 'Disconnected') + "")) set_data(t, t_value);
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) {
					detach(button);
				}
			}
		};
	}

	// (373:10) {#if connected}
	function create_if_block_4(ctx) {
		let current_block_type_index;
		let if_block0;
		let t0;
		let current_block_type_index_1;
		let if_block1;
		let t1;
		let button;
		let span;
		let icon;
		let current;
		let mounted;
		let dispose;
		const if_block_creators = [create_if_block_6, create_else_block_3];
		const if_blocks = [];

		function select_block_type_1(ctx, dirty) {
			if (/*heartbeat*/ ctx[2] && /*heartbeat*/ ctx[2].recording && /*heartbeat*/ ctx[2].recording.outputActive) return 0;
			return 1;
		}

		current_block_type_index = select_block_type_1(ctx);
		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
		const if_block_creators_1 = [create_if_block_5, create_else_block_1];
		const if_blocks_1 = [];

		function select_block_type_3(ctx, dirty) {
			if (/*isVirtualCamActive*/ ctx[4]) return 0;
			return 1;
		}

		current_block_type_index_1 = select_block_type_3(ctx);
		if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
		icon = new Index({ props: { path: mdiConnection } });

		return {
			c() {
				if_block0.c();
				t0 = space();
				if_block1.c();
				t1 = space();
				button = element("button");
				span = element("span");
				create_component(icon.$$.fragment);
				attr(span, "class", "icon");
				attr(button, "class", "button is-danger is-light");
				attr(button, "title", "Disconnect");
			},
			m(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert(target, t0, anchor);
				if_blocks_1[current_block_type_index_1].m(target, anchor);
				insert(target, t1, anchor);
				insert(target, button, anchor);
				append(button, span);
				mount_component(icon, span, null);
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*disconnect*/ ctx[19]);
					mounted = true;
				}
			},
			p(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type_1(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block0 = if_blocks[current_block_type_index];

					if (!if_block0) {
						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block0.c();
					} else {
						if_block0.p(ctx, dirty);
					}

					transition_in(if_block0, 1);
					if_block0.m(t0.parentNode, t0);
				}

				let previous_block_index_1 = current_block_type_index_1;
				current_block_type_index_1 = select_block_type_3(ctx);

				if (current_block_type_index_1 === previous_block_index_1) {
					if_blocks_1[current_block_type_index_1].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
						if_blocks_1[previous_block_index_1] = null;
					});

					check_outros();
					if_block1 = if_blocks_1[current_block_type_index_1];

					if (!if_block1) {
						if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
						if_block1.c();
					} else {
						if_block1.p(ctx, dirty);
					}

					transition_in(if_block1, 1);
					if_block1.m(t1.parentNode, t1);
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block0);
				transition_in(if_block1);
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(if_block0);
				transition_out(if_block1);
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(t0);
					detach(t1);
					detach(button);
				}

				if_blocks[current_block_type_index].d(detaching);
				if_blocks_1[current_block_type_index_1].d(detaching);
				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};
	}

	// (427:12) {:else}
	function create_else_block_3(ctx) {
		let button;
		let span;
		let icon;
		let current;
		let mounted;
		let dispose;
		icon = new Index({ props: { path: mdiRecord } });

		return {
			c() {
				button = element("button");
				span = element("span");
				create_component(icon.$$.fragment);
				attr(span, "class", "icon");
				attr(button, "class", "button is-danger is-light");
				attr(button, "title", "Start Recording");
			},
			m(target, anchor) {
				insert(target, button, anchor);
				append(button, span);
				mount_component(icon, span, null);
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*startRecording*/ ctx[12]);
					mounted = true;
				}
			},
			p: noop$1,
			i(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};
	}

	// (401:12) {#if heartbeat && heartbeat.recording && heartbeat.recording.outputActive}
	function create_if_block_6(ctx) {
		let current_block_type_index;
		let if_block;
		let t0;
		let button;
		let span0;
		let icon;
		let t1;
		let span1;
		let t2_value = formatTime(/*heartbeat*/ ctx[2].recording.outputDuration) + "";
		let t2;
		let current;
		let mounted;
		let dispose;
		const if_block_creators = [create_if_block_7, create_else_block_2];
		const if_blocks = [];

		function select_block_type_2(ctx, dirty) {
			if (/*heartbeat*/ ctx[2].recording.outputPaused) return 0;
			return 1;
		}

		current_block_type_index = select_block_type_2(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
		icon = new Index({ props: { path: mdiStop } });

		return {
			c() {
				if_block.c();
				t0 = space();
				button = element("button");
				span0 = element("span");
				create_component(icon.$$.fragment);
				t1 = space();
				span1 = element("span");
				t2 = text(t2_value);
				attr(span0, "class", "icon");
				attr(button, "class", "button is-danger");
				attr(button, "title", "Stop Recording");
			},
			m(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert(target, t0, anchor);
				insert(target, button, anchor);
				append(button, span0);
				mount_component(icon, span0, null);
				append(button, t1);
				append(button, span1);
				append(span1, t2);
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*stopRecording*/ ctx[13]);
					mounted = true;
				}
			},
			p(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type_2(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(t0.parentNode, t0);
				}

				if ((!current || dirty[0] & /*heartbeat*/ 4) && t2_value !== (t2_value = formatTime(/*heartbeat*/ ctx[2].recording.outputDuration) + "")) set_data(t2, t2_value);
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(t0);
					detach(button);
				}

				if_blocks[current_block_type_index].d(detaching);
				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};
	}

	// (410:14) {:else}
	function create_else_block_2(ctx) {
		let button;
		let span;
		let icon;
		let current;
		let mounted;
		let dispose;
		icon = new Index({ props: { path: mdiPause } });

		return {
			c() {
				button = element("button");
				span = element("span");
				create_component(icon.$$.fragment);
				attr(span, "class", "icon");
				attr(button, "class", "button is-success");
				attr(button, "title", "Pause Recording");
			},
			m(target, anchor) {
				insert(target, button, anchor);
				append(button, span);
				mount_component(icon, span, null);
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*pauseRecording*/ ctx[16]);
					mounted = true;
				}
			},
			p: noop$1,
			i(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};
	}

	// (402:14) {#if heartbeat.recording.outputPaused}
	function create_if_block_7(ctx) {
		let button;
		let span;
		let icon;
		let current;
		let mounted;
		let dispose;
		icon = new Index({ props: { path: mdiPlayPause } });

		return {
			c() {
				button = element("button");
				span = element("span");
				create_component(icon.$$.fragment);
				attr(span, "class", "icon");
				attr(button, "class", "button is-danger");
				attr(button, "title", "Resume Recording");
			},
			m(target, anchor) {
				insert(target, button, anchor);
				append(button, span);
				mount_component(icon, span, null);
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*resumeRecording*/ ctx[17]);
					mounted = true;
				}
			},
			p: noop$1,
			i(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};
	}

	// (444:12) {:else}
	function create_else_block_1(ctx) {
		let button;
		let span;
		let icon;
		let current;
		let mounted;
		let dispose;
		icon = new Index({ props: { path: mdiCamera } });

		return {
			c() {
				button = element("button");
				span = element("span");
				create_component(icon.$$.fragment);
				attr(span, "class", "icon");
				attr(button, "class", "button is-danger is-light");
				attr(button, "title", "Start Virtual Webcam");
			},
			m(target, anchor) {
				insert(target, button, anchor);
				append(button, span);
				mount_component(icon, span, null);
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*startVirtualCam*/ ctx[14]);
					mounted = true;
				}
			},
			p: noop$1,
			i(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};
	}

	// (436:12) {#if isVirtualCamActive}
	function create_if_block_5(ctx) {
		let button;
		let span;
		let icon;
		let current;
		let mounted;
		let dispose;
		icon = new Index({ props: { path: mdiCameraOff } });

		return {
			c() {
				button = element("button");
				span = element("span");
				create_component(icon.$$.fragment);
				attr(span, "class", "icon");
				attr(button, "class", "button is-danger");
				attr(button, "title", "Stop Virtual Webcam");
			},
			m(target, anchor) {
				insert(target, button, anchor);
				append(button, span);
				mount_component(icon, span, null);
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*stopVirtualCam*/ ctx[15]);
					mounted = true;
				}
			},
			p: noop$1,
			i(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};
	}

	// (581:4) {:else}
	function create_else_block(ctx) {
		let p0;
		let t1;
		let form;
		let div;
		let p1;
		let input0;
		let t2;
		let input1;
		let t3;
		let p2;
		let t5;
		let p3;
		let mounted;
		let dispose;

		return {
			c() {
				p0 = element("p");
				p0.textContent = "Enter your OBS host:port below and click \"connect\".";
				t1 = space();
				form = element("form");
				div = element("div");
				p1 = element("p");
				input0 = element("input");
				t2 = space();
				input1 = element("input");
				t3 = space();
				p2 = element("p");
				p2.innerHTML = `<button class="button is-success">Connect</button>`;
				t5 = space();
				p3 = element("p");
				p3.textContent = `Build: ${__APP_VERSION__}`;
				attr(input0, "id", "host");
				attr(input0, "class", "input");
				attr(input0, "type", "text");
				attr(input0, "autocomplete", "");
				attr(input0, "placeholder", "ws://localhost:4455");
				attr(input1, "id", "password");
				attr(input1, "class", "input");
				attr(input1, "type", "password");
				attr(input1, "autocomplete", "current-password");
				attr(input1, "placeholder", "password (leave empty if you have disabled authentication)");
				attr(p1, "class", "control is-expanded");
				attr(p2, "class", "control");
				attr(div, "class", "field is-grouped");
				attr(p3, "class", "help");
			},
			m(target, anchor) {
				insert(target, p0, anchor);
				insert(target, t1, anchor);
				insert(target, form, anchor);
				append(form, div);
				append(div, p1);
				append(p1, input0);
				set_input_value(input0, /*address*/ ctx[5]);
				append(p1, t2);
				append(p1, input1);
				set_input_value(input1, /*password*/ ctx[6]);
				append(div, t3);
				append(div, p2);
				insert(target, t5, anchor);
				insert(target, p3, anchor);

				if (!mounted) {
					dispose = [
						listen(input0, "input", /*input0_input_handler*/ ctx[21]),
						listen(input1, "input", /*input1_input_handler*/ ctx[22]),
						listen(form, "submit", prevent_default(/*connect*/ ctx[18]))
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (dirty[0] & /*address*/ 32 && input0.value !== /*address*/ ctx[5]) {
					set_input_value(input0, /*address*/ ctx[5]);
				}

				if (dirty[0] & /*password*/ 64 && input1.value !== /*password*/ ctx[6]) {
					set_input_value(input1, /*password*/ ctx[6]);
				}
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) {
					detach(p0);
					detach(t1);
					detach(form);
					detach(t5);
					detach(p3);
				}

				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (560:4) {#if connected}
	function create_if_block(ctx) {
		let t0;
		let sceneswitcher;
		let updating_scenes;
		let t1;
		let t2;
		let each_1_anchor;
		let current;
		let if_block0 = /*isSceneOnTop*/ ctx[0] && create_if_block_3(ctx);

		function sceneswitcher_scenes_binding(value) {
			/*sceneswitcher_scenes_binding*/ ctx[20](value);
		}

		let sceneswitcher_props = {
			buttonStyle: /*isIconMode*/ ctx[10] ? 'icon' : 'text',
			editable
		};

		if (/*scenes*/ ctx[7] !== void 0) {
			sceneswitcher_props.scenes = /*scenes*/ ctx[7];
		}

		sceneswitcher = new SceneSwitcher({ props: sceneswitcher_props });
		binding_callbacks.push(() => bind(sceneswitcher, 'scenes', sceneswitcher_scenes_binding));
		let if_block1 = !/*isSceneOnTop*/ ctx[0] && create_if_block_2(ctx);
		let each_value = ensure_array_like(/*scenes*/ ctx[7]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		return {
			c() {
				if (if_block0) if_block0.c();
				t0 = space();
				create_component(sceneswitcher.$$.fragment);
				t1 = space();
				if (if_block1) if_block1.c();
				t2 = space();

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},
			m(target, anchor) {
				if (if_block0) if_block0.m(target, anchor);
				insert(target, t0, anchor);
				mount_component(sceneswitcher, target, anchor);
				insert(target, t1, anchor);
				if (if_block1) if_block1.m(target, anchor);
				insert(target, t2, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(target, anchor);
					}
				}

				insert(target, each_1_anchor, anchor);
				current = true;
			},
			p(ctx, dirty) {
				if (/*isSceneOnTop*/ ctx[0]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty[0] & /*isSceneOnTop*/ 1) {
							transition_in(if_block0, 1);
						}
					} else {
						if_block0 = create_if_block_3(ctx);
						if_block0.c();
						transition_in(if_block0, 1);
						if_block0.m(t0.parentNode, t0);
					}
				} else if (if_block0) {
					group_outros();

					transition_out(if_block0, 1, 1, () => {
						if_block0 = null;
					});

					check_outros();
				}

				const sceneswitcher_changes = {};

				if (!updating_scenes && dirty[0] & /*scenes*/ 128) {
					updating_scenes = true;
					sceneswitcher_changes.scenes = /*scenes*/ ctx[7];
					add_flush_callback(() => updating_scenes = false);
				}

				sceneswitcher.$set(sceneswitcher_changes);

				if (!/*isSceneOnTop*/ ctx[0]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);

						if (dirty[0] & /*isSceneOnTop*/ 1) {
							transition_in(if_block1, 1);
						}
					} else {
						if_block1 = create_if_block_2(ctx);
						if_block1.c();
						transition_in(if_block1, 1);
						if_block1.m(t2.parentNode, t2);
					}
				} else if (if_block1) {
					group_outros();

					transition_out(if_block1, 1, 1, () => {
						if_block1 = null;
					});

					check_outros();
				}

				if (dirty[0] & /*scenes, imageFormat*/ 640) {
					each_value = ensure_array_like(/*scenes*/ ctx[7]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					group_outros();

					for (i = each_value.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block0);
				transition_in(sceneswitcher.$$.fragment, local);
				transition_in(if_block1);

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o(local) {
				transition_out(if_block0);
				transition_out(sceneswitcher.$$.fragment, local);
				transition_out(if_block1);
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(t0);
					detach(t1);
					detach(t2);
					detach(each_1_anchor);
				}

				if (if_block0) if_block0.d(detaching);
				destroy_component(sceneswitcher, detaching);
				if (if_block1) if_block1.d(detaching);
				destroy_each(each_blocks, detaching);
			}
		};
	}

	// (561:6) {#if isSceneOnTop}
	function create_if_block_3(ctx) {
		let programpreview;
		let current;

		programpreview = new ProgramPreview({
				props: { imageFormat: /*imageFormat*/ ctx[9] }
			});

		return {
			c() {
				create_component(programpreview.$$.fragment);
			},
			m(target, anchor) {
				mount_component(programpreview, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const programpreview_changes = {};
				if (dirty[0] & /*imageFormat*/ 512) programpreview_changes.imageFormat = /*imageFormat*/ ctx[9];
				programpreview.$set(programpreview_changes);
			},
			i(local) {
				if (current) return;
				transition_in(programpreview.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(programpreview.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(programpreview, detaching);
			}
		};
	}

	// (569:6) {#if !isSceneOnTop}
	function create_if_block_2(ctx) {
		let programpreview;
		let current;

		programpreview = new ProgramPreview({
				props: { imageFormat: /*imageFormat*/ ctx[9] }
			});

		return {
			c() {
				create_component(programpreview.$$.fragment);
			},
			m(target, anchor) {
				mount_component(programpreview, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const programpreview_changes = {};
				if (dirty[0] & /*imageFormat*/ 512) programpreview_changes.imageFormat = /*imageFormat*/ ctx[9];
				programpreview.$set(programpreview_changes);
			},
			i(local) {
				if (current) return;
				transition_in(programpreview.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(programpreview.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(programpreview, detaching);
			}
		};
	}

	// (573:8) {#if scene.sceneName.indexOf('(switch)') > 0}
	function create_if_block_1(ctx) {
		let sourceswitcher;
		let current;

		sourceswitcher = new SourceSwitcher({
				props: {
					name: /*scene*/ ctx[36].sceneName,
					imageFormat: /*imageFormat*/ ctx[9],
					buttonStyle: "screenshot"
				}
			});

		return {
			c() {
				create_component(sourceswitcher.$$.fragment);
			},
			m(target, anchor) {
				mount_component(sourceswitcher, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const sourceswitcher_changes = {};
				if (dirty[0] & /*scenes*/ 128) sourceswitcher_changes.name = /*scene*/ ctx[36].sceneName;
				if (dirty[0] & /*imageFormat*/ 512) sourceswitcher_changes.imageFormat = /*imageFormat*/ ctx[9];
				sourceswitcher.$set(sourceswitcher_changes);
			},
			i(local) {
				if (current) return;
				transition_in(sourceswitcher.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(sourceswitcher.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(sourceswitcher, detaching);
			}
		};
	}

	// (572:6) {#each scenes as scene}
	function create_each_block(ctx) {
		let show_if = /*scene*/ ctx[36].sceneName.indexOf('(switch)') > 0;
		let if_block_anchor;
		let current;
		let if_block = show_if && create_if_block_1(ctx);

		return {
			c() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
				current = true;
			},
			p(ctx, dirty) {
				if (dirty[0] & /*scenes*/ 128) show_if = /*scene*/ ctx[36].sceneName.indexOf('(switch)') > 0;

				if (show_if) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty[0] & /*scenes*/ 128) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block_1(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(if_block_anchor);
				}

				if (if_block) if_block.d(detaching);
			}
		};
	}

	function create_fragment(ctx) {
		let t0;
		let nav;
		let div0;
		let t6;
		let div4;
		let div3;
		let div2;
		let div1;
		let current_block_type_index;
		let if_block0;
		let t7;
		let button1;
		let span3;
		let icon;
		let t8;
		let section;
		let div5;
		let current_block_type_index_1;
		let if_block1;
		let current;
		let mounted;
		let dispose;
		const if_block_creators = [create_if_block_4, create_else_block_4];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*connected*/ ctx[1]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		icon = new Index({
				props: {
					path: /*isFullScreen*/ ctx[3]
					? mdiFullscreenExit
					: mdiFullscreen
				}
			});

		const if_block_creators_1 = [create_if_block, create_else_block];
		const if_blocks_1 = [];

		function select_block_type_4(ctx, dirty) {
			if (/*connected*/ ctx[1]) return 0;
			return 1;
		}

		current_block_type_index_1 = select_block_type_4(ctx);
		if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

		return {
			c() {
				t0 = space();
				nav = element("nav");
				div0 = element("div");

				div0.innerHTML = `<a class="navbar-item is-size-4 has-text-weight-bold" href="/"><img src="favicon.png" alt="OBS-web"/> 
      <h1 id="navbarTitle">OBS-Web</h1></a> <button class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navmenu"><span aria-hidden="true"></span> <span aria-hidden="true"></span> <span aria-hidden="true"></span></button>`;

				t6 = space();
				div4 = element("div");
				div3 = element("div");
				div2 = element("div");
				div1 = element("div");
				if_block0.c();
				t7 = space();
				button1 = element("button");
				span3 = element("span");
				create_component(icon.$$.fragment);
				t8 = space();
				section = element("section");
				div5 = element("div");
				if_block1.c();
				document_1.title = "OBS-Web Remote Control";
				attr(div0, "class", "navbar-brand");
				attr(span3, "class", "icon");
				attr(button1, "class", "button is-link");
				attr(button1, "title", "Toggle Fullscreen");
				toggle_class(button1, "is-light", !/*isFullScreen*/ ctx[3]);
				attr(div1, "class", "buttons");
				attr(div2, "class", "navbar-item");
				attr(div3, "class", "navbar-end");
				attr(div4, "id", "navmenu");
				attr(div4, "class", "navbar-menu");
				attr(nav, "class", "navbar is-primary");
				attr(nav, "aria-label", "main navigation");
				attr(div5, "class", "container");
				attr(section, "class", "section");
			},
			m(target, anchor) {
				insert(target, t0, anchor);
				insert(target, nav, anchor);
				append(nav, div0);
				append(nav, t6);
				append(nav, div4);
				append(div4, div3);
				append(div3, div2);
				append(div2, div1);
				if_blocks[current_block_type_index].m(div1, null);
				append(div1, t7);
				append(div1, button1);
				append(button1, span3);
				mount_component(icon, span3, null);
				insert(target, t8, anchor);
				insert(target, section, anchor);
				append(section, div5);
				if_blocks_1[current_block_type_index_1].m(div5, null);
				current = true;

				if (!mounted) {
					dispose = listen(button1, "click", /*toggleFullScreen*/ ctx[11]);
					mounted = true;
				}
			},
			p(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block0 = if_blocks[current_block_type_index];

					if (!if_block0) {
						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block0.c();
					} else {
						if_block0.p(ctx, dirty);
					}

					transition_in(if_block0, 1);
					if_block0.m(div1, t7);
				}

				const icon_changes = {};

				if (dirty[0] & /*isFullScreen*/ 8) icon_changes.path = /*isFullScreen*/ ctx[3]
				? mdiFullscreenExit
				: mdiFullscreen;

				icon.$set(icon_changes);

				if (!current || dirty[0] & /*isFullScreen*/ 8) {
					toggle_class(button1, "is-light", !/*isFullScreen*/ ctx[3]);
				}

				let previous_block_index_1 = current_block_type_index_1;
				current_block_type_index_1 = select_block_type_4(ctx);

				if (current_block_type_index_1 === previous_block_index_1) {
					if_blocks_1[current_block_type_index_1].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
						if_blocks_1[previous_block_index_1] = null;
					});

					check_outros();
					if_block1 = if_blocks_1[current_block_type_index_1];

					if (!if_block1) {
						if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
						if_block1.c();
					} else {
						if_block1.p(ctx, dirty);
					}

					transition_in(if_block1, 1);
					if_block1.m(div5, null);
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block0);
				transition_in(icon.$$.fragment, local);
				transition_in(if_block1);
				current = true;
			},
			o(local) {
				transition_out(if_block0);
				transition_out(icon.$$.fragment, local);
				transition_out(if_block1);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(t0);
					detach(nav);
					detach(t8);
					detach(section);
				}

				if_blocks[current_block_type_index].d();
				destroy_component(icon);
				if_blocks_1[current_block_type_index_1].d();
				mounted = false;
				dispose();
			}
		};
	}

	const OBS_WEBSOCKET_LATEST_VERSION = '5.0.1'; // https://api.github.com/repos/Palakis/obs-websocket/releases/latest
	const __APP_VERSION__ = '2025.03';
	let editable = false;

	function formatTime(secs) {
		secs = Math.round(secs / 1000);
		const hours = Math.floor(secs / 3600);
		secs -= hours * 3600;
		const mins = Math.floor(secs / 60);
		secs -= mins * 60;

		return hours > 0
		? `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
		: `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
	}

	function getCurrentTime() {
		const time = new Date();
		return String(time.getHours()).padStart(2, '0') + ":" + String(time.getMinutes()).padStart(2, '0');
	}

	function instance($$self, $$props, $$invalidate) {
		onMount(async () => {
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('/service-worker.js');
			}

			// Request screen wakelock
			if ('wakeLock' in navigator) {
				try {
					await navigator.wakeLock.request('screen');

					// Re-request when coming back
					document.addEventListener('visibilitychange', async () => {
						if (document.visibilityState === 'visible') {
							await navigator.wakeLock.request('screen');
						}
					});
				} catch(e) {
					
				}
			}

			// Toggle the navigation hamburger menu on mobile
			const navbar = document.querySelector('.navbar-burger');

			navbar.addEventListener('click', () => {
				navbar.classList.toggle('is-active');
				document.getElementById(navbar.dataset.target).classList.toggle('is-active');
			});

			// Listen for fullscreen changes
			document.addEventListener('fullscreenchange', () => {
				$$invalidate(3, isFullScreen = document.fullscreenElement);
			});

			document.addEventListener('webkitfullscreenchange', () => {
				$$invalidate(3, isFullScreen = document.webkitFullscreenElement);
			});

			document.addEventListener('msfullscreenchange', () => {
				$$invalidate(3, isFullScreen = document.msFullscreenElement);
			});

			if (document.location.hash !== '') {
				// Read address from hash
				$$invalidate(5, address = document.location.hash.slice(1));

				// This allows you to add a password in the URL like this:
				// http://obs-web.niek.tv/#ws://localhost:4455#password
				if (address.includes('#')) {
					$$invalidate(5, [address, password] = address.split('#'), address, $$invalidate(6, password));
				}

				await connect();
			}

			// Export the sendCommand() function to the window object
			window.sendCommand = sendCommand;
		});

		// State
		let connected;

		let heartbeat = {};
		let heartbeatInterval;
		let isFullScreen;
		let isSceneOnTop = window.localStorage.getItem('isSceneOnTop') || false;
		let isVirtualCamActive;
		let isIconMode = window.localStorage.getItem('isIconMode') || false;
		let address;
		let password;
		let scenes = [];
		let errorMessage = '';
		let imageFormat = 'jpg';

		function toggleFullScreen() {
			if (isFullScreen) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			} else {
				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen();
				} else if (document.documentElement.msRequestFullscreen) {
					document.documentElement.msRequestFullscreen();
				}
			}
		}

		async function startRecording() {
			await sendCommand('StartRecord');
		}

		async function stopRecording() {
			await sendCommand('StopRecord');
		}

		async function startVirtualCam() {
			await sendCommand('StartVirtualCam');
		}

		async function stopVirtualCam() {
			await sendCommand('StopVirtualCam');
		}

		async function pauseRecording() {
			await sendCommand('PauseRecord');
		}

		async function resumeRecording() {
			await sendCommand('ResumeRecord');
		}

		async function connect() {
			$$invalidate(5, address = address || 'ws://localhost:4455');

			if (address.indexOf('://') === -1) {
				const secure = location.protocol === 'https:' || address.endsWith(':443');
				$$invalidate(5, address = secure ? 'wss://' : 'ws://' + address);
			}

			console.log('Connecting to:', address, '- using password:', password);
			await disconnect();

			try {
				const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(address, password);
				console.log(`Connected to obs-websocket version ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`);
			} catch(e) {
				console.log(e);
				$$invalidate(8, errorMessage = e.message);
			}
		}

		async function disconnect() {
			await obs.disconnect();
			clearInterval(heartbeatInterval);
			$$invalidate(1, connected = false);
			$$invalidate(8, errorMessage = 'Disconnected');
		}

		// OBS events
		obs.on('ConnectionClosed', () => {
			$$invalidate(1, connected = false);
			window.document.body.classList.remove('connected');
			window.history.pushState('', document.title, window.location.pathname + window.location.search); // Remove the hash
			console.log('Connection closed');
			window.document.getElementById('navbarTitle').innerHTML = 'OBS-Web';
		});

		obs.on('Identified', async () => {
			console.log('Connected');
			window.document.body.classList.add('connected');
			$$invalidate(1, connected = true);
			document.location.hash = address; // For easy bookmarking
			const data = await sendCommand('GetVersion');
			const version = data.obsWebSocketVersion || '';
			console.log('OBS-websocket version:', version);

			if (compareVersions(version, OBS_WEBSOCKET_LATEST_VERSION) < 0) {
				alert('You are running an outdated OBS-websocket (version ' + version + '), please upgrade to the latest version for full compatibility.');
			}

			if (data.supportedImageFormats.includes('webp') && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0) {
				$$invalidate(9, imageFormat = 'webp');
			}

			heartbeatInterval = setInterval(
				async () => {
					const stats = await sendCommand(
						'GetStats'
					);

					const streaming = await sendCommand('GetStreamStatus');
					const recording = await sendCommand('GetRecordStatus');
					$$invalidate(2, heartbeat = { stats, streaming, recording });

					if (recording.outputActive) {
						window.document.body.classList.add('recording');
					} else {
						window.document.body.classList.remove('recording');
					}

					// console.log(heartbeat);
					window.document.getElementById('navbarTitle').innerHTML = getCurrentTime();
				},
				1000 // Heartbeat
			);

			(await sendCommand('GetStudioModeEnabled')).studioModeEnabled || false;
			$$invalidate(4, isVirtualCamActive = (await sendCommand('GetVirtualCamStatus')).outputActive || false);
		});

		obs.on('ConnectionError', async () => {
			$$invalidate(8, errorMessage = 'Please enter your password:');
			document.getElementById('password').focus();

			if (!password) {
				$$invalidate(1, connected = false);
			} else {
				await connect();
			}
		});

		obs.on('VirtualcamStateChanged', async data => {
			console.log('VirtualcamStateChanged', data.outputActive);
			$$invalidate(4, isVirtualCamActive = data && data.outputActive);
		});

		obs.on('StudioModeStateChanged', async data => {
			console.log('StudioModeStateChanged', data.studioModeEnabled);
			data && data.studioModeEnabled;
		});

		obs.on('ReplayBufferStateChanged', async data => {
			console.log('ReplayBufferStateChanged', data);
			data && data.outputActive;
		});

		function sceneswitcher_scenes_binding(value) {
			scenes = value;
			$$invalidate(7, scenes);
		}

		function input0_input_handler() {
			address = this.value;
			$$invalidate(5, address);
		}

		function input1_input_handler() {
			password = this.value;
			$$invalidate(6, password);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty[0] & /*isSceneOnTop*/ 1) {
				isSceneOnTop
				? window.localStorage.setItem('isSceneOnTop', 'true')
				: window.localStorage.removeItem('isSceneOnTop');
			}
		};

		isIconMode
		? window.localStorage.setItem('isIconMode', 'true')
		: window.localStorage.removeItem('isIconMode');

		return [
			isSceneOnTop,
			connected,
			heartbeat,
			isFullScreen,
			isVirtualCamActive,
			address,
			password,
			scenes,
			errorMessage,
			imageFormat,
			isIconMode,
			toggleFullScreen,
			startRecording,
			stopRecording,
			startVirtualCam,
			stopVirtualCam,
			pauseRecording,
			resumeRecording,
			connect,
			disconnect,
			sceneswitcher_scenes_binding,
			input0_input_handler,
			input1_input_handler
		];
	}

	class App extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);
		}
	}

	const app = new App({
	  target: document.body
	});

	return app;

})();
