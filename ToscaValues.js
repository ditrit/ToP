AstContext = function(filename, values, annotations, start_row, start_col, end_row, end_col, rule_ctx)  {
	this.filename    = filename;
	this.values      = values;
	this.annotations = annotations;
	this.start_row   = start_row;
	this.end_row     = end_row;
	this.start_col   = start_col;
	this.end_col     = end_col
	this.rule_ctx    = rule_ctx;
}

AstContext.prototype.constructor = AstContext;

AstContext.prototype.astError = function(msg) {
    this.annotations.push({
        filename: this.filename,
        row: this.start_row,
        column: this.start_col,
        text: msg,
        type: "error"
 	});
}

exports.AstContext = AstContext;

AstEntity = function(ast_ctx, type) {
	this.ast_ctx   = ast_ctx;
	this.type      = type;
	this._str = "";
}

AstEntity.prototype.constructor = AstEntity;

AstEntity.prototype.getPos = function() {
	return { filename:      this.ast_ctx.filename,
			 row:           this.ast_ctx.start_row,
			 column:        this.ast_ctx.start_col,
			 end_row:       this.ast_ctx.stop_row,
			 end_column :   this.ast_ctx.stop_col
			 };
}

AstEntity.prototype.getStartPos = function() {
	return { filename:      this.ast_ctx.filename,
			 row:           this.ast_ctx.start_row,
			 column:        this.ast_ctx.start_col
			 };
}

AstEntity.prototype.getStopPos = function() {
	return { filename:      this.ast_ctx.filename,
			 row:       this.ast_ctx.stop_row,
			 column :   this.ast_ctx.stop_col
			 };
}

AstEntity.prototype.toString = function() {
	return this._str;
}

AstEntity.prototype.constructor = AstEntity;

ComparableValue = function(ast_ctx, type) {
	AstEntity.call(this, ast_ctx, type);
}

ComparableValue.prototype = Object.create(AstEntity.prototype);
ComparableValue.prototype.constructor = ComparableValue;


ComparableValue.prototype.equals = function(other) {
	if (!(other instanceof ComparableValue)) {
		throw "ComparableValue can only be compared with another ComparableValue!...";		
	}
	if (!other.type || !this.type || ( other.type != this.type)) {
		throw "Equality between incompatible ComparableValues!";
	}
	return this.value == other.value;
}

ComparableValue.prototype.lessThan = function(other) {
	if (!(other instanceof ComparableValue)) {
		throw "ComparableValue can only be compared with another ComparableValue!...";		
	}
	if (!other.type || !this.type || ( other.type != this.type)) {
		throw "Comparison between incompatible ComparableValues!";
	}
	return this.value < other.value;
}

ComparableValue.prototype.moreThan = function(other) {
	return other.lessThan(this)
}

ComparableValue.prototype.moreOrEqual = function(other) {
	return this.moreThan(other) || this.equals(other)
}

ComparableValue.prototype.lessOrEqual = function(other) {
	return this.lessThan(other) || this.equals(other)
}


ScalarUnit = function(ast_ctx, type, input) {

	ComparableValue.call(this, ast_ctx, type);

	if (typeof(input) == 'string') { 	
 		let idx = input.match(/[a-z]+$/).index;
		let num_str = input.substr(0,idx);
		let unit_str = input.substr(idx);

		this.num = Number(num_str);
		this.canonicUnit = null;
		this.unit_lcase = unit_str.toLowerCase();
	} else if (input instanceof ScalarUnit && input.type == type) {
		this.num = input.num;
		this.canonicUnit = null;
		this.unit_lcase = input.unit_lcase;
	} else {
		this.unit = this.value = this.num = this. canonicUnit = this._str = null;
		ast_ctx.astError("Error : invalid ScalarUnit value")
	}
}

ScalarUnit.prototype = Object.create(ComparableValue.prototype);
ScalarUnit.prototype.constructor = ScalarUnit;

ScalarUnit.prototype.toString = function() {
	return this.num + " " + this.unit;
}

ScalarUnit.prototype.canonic = function() {
	return this.value + " " + this.canonicUnit;
}


ScalarUnitSize = function(ast_ctx, input) {
	ScalarUnit.call(this, ast_ctx, 'ScalarUnitSize', input);
	this.canonicUnit = 'B';
	switch (this.unit_lcase) {
		case 'b':
		   	this.unit = 'B';
		   	this.value = this.num;
		   	break;
		case 'kb':
		   	this.unit = 'kB';
		   	this.value = this.num * 1000;
		   	break;
		case 'kib':
		   	this.unit = 'KiB';
		   	this.value = this.num * 1024;
		   	break;
		case 'mb':
		   	this.unit = 'MB';
		   	this.value = this.num * 1000000;
		   break;
		case 'mib':
		   	this.unit = 'MiB';
		   	this.value = this.num * 1048576;
		   	break;
		case 'gb':
		   	this.unit = 'GB';
		   	this.value = this.num * 1000000000;
		   	break;
		case 'gib':
		   	this.unit = 'GiB';
		   	this.value = this.num * 1073741824;
		   	break;
		case 'tb':
		   	this.unit = 'TB';
		   	this.value = this.num * 1000000000000;
		   	break;
		case 'tib':
		   	this.unit = 'TiB';
		   	this.value = this.num * 1099511627776;
		   	break;
		default:
		   	this.unit = this.value = this.num = this. canonicUnit = this._str = null;
			ast_ctx.astError("Error : invalid ScalarUnitSize value")
	}
}

ScalarUnitSize.prototype = Object.create(ScalarUnit.prototype);
ScalarUnitSize.prototype.constructor = ScalarUnitSize;


ScalarUnitTime = function(ast_ctx, input) {
	ScalarUnit.call(this, ast_ctx, 'ScalarUnitTime', input);
	this.canonicUnit = 'ns';
	switch (this.unit_lcase) {
		case 'ns':
		   	this.unit = 'ns';
		   	this.value = this.num;
		   	break;
		case 'us':
		   	this.unit = 'us';
		   	this.value = this.num * 1000;
		   	break;
		case 'ms':
		   	this.unit = 'ms';
		   	this.value = this.num * 1000000;
		   	break;
		case 's':
		   	this.unit = 's';
		   	this.value = this.num * 1000000000;
		   	break;
		case 'm':
		   	this.unit = 'm';
		   	this.value = this.num * 1000000000 * 60;
		   break;
		case 'h':
		   	this.unit = 'h';
		   	this.value = this.num * 1000000000 * 60 * 60;
		   	break;
		case 'd':
		   	this.unit = 'd';
		   	this.value = this.num * 1000000000 * 60 * 60 * 24;
		   	break;
		default:
		   	this.unit = this.value = this.num = this. canonicUnit = this._str = null;
			ast_ctx.astError("Error : invalid ScalarUnitTime value")
	}
}

ScalarUnitTime.prototype = Object.create(ScalarUnit.prototype);
ScalarUnitTime.prototype.constructor = ScalarUnitTime;


ScalarUnitFreq = function(ast_ctx, input) {
	ScalarUnit.call(this, ast_ctx, 'ScalarUnitFreq', input);
	this.canonicUnit = 'Hz';
	switch (this.unit_lcase) {
		case 'hz':
		   	this.unit = 'Hz';
		   	this.value = this.num;
			break;
		case 'khz':
		   	this.unit = 'kHz';
		   	this.value = this.num * 1000;
		   	break;
		case 'mhz':
		   	this.unit = 'MHz';
		   	this.value = this.num * 1000000;
		   	break;
		case 'ghz':
		   	this.unit = 'GHz';
		   	this.value = this.num * 1000000000;
		   	break;
		default:
		   	this.unit = this.value = this.num = this. canonicUnit = this._str = null;
			ast_ctx.astError("Error : invalid ScalarUnitFreq value")
	}
}

ScalarUnitFreq.prototype = Object.create(ScalarUnit.prototype);
ScalarUnitFreq.prototype.constructor = ScalarUnitFreq;


exports.ScalarUnitFreq = ScalarUnitFreq;
exports.ScalarUnitTime = ScalarUnitTime;
exports.ScalarUnitSize = ScalarUnitSize;


Version = function(ast_ctx, input) {
	ComparableValue.call(this, ast_ctx, 'Version');
	if (typeof(input) == 'string') {
		let [major, minor, fix, qualifier, build ] = input.split(/[\.-]/);

		this.major = parseInt(major);
		this.minor = parseInt(minor);
		this.fix   = (fix == null) ? null : parseInt(fix);	
		this.qualifier = (qualifier == null) ? null : qualifier.toLowerCase();
		this.build = (build == null) ? null : parseInt(build);
		this._str = input.toLowerCase();
	} else if ( input instanceof Version ) {
		this.major = input.major;
		this.minor = input.minor;
		this.fix   = input.fix;	
		this.qualifier = input.qualifier;
		this.build = input.build;
		this._str = input._str;
	} else if ( input instanceof Real ) {
		this._str = input._str;
		let idx = this._str.indexOf('.');
		this.major = this._str.substr(0, idx);
		this.minor = this._str.substr(idx + 1);
		this.fix = this.qualifier = this.build = null;
	} else {
		this.major = this.minor = this.fix = this.qualifier = this.build = this._str = null;
		ast_ctx.astError("Error : invalid Version value")
	}

}

Version.prototype = Object.create(ComparableValue.prototype);
Version.prototype.constructor = Version;

Version.prototype.isPreRelease = function() {
	return this.major == 0
}

Version.prototype.equals = function(other) {
	if (!(other instanceof Version)) {
		throw "A Version value can only be compared with another Version version!";		
	}
	return ((this.major     == other.major) &&
			(this.minor     == other.minor) &&
			(this.fix       == other.fix) &&
			(this.qualifier == other.qualifier) &&
			(this.build     == other.build));
}

Version.prototype.lessThan = function(other) {
	if (!(other instanceof Version)) {
		throw "A Version value can only be compared with another Version version!";		
	};
	if (this.major < other.major) {
		return true;
	} else if (this.major == other.major) {
		if (this.minor < other.minor) {
			return true;
		} else if (this.minor == other.minor) {
			if (this.fix < other.fix) {
				return true;
			} else if ((this.fix == null) && (other.fix != null)) {
				return true;
			} else if (this.fix == other.fix) {
				if ((this.qualifier != null) && (other.qualifier == null)) {
					return true;
				};
				if (this.qualifier == other.qualifier) {
					if ((this.build == null) && (other.build != null)) {
						return true;
					} else {
						return (this.build < other.build);
					};
				};
			};
		};
	};
	return false;
}

exports.Version = Version;

Timestamp = function(ast_ctx, input) {
	ComparableValue.call(this, ast_ctx, 'Timestamp');
	if (typeof(input) == 'string') {
		this._str = input; // should be in iso8601 format
		this.value = new Date(input);
		if (this.date == 'Invalid Date') {
			this.value = this._str = null;
			ast_ctx.astError("Error : invalid Timestamp value")
		};
	} else if (input instanceof(Timestamp)) {
		this.value = input.value;
		this._str  = input._str;
	} else {
		this.value = this._str = null;
		ast_ctx.astError("Error : invalid Timestamp value")
	};
	return this;
}

Timestamp.prototype = Object.create(ComparableValue.prototype);
Timestamp.prototype.constructor = Timestamp;

exports.Timestamp = Timestamp;

Num = function(ast_ctx, type) {
	ComparableValue.call(this, ast_ctx, type);
}

Num.prototype = Object.create(ComparableValue.prototype);
Num.prototype.constructor = Num;

Num.prototype.equals = function(other) {
	if (!(other instanceof Num)) {
		throw "a Number can only be compared with another Number!...";		
	}
	return this.value == other.value;
}

Num.prototype.lessThan = function(other) {
	if (!(other instanceof Num)) {
		throw "a Num can only be compared with another Num!...";		
	}
	return this.value < other.value;
}

Int = function(ast_ctx, input) {
	Num.call(this, ast_ctx, 'Int');
	if (typeof(input) == 'string') {
		this._str = input.toLowerCase();
		let sign = (this._str.charAt(0) == '-') ? -1 : 1;
		let idx = 0, digits, base;
		if ( (idx  = this._str.indexOf('o') + 1) > 0 )       base = 8
		else if ( (idx  = this._str.indexOf('x') + 1) > 0 )  base = 16
		else if ( (idx  = this._str.indexOf('b') + 1) > 0 )  base = 2
		else idx = (sign == -1) ? 1 : 0, base = 10;
		digits = this._str.substr(idx);
		this.value = parseInt(digits, base) * sign;
		if (isNaN(this.value)) {
			if (this._str.endsWith("inf")) this.value = sign * Infinity
			else if (this._str.endsWith("nan")) this.value = NaN;
		} 
	} else if (	input instanceof Int || 
				input instanceof Inf || 
				input instanceof NaNumber ) {
		this.value = input.value;
		this._str = input._str;
	} else {
		this._str = this.value = null;
		ast_ctx.astError("Error : invalid Int value")
	};

	return this;
}

Int.prototype = Object.create(Num.prototype);
Int.prototype.constructor = Int;

exports.Int = Int;

Real = function(ast_ctx, input) {
	Num.call(this, ast_ctx, 'Real');
	if (typeof(input) == 'string') {
		this._str = input.toLowerCase();
		this.value = parseFloat(this._str);
		if (isNaN(this.value)) {
			if (this._str.endsWith("inf"))
				this.value = Infinity * ((this._str.charAt(0) == '-') ? -1 : 1); 
			else if (this._str.endsWith("nan")) this.value = NaN;
		}; 
	} else if (	input instanceof Int  ||
				input instanceof Real ||  
				input instanceof Inf  || 
				input instanceof NaNumber ) {
		this.value = input.value;
		this._str  = input._str;
	} else {
		this._str = this.value = null;
		ast_ctx.astError("Error : invalid Real value")
	};
	return this;
}

Real.prototype = Object.create(Num.prototype);
Real.prototype.constructor = Real;

exports.Real = Real;

Range = function(ast_ctx, input) {
	AstEntity.call(this, ast_ctx, 'Range');
	if (input instanceof Array) {
		[ this.min, this.max ] = input;
		if (this.min && this.max) {
			this._str = "[" + this.min.toString() + ", " + this.max.toString() + "]";
		} else {
			this.min = this.max = null;
			ast_ctx.astError("Error : invalid Range value")
		}
	} else if (input instanceof Range) {
		this.min = input.min;
		this.max = input.max;
		this._str = input._str;
	} else {
		this.min = this.max = this._str = this.value = null;
		ast_ctx.astError("Error : invalid Range value")
	};

	return this;
}

Range.prototype = Object.create(AstEntity.prototype);
Range.prototype.constructor = Range;

Range.prototype.toString = function() {
	return this._str;
}

exports.Range = Range;

Bool = function(ast_ctx, bool_val) {
	AstEntity.call(this, ast_ctx, 'Bool');
	this._str = bool_val.toString();
	this.value = bool_val;
	return this;
}

Bool.prototype = Object.create(AstEntity.prototype);
Bool.prototype.constructor = Bool;

exports.Bool = Bool;

Inf = function(ast_ctx, inf_val) {
	AstEntity.call(this, ast_ctx, 'Inf');
	this._str = inf_val.toString();
	this.value = inf_val;
	return this;
}

Inf.prototype = Object.create(AstEntity.prototype);
Inf.prototype.constructor = Inf;

exports.Inf = Inf;

Unbounded = function(ast_ctx) {
	AstEntity.call(this, ast_ctx, 'Unbounded');
	this._str = "UNBOUNDED";
	this.value = Infinity;
	return this;
}

Unbounded.prototype = Object.create(AstEntity.prototype);
Unbounded.prototype.constructor = Unbounded;

exports.Unbounded = Unbounded;


NaNumber = function(ast_ctx) {
	AstEntity.call(this, ast_ctx, 'NaNumber');
	this._str = "NaN";
	this.value = NaN;
	return this;
}

NaNumber.prototype = Object.create(AstEntity.prototype);
NaNumber.prototype.constructor = NaNumber;

exports.NaNumber = NaNumber;

NullValue = function(ast_ctx, null_val) {
	AstEntity.call(this, ast_ctx, 'NullValue');
	this._str = "null";
	this.value = null;
	return this;
}

NullValue.prototype = Object.create(AstEntity.prototype);
NullValue.prototype.constructor = NullValue;

exports.NullValue = NullValue;

Str = function(ast_ctx, input) {
	AstEntity.call(this, ast_ctx, 'Str');
	if (typeof(input) == 'string') {
		this._str = this.value = input;
	} else if (input instanceof Str) {
		this._str = this.value = input.value;
	} else {
		this._str = this.value = null;
		ast_ctx.astError("Error : invalid String value")
	};

	return this;
}

Str.prototype = Object.create(AstEntity.prototype);
Str.prototype.constructor = Str;

exports.Str = Str;

List = function(ast_ctx, input) {
	AstEntity.call(this, ast_ctx, 'List');
	if (input instanceof Array) {
		this.value = input;
		this._str = input.map(x => x.value);
	} else if (input instanceof List) {
		this.value = input.value;
		this._str  = input.str;
	} else {
		this._str = this.value = null;
		ast_ctx.astError("Error : invalid List value")
	};
	return this;
}

List.prototype = Object.create(AstEntity.prototype);
List.prototype.constructor = List;

exports.List = List;

ValueAssoc = function(ast_ctx, input) {
	AstEntity.call(this, ast_ctx, 'ValueAssoc');
	if (input instanceof Array ) {
		this.key   = input[0];
		this.val   = input[1];
		this.value = {}; 
		this.value[this.key] = this.val;
		this._str  = this.key.toString() + ": " + this.val.toString();
	} else if (input instanceof ValueAssoc) {
		this.key   = input.key;
		this.val   = input.val;
		this.value = input.value;
		this._str  = input._str; 
	} else {
		this.key = this.val = this._str = this.value = null;
		ast_ctx.astError("Error : invalid ValueAssoc value")
	};
	return this;
}

ValueAssoc.prototype = Object.create(AstEntity.prototype);
ValueAssoc.prototype.constructor = ValueAssoc;

exports.ValueAssoc = ValueAssoc;

Dict = function(ast_ctx, input) {
	AstEntity.call(this, ast_ctx, 'Dict');
	if (input instanceof Array) {
		this.value = {};
		for (let va of input) {
			if (va instanceof ValueAssoc) {
				this.value[va.key]=va.val;
			} else {
				ast_ctx.astError("Error : invalid element in Map value")
			}
		}
		this._str = "{" + input.toString() + "}";
	} else if (input instanceof Dict) {
		this.value = input.value;
		this._str  = input.str;
	} else {
		this._str = this.value = null;
		ast_ctx.astError("Error : invalid Map value");
	};
	return this;
}

Dict.prototype = Object.create(AstEntity.prototype);
Dict.prototype.constructor = Dict;

exports.Dict = Dict;
