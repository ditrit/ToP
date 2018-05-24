var antlr4 = require('antlr4/index');
const ToscaListener = require('./ToscaListener.js').ToscaListener;
const values = require('./ToscaValues.js');

ToscaAstBuilder = function(annotations, filename=null) {
	ToscaListener.call(this);
	this.last        = null;
	this.annotations = annotations;
	this.filename    = filename;
	this.dsl_defs    = [];
	return this;
};

ToscaAstBuilder.prototype = Object.create(ToscaListener.prototype);
ToscaAstBuilder.prototype.constructor = ToscaAstBuilder;

exports.ToscaAstBuilder = ToscaAstBuilder;

ToscaAstBuilder.prototype.setValue = function(val=null) {
	let ctx = val.ast_ctx.rule_ctx;
	ctx.value = val;	

	this.last = ctx.value;
}

ToscaAstBuilder.prototype.getValue = function(ctx) {
	return ctx.value
}

ToscaAstBuilder.prototype.getValueType = function(ctx) {
	let ctxval = ctx.value;
	if (ctxval instanceof Array) {
		return ctxval[0].type;
	} else return ctxval.type;
}

ToscaAstBuilder.prototype.astCtx = function(ctx) {
	return new values.AstContext(
		this.filename, 
		this.values, 
		this.annotations,
		ctx.start.line, 
		ctx.start.column,
		(ctx.stop) ? ctx.stop.line   : ctx.start.line,  
		(ctx.stop) ? ctx.stop.column : ctx.start.column, 
//		(ctx.stop && (ctx.stop.line >= ctx.start.line)) ? ctx.stop.line   : ctx.start.line,  
//		(ctx.stop && ((ctx.stop.line > ctx.start.line) || (ctx.stop.column > ctx.start.column))) ? ctx.stop.column : ctx.start.column, 
		ctx);
}


////////////////////////////////////////////////////////////////////////////////////////
//

// Exit a parse tree produced by ToscaParser#size.
ToscaAstBuilder.prototype.exitSize = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (!ctx.SCALAR_SIZE()) {
		ast_ctx.astError("ERROR : No scalar-value.size value found")
    } else {
	    let input = ctx.SCALAR_SIZE().getText().toLowerCase();
	    this.setValue(new values.ScalarUnitSize(ast_ctx, input));
    }
}

// Exit a parse tree produced by ToscaParser#time.
ToscaAstBuilder.prototype.exitTime = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (!ctx.SCALAR_TIME()) {
		ast_ctx.astError("ERROR : No scalar-value.time value found")
    } else {
	    let input = ctx.SCALAR_TIME().getText().toLowerCase();
	    this.setValue(new values.ScalarUnitTime(ast_ctx, input));
    }
}

// Exit a parse tree produced by ToscaParser#freq.
ToscaAstBuilder.prototype.exitFreq = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (!ctx.SCALAR_FREQ()) {
		ast_ctx.astError("ERROR : No scalar-unit.frequency value found")
    } else {
	    let input = ctx.SCALAR_FREQ().getText().toLowerCase();
	    this.setValue(new values.ScalarUnitFreq(ast_ctx, input));
    }
}

// Exit a parse tree produced by ToscaParser#bool.
ToscaAstBuilder.prototype.exitBool = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (ctx.TRUE()) {
		tbool = new values.Bool(ast_ctx, true);
    	this.setValue(tbool);
    } else if (ctx.FALSE()) {
    	this.setValue(new values.Bool(ast_ctx, false));
    } else {
		ast_ctx.astError("ERROR : No boolean value found")    	
    }
}

// Exit a parse tree produced by ToscaParser#infinity.
ToscaAstBuilder.prototype.exitInfinity = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (!ctx.INFINITY()) {
		ast_ctx.astError("ERROR : No infinity value found")
    } else {
	    let orig = ctx.INFINITY().getText();
	    this.setValue(new values.Inf(ast_ctx,
	    	(orig.charAt(0) == '-') ? -Infinity : Infinity));
    }
}


// Exit a parse tree produced by ToscaParser#nan.
ToscaAstBuilder.prototype.exitNan = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (!ctx.NAN()) {
		ast_ctx.astError("ERROR : No NaN value found")
    } else {
    	this.setValue(new values.NaNumber(ast_ctx));
    }
}

// Exit a parse tree produced by ToscaParser#null.
ToscaAstBuilder.prototype.exitNull_value = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (!ctx.NULL()) {
		ast_ctx.astError("ERROR : No Null value found")
    } else {
    	this.setValue(new values.NullValue(ast_ctx, null));
    }
}

// Exit a parse tree produced by ToscaParser#integer.
ToscaAstBuilder.prototype.exitInteger = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (ctx.children[0]) {
		let input = ctx.children[0].getText();
		this.setValue(new values.Int(ast_ctx, input));
	} else {
		ast_ctx.astError("ERROR : No Int value found")
	}
}

// Exit a parse tree produced by ToscaParser#reals.
ToscaAstBuilder.prototype.exitReal = function(ctx) {
	var ast_ctx = this.astCtx(ctx);

	let input = ctx.children[0]
	if (input) {
		if (ctx.integer()) {
			input = this.getValue(input)
		} else {
			input = input.getText();
		}
		this.setValue(new values.Real(ast_ctx, input));
	} else {
		ast_ctx.astError("ERROR : No Real value found")
	}
}

// Exit a parse tree produced by ToscaParser#number.
ToscaAstBuilder.prototype.exitNumber = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	let value = this.getValue(ctx.children[0]);
	if (value) {
		if (ctx.integer()) {
			this.setValue(new values.Int(ast_ctx,  value ));
		} else if (ctx.real()) {
			this.setValue(new values.Real(ast_ctx, value ));
		};
	} else {
			ast_ctx.astError("ERROR : No Number found")
	}
}

// Exit a parse tree produced by ToscaParser#version.
ToscaAstBuilder.prototype.exitVersion = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	var child = ctx.children[0];
	if (child) {
  	  	this.setValue(new values.Version(ast_ctx, child.getText()));
	} else {
		ast_ctx.astError("ERROR : No Version found")
	};
}

// Exit a parse tree produced by ToscaParser#comparable_value.
ToscaAstBuilder.prototype.exitComparable_value = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	input = ctx.children[0]; 
	if (input) {
		let val = this.getValue(input);
		let type = this.getValueType(input);
		this.setValue(new values[type](ast_ctx, val));
	} else {
		ast_ctx.astError("ERROR : No Comparable value found")
	}
}

// Exit a parse tree produced by ToscaParser#value.
ToscaAstBuilder.prototype.exitValue = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	input = ctx.children[0]; 
	if (input) {
		let val = this.getValue(input);
		if (!val) ("PROBLEME !" + input.getText()); 
		let type = this.getValueType(input);
		this.setValue(new values[type](ast_ctx, val));
	} else {
		ast_ctx.astError("ERROR : No Value found")
	}
}

// Exit a parse tree produced by ToscaParser#desl_def.
ToscaAstBuilder.prototype.exitDsl_def = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	idChild     = ctx.id();  
	valueChild  = ctx.value();
	if (idChild && valueChild) {
		let id  = idChild.getText();
		let val = this.getValue(valueChild);
		this.dsl_defs[id] = val;
		this.setValue(new values.ValueAssoc(ast_ctx, [ id,  val]));
	} else {
		ast_ctx.astError("ERROR on dsl_definition");
	}
}

// Exit a parse tree produced by ToscaParser#desl_def.
ToscaAstBuilder.prototype.exitDsl_ref = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	idChild     = ctx.id();  
	if (idChild) {
		let id  = idChild.getText();
		let val = this.dsl_defs[id];
		if (val instanceof AstEntity) {
			let type = val.type;
			this.setValue(new values[type](ast_ctx, val));
		} else {
			ast_ctx.astError("ERROR : no Tosca value found for reference");
		}
	} else {
		ast_ctx.astError("ERROR : no id found for reference");
	}
}


// Exit a parse tree produced by ToscaParser#timestamp.
ToscaAstBuilder.prototype.exitTimestamp = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (!ctx.TIMESTAMP()) {
		ast_ctx.astError("ERROR : No Timestamp value found")
    } else {
    	orig = ctx.TIMESTAMP().getText();
    	timestamp = new values.Timestamp(ast_ctx, orig);
    	if (!timestamp) {
			ast_ctx.astError("ERROR : " + orig + " is not a valid Timestamp")
    	} else {
    		this.setValue(timestamp);
    	};
    }
}

// Exit a parse tree produced by ToscaParser#unbounded.
ToscaAstBuilder.prototype.exitUnbounded = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (!ctx.UNBOUNDED()) {
		ast_ctx.astError("ERROR : No UNBOUNDED value found")
    } else {
    	this.setValue(new values.Unbounded(ast_ctx));
    }
}

// Exit a parse tree produced by ToscaParser#range.
ToscaAstBuilder.prototype.exitRange = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	let list  = ctx.list();
	if (list) {
		let range = this.getValue(list);
		this.setValue(new values.Range(ast_ctx, range));
	} else {
		ast_ctx.astError("ERROR : No range value found")
	}
}

// Exit a parse tree produced by ToscaParser#str
ToscaAstBuilder.prototype.exitStr = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	let input = ctx.getText(); 
	if (input) {
		this.setValue(new values.Str(ast_ctx, input));
	} else {
		ast_ctx.astError("ERROR : No String value found")
	}
}


// Exit a parse tree produced by ToscaParser#str, 'simple' alternative.
ToscaAstBuilder.prototype.exitStrSimple = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	let input = ctx.children[0]; 
	if (input) {
		let val = this.getValue(input);
		if (!val) console.log("PROBLEME exitStr !" + input.getText()); 
		let type = this.getValueType(input);
		this.setValue(new values[type](ast_ctx, val));
	} else {
		ast_ctx.astError("ERROR : No Value found")
	}
}

// Exit a parse tree produced by ToscaParser#str, 'multiple' alternative
ToscaAstBuilder.prototype.exitStrMulti = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	if (ctx.sub_mlstring() instanceof Array) {
		let lines = ctx.sub_mlstring().map( x => this.getValue(x));
		let indent = (ctx.INDENT) ? ctx.INDENT().getText().length : 0;
		strLines = new values.StrIndent(ast_ctx, lines, indent);
		strLines.unindent(indent);
		this.setValue(new values.Str(ast_ctx, strLines.value));
	} else {
			ast_ctx.astError("ERROR : No String value found")		
	}
}

// Exit a parse tree produced by ToscaParser#short_str, 'literal' alternative
ToscaAstBuilder.prototype.exitStrLiteral = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	let str  = ctx.getText();
	if (str) {
		this.setValue(new values.Str(ast_ctx, str.slice(1,-1)));
	} else {
		ast_ctx.astError("ERROR : No String value found")
	}
}

// Exit a parse tree produced by ToscaParser#short_str, 'alltokens' alternative
ToscaAstBuilder.prototype.exitStrAlltokens = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	let str  = ctx.getText();
	if (str) {
		this.setValue(new values.Str(ast_ctx, str));
	} else {
		ast_ctx.astError("ERROR : No String value found")
	}
}

// Exit a parse tree produced by ToscaParser#sub_mlstring, 'strSubAlltokens' alternative
ToscaAstBuilder.prototype.exitStrSubAllTokens = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	let str  = ctx.getText();
	if (str) {
		this.setValue(new values.StrIndent(ast_ctx, str));
	} else {
		ast_ctx.astError("ERROR : No String value found")
	}
}

// Exit a parse tree produced by ToscaParser#str_mlstring, 'strSubMulti' alternative
ToscaAstBuilder.prototype.exitStrSubMulti = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	let lines = ctx.sub_mlstring().map( x => this.getValue(x));
	let indent = (ctx.INDENT) ? ctx.INDENT().getText().length : 0;
	if (lines) {
		this.setValue(new values.StrIndent(ast_ctx, lines, indent));
	} else {
		ast_ctx.astError("ERROR : No String value found")
	}
}

ToscaAstBuilder.prototype.exitJsonList = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	var list = ctx.value().map(x => this.getValue(x))
	this.setValue(new values.List(ast_ctx, list));
}

ToscaAstBuilder.prototype.exitEmptyList = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	this.setValue(new values.List(ast_ctx, []));
}

ToscaAstBuilder.prototype.exitItemList = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	var list = ctx.value().map(x => this.getValue(x))
	this.setValue(new values.List(ast_ctx, list));
}

ToscaAstBuilder.prototype.exitIndentList = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	var list = ctx.value().map(x => this.getValue(x))
	this.setValue(new values.List(ast_ctx, list));
}

ToscaAstBuilder.prototype.exitValue_assoc = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	var id  = ctx.id().getText();
	var val = this.getValue(ctx.value());
	this.setValue(new values.ValueAssoc(ast_ctx, [ id,  val]));
}

ToscaAstBuilder.prototype.exitJsonMap = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	var map = ctx.value_assoc().map(x => this.getValue(x))
	this.setValue(new values.Dict(ast_ctx, map));
}

ToscaAstBuilder.prototype.exitEmptyMap = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	this.setValue(new values.Dict(ast_ctx, []));
}

ToscaAstBuilder.prototype.exitItemMap = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	var map = ctx.value_assoc().map(x => this.getValue(x))
	this.setValue(new values.Dict(ast_ctx, map));
}

ToscaAstBuilder.prototype.exitIndentMap = function(ctx) {
	var ast_ctx = this.astCtx(ctx);
	var map = ctx.value_assoc().map(x => this.getValue(x))
	this.setValue(new values.Dict(ast_ctx, map));
}
