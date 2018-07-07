
exports=module.exports={};

class ToscaAst {
  constructor(context) {
  	this.context = context
  }
}

class ToscaStr extends ToscaAst {
  constructor(args, context) {
  	super(context)
 	this.val = args.value.val
  }
}

class ToscaVersion extends ToscaAst {
  constructor(args, context) {
  	super(context)
 	this.val = args.value.val
  }	
}

class ToscaServiceTemplate extends ToscaAst {
  constructor(args, context)  {
  	super(context)
  	this.tosca_definitions_version 	= args.tosca_definitions_version
  	this.description 				= args.description
  	this.namespace 					= args.namespace
  	this.metadata 					= args.metadata
  }
}

class ToscaMetadata extends ToscaAst {
  constructor(args, context)  {
  	super(context)
  	this.template_author 	= args.template_author
  	this.template_version	= args.template_version
  	this.template_name 		= args.template_name
  }
}


class ToscaNull extends ToscaAst {
  constructor(args, context)  {
  	super(null)  
  }
}

const classes = {
	ToscaNull,
	ToscaVersion,
    ToscaStr,
    ToscaServiceTemplate,
    ToscaMetadata
};

class DynamicClass {
    constructor (className, args, context) {
        return new classes[className](args, context);
    }
}

exports.DynamicClass = DynamicClass