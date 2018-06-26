
const Ajv = require("ajv");
const ajv = new Ajv({allErrors: false, jsonPointers: true, verbose: true});
const ajvk = require('ajv-keywords')(ajv,'instanceof');
//require('ajv-errors')(ajv /*, {singleError: true} */);
var instanceofDef = require('ajv-keywords').get('instanceof').definition;

const yaml = require('yaml-js')


instanceofDef.CONSTRUCTORS.Value = yaml.nodes.Node;
instanceofDef.CONSTRUCTORS.Scalar = yaml.nodes.ScalarNode;
instanceofDef.CONSTRUCTORS.Sequence = yaml.nodes.SequenceNode;
instanceofDef.CONSTRUCTORS.Mapping = yaml.nodes.MappingNode;


ajv.addKeyword('instanceofyaml', {
  type: 'object',
  macro: function (sch) {
    return {
      "instanceof": "Scalar",
      "properties": {
        "tag": { "pattern": (sch instanceof Array) ? sch.join('|') : sch }
      }
    }
  }
})

ajv.addKeyword('dictRequired', {
  type: 'object',
  macro: function (sch) {
    return {
      "instanceof": "Mapping",
      "properties": {
        "val": {
          "required": sch
	      }
      }
    }
  },
  metaSchema: {
    type: 'array',
    items: { type: 'string' }
  }
});

ajv.addKeyword('dictPatternRequired', {
  type: 'object',
  macro: function (sch) {
    return {
      "instanceof": "Mapping",
      "properties": {
         "val": {
            "patternRequired": sch
   }
      }
    }
  },
  metaSchema: {
    type: 'array',
    items: { type: 'string' }
  }
});

ajv.addKeyword('dictMinProperties', {
  type: 'object',
  macro: function (sch) {
    return {
      "instanceof": "Mapping",
      "properties": {
         "val": {
            "minProperties": sch
   }
      }
    }
  },
  metaSchema: {
    type: 'number',
  }
});

ajv.addKeyword('dictMaxProperties', {
  type: 'object',
  macro: function (sch) {
    return {
      "instanceof": "Mapping",
      "properties": {
         "val": {
            "maxProperties": sch
   }
      }
    }
  },
  metaSchema: {
    type: 'number',
  }
});

ajv.addKeyword('dictProperties', {
  type: 'object',
  macro: function (sch, parentSchema) {

    newSchema = {
      "instanceof": "Mapping",
      "properties": {
        "val": {
          "type": "object",
          "properties": sch,
          "additionalProperties":
	          (parentSchema.dictAdditionalProperties)
	            ? parentSchema.dictAdditionalProperties
	            : false,
          "patternProperties":
            (parentSchema.dictPatternProperties)
              ? parentSchema.dictPatternProperties
              : {}
        }
      }
    };

    return newSchema;
  },
  metaSchema: {
    type: 'object',
  }
});

ajv.addKeyword('dictIdsDefinition', {
  type: 'object',
  macro: function (sch, parentSchema) {

    newSchema = {
      "instanceof": "Mapping",
      "properties": {
        "val": {
          "type": "object",
          "patternProperties": { ".*": sch }
        }
      }
    };

    return newSchema;
  },
  metaSchema: {
    type: 'object',
  }
});

ajv.addKeyword('idDefinition', {
  type: 'object',
  macro: function (sch, parentSchema) {

    newSchema = {
      "instanceof": "Mapping",
      "properties": {
        "val": {
          "type": "object",
          "minProperties": 1,
          "maxProperties": 1,
          "patternProperties": {
            ".*": sch
          }
        }
      }
    };

    return newSchema;
  },
  metaSchema: {
    type: 'object',
  }
});

ajv.addKeyword('listItems', {
  type: 'object',
  macro: function (sch, parentSchema) {

    newSchema = {
      "instanceof": "Sequence",
      "properties": {
        "val": {
          "type": "array",
          "items": (sch.list) ? sch.list : sch,
          "additionalItems":
            (parentSchema.listAdditionalItems)
              ? parentSchema.listAdditionalItems
              : false,
          "uniqueItems":
            (parentSchema.listUniqueItems)
              ? parentSchema.listUniqueItems
              : false
        }
      }
    };

    return newSchema;
  },
  metaSchema: {
    type: 'object',
  }
});

ajv.addKeyword('listMinItems', {
  type: 'object',
  macro: function (sch) {
    return {
      "instanceof": "Sequence",
      "properties": {
         "val": {
            "minItems": sch
   }
      }
    }
  },
  metaSchema: {
    type: 'number',
  }
});

ajv.addKeyword('listMaxItems', {
  type: 'object',
  macro: function (sch) {
    return {
      "instanceof": "Sequence",
      "properties": {
         "val": {
            "maxItems": sch
   }
      }
    }
  },
  metaSchema: {
    type: 'number',
  }
});

exports.ajv = ajv
