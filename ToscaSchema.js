
var values=require("./ToscaValues.js"); 
const Ajv = require("ajv");

var ajv = new Ajv({allErrors: false, jsonPointers: true, verbose: true});
var ajvk = require('ajv-keywords')(ajv,'instanceof');
//require('ajv-errors')(ajv /*, {singleError: true} */);

var instanceofDef = require('ajv-keywords').get('instanceof').definition;

instanceofDef.CONSTRUCTORS.Value = values.AstEntity;
instanceofDef.CONSTRUCTORS.ComparableValue = values.ComparableValue;
instanceofDef.CONSTRUCTORS.Dict = values.Dict;
instanceofDef.CONSTRUCTORS.List = values.List;
instanceofDef.CONSTRUCTORS.ScalarUnit = values.ScalarUnit;
instanceofDef.CONSTRUCTORS.ScalarUnitSize = values.ScalarUnitSize;
instanceofDef.CONSTRUCTORS.ScalarUnitTime = values.ScalarUnitTime;
instanceofDef.CONSTRUCTORS.ScalarUnitFreq = values.ScalarUnitFreq;
instanceofDef.CONSTRUCTORS.Timestamp = values.Timestamp;
instanceofDef.CONSTRUCTORS.Num = values.Num;
instanceofDef.CONSTRUCTORS.Int = values.Int;
instanceofDef.CONSTRUCTORS.Real = values.Real;
instanceofDef.CONSTRUCTORS.Bool = values.Bool;
instanceofDef.CONSTRUCTORS.Inf = values.Inf;
instanceofDef.CONSTRUCTORS.Unbounded = values.Unbounded;
instanceofDef.CONSTRUCTORS.NaNumber = values.NaNumber;
instanceofDef.CONSTRUCTORS.NullValue = values.NullValue;
instanceofDef.CONSTRUCTORS.Str = values.Str;
instanceofDef.CONSTRUCTORS.Range = values.Range;
instanceofDef.CONSTRUCTORS.Version = values.Version;

ajv.addKeyword('dictOf', {
  type: 'object',
  compile: function (sch) {
      return function(data) {
        return (data instanceof Dict) && (data.isDictOf(sch))	
      }
  },
  metaSchema: {
    type: 'string'
  }
});

ajv.addKeyword('dictRequired', {
  type: 'object',
  macro: function (sch) {
    return {
      "instanceof": "Dict",
      "properties": {
         "value": {
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

ajv.addKeyword('dictMinProperties', {
  type: 'object',
  macro: function (sch) {
    return {
      "instanceof": "Dict",
      "properties": {
         "value": {
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
      "instanceof": "Dict",
      "properties": {
         "value": {
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
      "instanceof": "Dict",
      "properties": {
        "value": {
          "type": "object",
          "properties": sch,
          "additionalProperties":
	          (parentSchema.dictAdditionalProperties)
	            ? parentSchema.dictAdditionalProperties
	            : false,
          "patternProperties":
            (parentSchema.dictPatternProperties)
              ? parentSchema.dictAdditionalProperties
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
      "instanceof": "Dict",
      "properties": {
        "value": {
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
      "instanceof": "Dict",
      "properties": {
        "value": {
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
      "instanceof": "List",
      "properties": {
        "value": {
          "type": "array",
          "items": sch,
          "additionalItems":
            (parentSchema.listAdditionalItems)
              ? parentSchema.listAdditionalItems
              : false,
          "uniqueItems":
            (parentSchema.listUniqueItems)
              ? parentSchema.listUniqueItems
              : true
        }
      }
    };

    return newSchema;
  },
  metaSchema: {
    type: 'object',
  }
});

ajv.addKeyword('listOf', {
  type: 'object',
  compile: function (sch) {
      return function(data) {
        return (data instanceof List) && (data.isListOf(sch)) 
      }
  },
  errors: false,
  metaSchema: {
    type: 'string'
  }
});

exports.ajv = ajv