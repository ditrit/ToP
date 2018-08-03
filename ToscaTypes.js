
exports=module.exports={};

class ToscaAst {
  constructor(context) {
  	this.context = context
  }
}

class ToscaStr extends ToscaAst {
  constructor(args, context) {
  	super(args.data)
 	this.val = (args && args.data ) ? args.data.val : null
  }
}

class ToscaURL extends ToscaAst {
  constructor(args, context) {
    super(args.data)

    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    this.val = (args && args.data ) ? args.data.val : null

    if (!pattern.test(this.val)) {
      throw Error(`Syntax error : '${this.val}' is not a valid url`);
    }
  }
}

class ToscaVersion extends ToscaAst {
  constructor(args, context) {
  	super(args.data)
 	this.val = (args && args.data) ? args.data.val : null
  }	
}

class ToscaServiceTemplate extends ToscaAst {
  constructor(args, context)  {
  	super(context)
  	this.tosca_definitions_version 	= args.tosca_definitions_version
  	this.description 				= args.description
  	this.namespace 					= args.namespace
  	this.metadata 					= args.metadata
    this.imports            = args.imports
  }
}

class ToscaMetadata extends ToscaAst {
  constructor(args, context)  {
  	super(context)
//  	this.template_author 	= args.template_author
//  	this.template_version	= args.template_version
//  	this.template_name 		= args.template_name
  	for (let metadata in args) {
  		this[metadata] = args[metadata]
  	}
  }
}


class ToscaNull extends ToscaAst {
  constructor(args, context)  {
  	super(null)  
  }
}

class ToscaRepository extends ToscaAst {
  constructor(args, context)  {
  	super(context)
  	if (args && args.data && args.data.val) {
  		this.url = new ToscaURL(args, context) 
  		this.description = null
  		this.credential = null
  	} else if (args.url) {
  		this.url = args.url
  		this.description = args.description
  		this.credential = args.credential
  	} else throw Error(`Syntax error : '${this.val}' is not a valid url`);
  }
}

class ToscaRepositories extends ToscaAst {
  constructor(args, context)  {
  	super(context)
  	this.ids = args
  }
}

class ToscaCredential extends ToscaAst {
  constructor(args, context)  {
  	super(context)
    debugger
  	this.token 		= args.token
  	this.protocol 	= args.protocol
  	this.token_type = args.token_type
  	this.user 		= args.user 
  }
}

class ToscaImports extends ToscaAst {
  constructor(args, context)  {
    super(context)
    this.items = args
  }
}

class ToscaImport extends ToscaAst {
  constructor(args, context)  {
    super(context)
    debugger
    this.repository       = args.repository
    this.file             = args.file
    this.namespace_prefix = args.namespace_prefix
    this.namespace_uri    = args.uri
  }
}
    

const classes = {
  ToscaAst,
	ToscaNull,
	ToscaVersion,
  ToscaStr,
  ToscaURL,
  ToscaServiceTemplate,
  ToscaMetadata,
  ToscaRepository,
  ToscaRepositories,
  ToscaCredential,
  ToscaImports,
  ToscaImport
};

class DynamicClass {
    constructor (className, args, context) {
        return new classes[className](args, context);
    }
}

exports.DynamicClass = DynamicClass
exports.classes = classes
