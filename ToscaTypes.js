
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
  	this.tosca_definitions_version 	
                      = args.data.tosca_definitions_version
  	this.description 	= args.data.description
  	this.namespace 		= args.data.namespace
  	this.metadata 		= args.data.metadata
    this.imports      = args.data.imports
  }
}

class ToscaMetadata extends ToscaAst {
  constructor(args, context)  {
  	super(context)
//  	this.template_author 	= args.template_author
//  	this.template_version	= args.template_version
//  	this.template_name 		= args.template_name
  	for (let metadata in args.data) {
  		this[metadata] = args.data[metadata]
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
  	} else if (args.data.url) {
  		this.url = args.data.url
  		this.description = args.data.description
  		this.credential = args.data.credential
  	} else throw Error(`Syntax error : '${this.data.val}' is not a valid url`);
  }
}

class ToscaRepositories extends ToscaAst {
  constructor(args, context)  {
  	super(context)
  	this.ids = args.data
  }
}

class ToscaCredential extends ToscaAst {
  constructor(args, context)  {
  	super(context)
    debugger
  	this.token 		= args.data.token
  	this.protocol 	= args.data.protocol
  	this.token_type = args.data.token_type
  	this.user 		= args.data.user 
  }
}

class ToscaImports extends ToscaAst {
  constructor(args, context)  {
    super(context)
    this.items = args.data
  }
}

class ToscaImport extends ToscaAst {
  constructor(args, context)  {
    super(context)
    debugger
    this.repository       = args.data.repository
    this.file             = args.data.file
    this.namespace_prefix = args.data.namespace_prefix
    this.namespace_uri    = args.data.uri
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
        return new classes[(args) ? className : "ToscaNull"](args, context);
    }
}

exports.DynamicClass = DynamicClass
exports.classes = classes
