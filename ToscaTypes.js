const path = require("path")


exports=module.exports={};

class ToscaAst {
  constructor(args, context) {
    if (context) { 
      if (args && args.data ) {
        this.context = context
        this.tag = args.data.tag
        if (!this.tag) this.tag = ""
        this.val = args.data.val 
      } else throw Error(`Syntax error : no value found`);
    }
  }
}

class ToscaStr extends ToscaAst {
  constructor(args, context) {
  	super(args, args.data)
    if (!context && typeof(args) == 'string')
      this.val = args
    else if (!this.tag.endsWith(':str') ) 
      throw Error(`Syntax error : ${args.data} is not a string`);
  }
}

class ToscaURL extends ToscaStr {
  constructor(args, context) {
    super(args, context)

    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d_-]*[a-z\\d])*)\\.?)+[a-z\\d_-]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    if (!pattern.test(this.val))
      throw Error(`Syntax error : '${this.val}' is not a valid url`);
  }
}

class ToscaPath extends ToscaStr {
  constructor(args, context) {
    super(args, context)

    this.path = path.parse(path.normalize(args.data.val))
  }

}

class ToscaBool extends ToscaAst {
  constructor(args, context) {
    super(args, args.data)
    if (!this.tag.endsWith(':bool') )
      throw Error(`Syntax error : ${args.data} is not a boolean`);
  }
}

class ToscaInteger extends ToscaAst {
  constructor(args, context) {
    super(args, args.data)
    this.val = parseInt(this.val)
    if (!this.tag.endsWith(':int') )
      throw Error(`Syntax error : ${args.data} is not an integer`);
  }
}

class ToscaFloat extends ToscaAst {
  constructor(args, context) {
    super(args, args.data)
    this.val = parseFloat(this.val)
    if (!this.tag.endsWith(':float') )
      throw Error(`Syntax error : ${args.data} is not a float`);
  }
}

class ToscaTimestamp extends ToscaAst {
  constructor(args, context) {
    super(args, args.data)
    if (!this.tag.endsWith(':timestamp') )
      throw Error(`Syntax error : ${args.data} is not a timestamp`);
  }
}

class ToscaVersion extends ToscaAst {
  constructor(args, context) {
  	super(args, args.data)
    let str
    if (args.data instanceof ToscaFloat || this.tag.endsWith(':float') ) {
      str = args.data.val.toString()
    } else if (args.data instanceof ToscaStr || this.tag.endsWith(':string')) {
      str = args.data.val
    } else 
      throw Error(`Syntax error : ${args.data} is not a version`);
    let parts = str.split(".")
    this.major = parts[0]
    this.minor = parts[1]
    this.fix   = parts[2]
    let last   = parts[3]
    if (typeof(last) == 'string') {
      parts = last.split(".")
      this.qualifier = parts[0]
      this.build     = parts[1]
    }
  }
}

class ToscaUnbounded extends ToscaStr {
  constructor(args, context) {
    super(args, context)
    if (this.val != "UNBOUNDED")
      throw Error(`Syntax error : ${args.data} is not an UNBOUNDED value`);     
  } 
}

class ToscaRange extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    if (args.data instanceof Array && args.data.length == 2) {
      this.min = args.data[0]
      this.max = args.data[1]
    } else 
      throw Error(`Syntax error : ${args.data} is not an array of 2 items`);
  }
}

class ToscaNull extends ToscaAst {
  constructor(args, context)  {
    super({data: null}, null)
    this.val = null
  }
}

class ToscaServiceTemplate extends ToscaAst {
  constructor(args, context)  {
  	super(args, context)
  	this.tosca_definitions_version
                      = this.tosca_definitions_version
  	this.description 	= this.description
  	this.namespace 		= this.namespace
  	this.metadata 		= this.metadata
    this.imports      = this.imports
  }
}

class ToscaMetadata extends ToscaAst {
  constructor(args, context)  {
    super(args, context)
//  	this.template_author 	= args.template_author
//  	this.template_version	= args.template_version
//  	this.template_name 		= args.template_name
  	for (let metadata in this.val) {
  		this[metadata] = this.val[metadata]
  	}
  }
}

class ToscaRepository extends ToscaAst {
  constructor(args, context)  {
    super(args, context)
  	if (this.tag.endsWith(":str")) {
  		this.url = new ToscaURL(args, context) 
  		this.description = null
  		this.credential = null
  	} else if (args.data.url) {
  		this.url = args.data.url
  		this.description = args.data.description
  		this.credential = args.data.credential
  	} else throw Error(`Syntax error : '${args.data}' is not a valid repository`);
  }
}

class ToscaRepositories extends ToscaAst {
  constructor(args, context)  {
    super(args, context)
  	this.ids = args.data
  }
}

class ToscaCredential extends ToscaAst {
  constructor(args, context)  {
    super(args, context)
  	this.token 		= args.data.token
  	this.protocol 	= args.data.protocol
  	this.token_type = args.data.token_type
  	this.user 		= args.data.user 
  }
}

class ToscaImports extends ToscaAst {
  constructor(args, context)  {
    super(args, context)
    this.items = args.data
  }
}

class ToscaImport extends ToscaAst {
  constructor(args, context)  {
    super(args, context)
    let data = args.data
    if (!(data instanceof Object)) 
      throw Error(`Syntax error : no valid import found`);
    let keys = Object.keys(data)
    if (keys.length == 1 && keys[0] != "file") {
      this.name = keys[0]
      data = data[this.name]
    }
    if (data.file instanceof ToscaURL) {
      this.file             = data.file
      this.repository       = data.repository
      this.namespace_prefix = data.namespace_prefix
      this.namespace_uri    = data.uri
      if (!this.name) this.name = data.file
    } else 
        throw Error(`Syntax error : no valid import found`)
  }
}

class ToscaConstraints extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    this.items = args.data
  }
}

class ToscaConstraint extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    this.value = args.data
  }
}

class ToscaConstraintEqual extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintGreaterThan extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintGreaterOrEqual extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintLessThan extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintLessOrEqual extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintInRange extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintValidValues extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintLength extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintMinLength extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintMaxLength extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintPattern extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}
class ToscaConstraintSchema extends ToscaConstraint {
  constructor(args, context) {
    super(args, context)
  }
}

class ToscaTypeDef extends ToscaAst {

  constructor(args, context) {
    super(args, context)
    if (!(args.data instanceof Object)) 
      throw Error(`Syntax error : no valid data type`);
    if (args.data instanceof ToscaStr) {
      this.type = args.data
    } else if (!(args.data.type instanceof ToscaStr)) {
        throw Error(`Syntax error : a data type must have a 'type' value`)
    } else {
      this.type = args.data.type
      this.constraints = args.data.constraints
      this.description = args.data.description
      this.entry_schema = args.data.entry_schema
    }
  }
}

class ToscaParameter extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    this.type =         args.data.type
    this.description =  args.data.description
    this.status =       args.data.status
    this.default =      args.data.default
  }
}

class ToscaAttributes extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    this.ids = args.data
  }
}

class ToscaAttribute extends ToscaParameter {
  constructor(args, context) {
    super(args, context)
  }
}

class ToscaProperties extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    this.ids = args.data
  }
}

class ToscaProperty extends ToscaParameter {
  constructor(args, context) {
    super(args, context)
    this.constraints =  args.data.constraints
    this.required =     args.data.required
    this.metadata =     args.data.metadata
  }  
}

class ToscaInputs extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    this.ids = args.data
  }
}

class ToscaInput extends ToscaParameter {
  constructor(args, context) {
    super(args, context)
    this.constraints =  args.data.constraints
    this.required =     args.data.required
    this.value =     args.data.value
  }  
}

class ToscaOutputs extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    this.ids = args.data
  }
}

class ToscaOutput extends ToscaParameter {
  constructor(args, context) {
    super(args, context)
    this.constraints =  args.data.constraints
    this.required =     args.data.required
    this.value =     args.data.value
  }  
}

class ToscaArtifactDefs extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    this.ids = args.data
  }
}

class ToscaArtifactDef extends ToscaAst {
  constructor(args, context) {
    super(args, context)

    if (!(args.data instanceof Object)) 
      throw Error(`Syntax error : no valid ArtifactDef value`);
    if (args.data instanceof ToscaStr) {
      this.type = new ToscaStr("file")
      this.file = args.data
    } else if (!(args.data.type instanceof ToscaStr && args.data.file instanceof ToscaPath)) {
        throw Error(`Syntax error : a data type must have valid 'type' and 'file' values`)
    } else {
      this.type = args.data.type
      this.file = args.data.file
      this.repository  = args.data.repository
      this.description = args.data.description
      this.deploy_path = args.data.deploy_path
    }
  }
}

class ToscaCapabilityDefs extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    this.ids = args.data
  }
}

class ToscaCapabilityDef extends ToscaAst {
  constructor(args, context) {
    super(args, context)
    if (!(args.data instanceof Object)) 
      throw Error(`Syntax error : no valid CapabilityDef value`);
    if (args.data instanceof ToscaStr) {
      this.type = new ToscaStr("file")
      this.file = args.data
    } else if (!(args.data.type instanceof ToscaStr)) {
        throw Error(`Syntax error : a data type must have valid 'type'`)
    } else {
      this.type = args.data.type
      this.file = args.data.file
      this.repository  = args.data.repositoryRange
      this.description = args.data.description
      this.properties = args.data.properties
      this.attributes = args.data.attributes
      this.valid_source_types = args.data.valid_source_types
      this.occurrences = args.data.occurrences
    }
  }
}


const classes = {
  ToscaAst,
  ToscaStr,
  ToscaURL,
  ToscaPath,
  ToscaBool,
  ToscaInteger,
  ToscaFloat,
  ToscaVersion,
  ToscaUnbounded,
  ToscaRange,
  ToscaTimestamp,
  ToscaNull,
  ToscaServiceTemplate,
  ToscaMetadata,
  ToscaRepository,
  ToscaRepositories,
  ToscaCredential,
  ToscaImports,
  ToscaImport,
  ToscaConstraints,
  ToscaConstraintEqual,
  ToscaConstraintGreaterThan,
  ToscaConstraintGreaterOrEqual,
  ToscaConstraintLessThan,
  ToscaConstraintLessOrEqual,
  ToscaConstraintInRange,
  ToscaConstraintValidValues,
  ToscaConstraintLength,
  ToscaConstraintMinLength,
  ToscaConstraintMaxLength,
  ToscaConstraintPattern,
  ToscaConstraintSchema,
  ToscaTypeDef,
  ToscaProperty,
  ToscaProperties,
  ToscaAttribute,
  ToscaAttributes,
  ToscaInput,
  ToscaInputs,
  ToscaOutput,
  ToscaOutputs,
  ToscaArtifactDef,
  ToscaArtifactDefs,
  ToscaCapabilityDef,
  ToscaCapabilityDefs
};

class DynamicClass {
    constructor (className, args, context) {
        return new classes[(args) ? className : "ToscaNull"](args, context);
    }
}

exports.DynamicClass = DynamicClass
exports.classes = classes
