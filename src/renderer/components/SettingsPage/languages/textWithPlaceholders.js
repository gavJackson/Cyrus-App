// This only defines high-level behaviour of the Mode like folding etc.
ace.define('ace/mode/textWithPlaceholders', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/custom_highlight_rules'], (acequire, exports) => {
	const oop = acequire('ace/lib/oop');
	const TextMode = acequire('ace/mode/text').Mode;
	const CustomHighlightRules = acequire('ace/mode/custom_highlight_rules').CustomHighlightRules;

	oop.inherits(Mode, TextMode); // ACE's way of doing inheritance

	exports.Mode = Mode; // eslint-disable-line no-param-reassign
});

// This is where we really create the highlighting rules
ace.define('ace/mode/textWithPlaceholders_highlight_rules', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports) => {
	const oop = acequire('ace/lib/oop');
	const TextHighlightRules = acequire('ace/mode/text_highlight_rules').TextHighlightRules;

	const CustomHighlightRules = function CustomHighlightRules() {
		this.$rules = new TextHighlightRules().getRules(); // Use Text's rules as a base


		this.$rules["start"].unshift(
			{token : "placeholder", regex : /%\w+%/},
		)
	};

	oop.inherits(CustomHighlightRules, TextHighlightRules);

	exports.CustomHighlightRules = CustomHighlightRules;
});