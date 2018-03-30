/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 by Bart Kiers
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * Project      : ditrit tosca parser; an ANTLR4 grammar for TOSCA OASIS
 *                https://github.com/bkiers/python3-parser
 * Developed by : reivaxt@gmail.com
 */
grammar Tosca;

// All comments that start with "///" are copy-pasted from
// The TOSCA OASIS Reference: http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.1/TOSCA-Simple-Profile-YAML-v1.1.html

tokens { INDENT, DEDENT }

@lexer::members {

  let CommonToken = require('antlr4/Token').CommonToken;
  let ToscaParser = require('./ToscaParser').ToscaParser;

  let old_lexer = ToscaLexer;
  ToscaLexer = function() {
    old_lexer.apply(this, arguments);
    this.reset.call(this);
  }

  ToscaLexer.prototype = Object.create(old_lexer.prototype);
  ToscaLexer.prototype.constructor = ToscaLexer;

  ToscaLexer.prototype.reset = function() {
    // A queue where extra tokens are pushed on (see the NEWLINE lexer rule).
    this.token_queue = [];

    // The stack that keeps track of the indentation level.
    this.indents = [];

    // The amount of opened braces, brackets and parenthesis.
    this.opened = 0;

    antlr4.Lexer.prototype.reset.call(this);
  };

  ToscaLexer.prototype.emitToken = function(token) {
    this._token = token;
    this.token_queue.push(token);
  };

  /**
   * Return the next token from the character stream and records this last
   * token in case it resides on the default channel. This recorded token
   * is used to determine when the lexer could possibly match a regex
   * literal.
   *
   */
  ToscaLexer.prototype.nextToken = function() {
    // Check if the end-of-file is ahead and there are still some DEDENTS expected.
    if (this._input.LA(1) === ToscaParser.EOF && this.indents.length) {

      // Remove any trailing EOF tokens from our buffer.
      this.token_queue = this.token_queue.filter(function(val) {
        return val.type !== ToscaParser.EOF;
      });

      // First emit an extra line break that serves as the end of the statement.
      this.emitToken(this.commonToken(ToscaParser.NEWLINE, "\n"));

      // Now emit as much DEDENT tokens as needed.
      while (this.indents.length) {
        this.emitToken(this.createDedent());
        this.indents.pop();
      }

      // Put the EOF back on the token stream.
      this.emitToken(this.commonToken(ToscaParser.EOF, "<EOF>"));
    }

    let next = antlr4.Lexer.prototype.nextToken.call(this);
    return this.token_queue.length ? this.token_queue.shift() : next;
  };

  ToscaLexer.prototype.createDedent = function() {
    return this.commonToken(ToscaParser.DEDENT, "");
  }

  ToscaLexer.prototype.commonToken = function(type, text) {
    let stop = this.getCharIndex() - 1;
    let start = text.length ? stop - text.length + 1 : stop;
    return new CommonToken(this._tokenFactorySourcePair, type, antlr4.Lexer.DEFAULT_TOKEN_CHANNEL, start, stop);
  }

  ToscaLexer.prototype.getIndentationCount = function(whitespace) {
    return whitespace.length
  }
  
  ToscaLexer.prototype.atStartOfInput = function() {
    return this.getCharIndex() === 0;
  }
}

@parser::header {

  class UnorderedClauses {
  
    constructor(thisparser) {
    this.items = {};
    this.mandatory = [];
    this.label = "";
    this.thisparser = thisparser;
    
    return this;
    };

    add(clause) {
          let clauseToken = clause.start.text; 
          this.items[clauseToken] = this.items[clauseToken] + 1 || 1;
    };

    setLabel(label) {
          this.label = label; 
    };

    setMandatory(mandatory) {
          this.mandatory = mandatory; 
    }

    check() {
          for (let item of this.mandatory) 
     	    if (!(item in this.items)) 
     	      this.thisparser.notifyErrorListeners("No '" + item + "' value provided for property '" + this.label + "'");
    	  for (let i in this.items) 
     	    if (this.items[i] > 1) 
     	      this.thisparser.notifyErrorListeners("The clause '" + i + "' is duplicated in entity '" + this.label + "'"); 
    };
    
  };

  function isString(s) {
    return typeof(s) === 'string' || s instanceof String;
  }

   function isArray(a) {
    return a instanceof Array;
  }

   function isRegexp(r) {
    return ((r instanceof RegExp) || isString(r));
  }

}


/*
 * parser rules
 */

file_input
 : ( NEWLINE | stmt )* EOF
 ;
 
test
 : ( NEWLINE | stmp_test )* EOF
 ;

stmp_test
 : map
 | list
 | namespace
 | descr
 | properties
 | attributes
 | inputs
 | data_types
 ;

stmt
 : workflow_source_weavings
 | tosca_definitions_version
 | namespace
 | metadata
 | repositories
 | constraints
 ;

descr
 : 'description:' str NEWLINE?
 ;

service_template
 : tosca_definitions_version
   { let u = new UnorderedClauses(this); u.label = 'service template';}
   ( service_template_clause {u.add($service_template_clause.ctx)} )+
   { u.check(); }
 ;
 
service_template_clause
 : namespace
 | metadata
 | repositories
 | file_imports
 | descr 
 | artifact_types
 | data_types
 | capability_types
 | interface_types
 | relationship_types
 | node_types
 | group_types
 | policy_types
 | topology_template
 ;

topology_template
 : 'topology_template:' NEWLINE
      INDENT
      { let u = new UnorderedClauses(this); u.label = 'topology_template'; }
        (topology_template_clause {u.add($topology_template_clause.ctx)} )+
      DEDENT
	  { u.check(); }
 ;

topology_template_clause
 : descr
 | input_parameters
 | output_parameters
 | node_templates
 | relationship_templates
 | group_defs
 | policy_defs
 | substitution_mapping
 | imperative_workflows
 ;                                   
 
substitution_mapping 
 : 'substitution_mappings:' NEWLINE
   INDENT
     substitution_mapping_node_type+
   DEDENT
 ;

substitution_mapping_node_type
 : 'node_type:' NEWLINE 
      INDENT
      { let u = new UnorderedClauses(this); u.label = 'node_type substitution'; }
        (substitution_mapping_clause {u.add($substitution_mapping_clause.ctx)})+
      DEDENT
      { u.check(); }
 ;
 
substitution_mapping_clause
 : properties_mapping
 | capabilities_mapping
 | requirements_mapping
 | attributes_mapping
 | interfaces_mapping
 ;

properties_mapping
 : 'properties:' NEWLINE
     INDENT
       property_mapping+
     DEDENT
 ;

property_mapping
 : ID ':' value NEWLINE
 | ID ':' '[' ID ']'
 | ID ':' '[' ID ',' ID ']'
 | ID ':' '[' ID ',' ID ',' ID ']'
 | ID ':' NEWLINE
     INDENT
       property_mapping_clause
     DEDENT
 ;

property_mapping_clause
 : 'mapping:' ID NEWLINE
 | 'mapping:' '[' ID ',' ID ']' NEWLINE
 | 'mapping:' '[' ID ',' ID ',' ID ']' NEWLINE
 | 'value:' value NEWLINE
 ;

attributes_mapping
 : 'attributes:' NEWLINE
     INDENT
       attribute_mapping+
     DEDENT
 ;

attribute_mapping
 : ID ':' value NEWLINE
 | ID ':' '[' ID ']'
 | ID ':' '[' ID ',' ID ']'
 | ID ':' '[' ID ',' ID ',' ID ']'
 | ID ':' NEWLINE
     INDENT
       attribute_mapping_clause
     DEDENT
 ;

attribute_mapping_clause
 : 'mapping:' ID NEWLINE
 | 'mapping:' '[' ID ',' ID ']' NEWLINE
 | 'mapping:' '[' ID ',' ID ',' ID ']' NEWLINE
 | 'value:' value NEWLINE
 ;

capabilities_mapping
 : 'capabilities:' NEWLINE
     INDENT
       capability_mapping+
     DEDENT
 ;

capability_mapping
 : ID ':' '[' ID ',' ID ']'
 | ID ':' NEWLINE
     INDENT
       capability_mapping_clause
     DEDENT
 ;

capability_mapping_clause
 : 'mapping:' '[' ID ',' ID ']' NEWLINE
 | 'properties:' 
     INDENT
       ( ID ':' value )+
     DEDENT
 | 'attributes:' 
     INDENT
       ( ID ':' value )+
     DEDENT
 ;

requirements_mapping
 : 'requirements:' NEWLINE
     INDENT
       capability_mapping+
     DEDENT
 ;

requirement_mapping
 : ID ':' '[' ID ',' ID ']'
 | ID ':' NEWLINE
     INDENT
       capability_mapping_clause
     DEDENT
 ;

requirement_mapping_clause
 : 'mapping:' '[' ID ',' ID ']' NEWLINE
 | 'properties:' 
     INDENT
       ( ID ':' value )+
     DEDENT
 | 'attributes:' 
     INDENT
       ( ID ':' value )+
     DEDENT
 ;

interfaces_mapping
 : 'interfaces:' NEWLINE
   INDENT
     interface_mapping
   DEDENT
 ;

interface_mapping
 : ID ':' NEWLINE
    INDENT
      ( ID ':' ID )+
    DEDENT
 ;

node_templates
 : 'node_templates:' NEWLINE
	 INDENT
		node_template+ 
	 DEDENT
 ;

node_template
 : ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this);
       u.mandatory = ['type:']; u.label = $ID.text }
       (node_template_clause {u.add($node_template_clause.ctx)} )+
     DEDENT
 	 { u.check(); }
 ;
 
node_template_clause
 : 'type:' ID NEWLINE
 | descr
 | 'directives:' '[' short_str (',' short_str)* ']' NEWLINE 
 | 'directives:' NEWLINE
     INDENT
       ('-' INDENT short_str NEWLINE DEDENT)+
	 DEDENT
 | entity_metadata
 | properties
 | attributes
 | node_requirement_assignments
 | capability_assignments
 | interface_defs_template
 | artifact_defs
 | node_filter
 | 'copy:' ID NEWLINE
 ;


relationship_templates
 : 'relationship_templates:' NEWLINE
	 INDENT
		relationship_template+ 
	 DEDENT
 ;

relationship_template
 : ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this);
       u.mandatory = ['type:']; u.label = $ID.text }
       (relationship_template_clause 
         {u.add($relationship_template_clause.ctx)} )+
     DEDENT
 	 { u.check(); }
 ;
 
relationship_template_clause
 : 'type:' ID NEWLINE
 | descr
 | entity_metadata
 | properties
 | attributes
 | interface_defs_template
 | 'copy:' ID NEWLINE
 ;
 
tosca_definitions_version
 : 'tosca_definitions_version:' URI
   {  'http://docs.oasis-open.org/tosca/ns/simple/yaml/1.2' == $URI.text }?
 | 'tosca_definitions_version:' ID
   { 'tosca_simple_yaml_1_2' == $ID.text }?
 ;

namespace
 : 'namespace:' URI
 ;

 
metadata
 : 'metadata:' NEWLINE
     { let u = new UnorderedClauses(this);
       u.mandatory = []; u.label = 'metadata' }
     INDENT
       ( metadata_clause NEWLINE {u.add($metadata_clause.ctx) })+
     DEDENT
 	 { u.check(); }
 ;

metadata_clause
 : 'template_name:' short_str
 | 'template_author:' short_str
 | 'template_version:' version
 | ID ':' value
 ;

repositories
 : 'repositories:' NEWLINE
	  INDENT
	    repository+
	  DEDENT 
 ;

repository
 : repository_short 
 | repository_detail 
 ;

repository_short
 : ID ':' ID NEWLINE
 ;
 
repository_detail
 : ID ':' NEWLINE
     { let u = new UnorderedClauses(this); u.label = $ID.text }
	INDENT
	  ( repository_clause {u.add($repository_clause.ctx) } )+
	DEDENT 
	{ u.check(); }
 ;
 
repository_clause
 : repository_url
 | descr
 | repository_cred
 ;
 
repository_url
 : 'url:' short_str NEWLINE
 ;

repository_cred
 : 'credential:' '{' cred_ele (',' cred_ele)* '}' NEWLINE 
 | 'credential:' NEWLINE
    { let u = new UnorderedClauses(this); }
	INDENT
	  ( cred_ele {u.add($cred_ele.ctx) } )+
	DEDENT
	{ u.check(); }
 ;

cred_ele
 : 'token:' ID NEWLINE
 | 'protocol:' ID  NEWLINE
 | 'token_type:' ID NEWLINE
 | 'user:' ID NEWLINE
 ;

file_imports
 : 'imports:' NEWLINE
	  INDENT
		file_import+ 
	  DEDENT
 ;

file_import
 : '-' INDENT short_str NEWLINE DEDENT 
 | '-' INDENT ID ':' short_str NEWLINE DEDENT 
 | '-' INDENT ID ':' NEWLINE
         { let u = new UnorderedClauses(this); 
           u.mandatory = ['file:']; u.label = $ID.text}
	     INDENT
	       ( file_import_clause {u.add($file_import_clause.ctx) } )+
	     DEDENT
	     { u.check(); }
	   DEDENT
 ;
  
artifact_defs
 : 'artifacts:' NEWLINE
      INDENT
		artifact_def+
      DEDENT 
 ;

artifact_def
 : ID ':' ID NEWLINE 
 | ID ':' NEWLINE
    { let u = new UnorderedClauses(this);
      u.mandatory = ['type', 'file']; u.label = $ID.text; }
 	INDENT
 	  (artifact_def_clause {u.add($artifact_def_clause.ctx) })+
	DEDENT
 	{ u.check(); }
 ;

artifact_def_clause
 : 'type:' ID  NEWLINE 
 | 'file:' short_str NEWLINE
 | 'repository:' ID
 | descr
 | 'deploy_path:' ID
 ;

node_requirement_assignments
 : 'requirements:' NEWLINE
	  INDENT
		node_requirement_assignment+
	  DEDENT
 ;

node_requirement_assignment
 : '-' INDENT ID ':' ID NEWLINE DEDENT
 | '-' INDENT ID ':' NEWLINE
         INDENT
	     { let u = new UnorderedClauses(this); }
           ( node_requirement_assignment_clause 
             {u.add($node_requirement_assignment_clause.ctx)} )+
         DEDENT
 	     { u.check(); }
 	  DEDENT
 ;

node_requirement_assignment_clause
 : 'node:' ID NEWLINE
 | 'relationship:' ID NEWLINE
 | 'capability:' ID NEWLINE
 | 'occurences:' range NEWLINE
 | node_filter
 ;

properties
 : 'properties:' NEWLINE
     INDENT
       property+
     DEDENT
 ;
 
property
 : ID ':' NEWLINE 
     { let u = new UnorderedClauses(this);
       u.mandatory = ['type:']; u.label = $ID.text; }
 	 INDENT
 	   (property_clause {u.add($property_clause.ctx) } )+
 	 DEDENT
 	 { u.check(); }
 ;

property_clause
 : 'type:' (ID | BASETYPE_NAMES )  NEWLINE               
 | descr  
 | constraints 					        
 | 'required:' bool  NEWLINE         
 | 'default:' value  NEWLINE?         
 | 'status:' ID NEWLINE
       { ['supported', 'unsupported', 'experimental', 'deprecated'].includes($ID.text) }?
 | entry_decl
 | entity_metadata
 ;
// | 'external-schema:' str NEWLINE? a priori erreur dans le doc : le schema est defini en contrainte

property_assignments
 : 'properties:'
	 INDENT
		(property_assignment )+
	 DEDENT 
 ;

/* Forme étendue prévue dans la norme pour les attributs mais 
 * pas pour les propriétés. A priori incohérent, nous 
 * l'autorisons aussi pour les propriétés */
property_assignment
 : ID ':' value NEWLINE
 | ID ':' value_expr NEWLINE
 | ID ':' NEWLINE
	 INDENT
     { let u = new UnorderedClauses(this);
       u.mandatory = ['value:']; u.label = $ID.text; }
	  (property_assignment_clause {u.add($property_assignment_clause.ctx)} )+
 	 DEDENT
 	 { u.check(); }
 ;

property_assignment_clause
 : descr
 | 'value:' value
 | 'value:' value_expr
 ;

attributes
 : 'attributes:' NEWLINE
     INDENT
       attribute+
     DEDENT
 ;
 
attribute
 : ID ':' NEWLINE 
     { let u = new UnorderedClauses(this);
       u.mandatory = ['type:']; u.label = $ID.text }
 	 INDENT
 	   (attribute_clause {u.add($attribute_clause.ctx) } )+
 	 DEDENT
 	 { u.check(); }
 ;

attribute_clause
 : 'type:' (ID | BASETYPE_NAMES )  NEWLINE               
 | descr        
 | 'default:' value  NEWLINE?    
 | 'status:' ID NEWLINE
       { ['supported', 'unsupported', 'experimental', 'deprecated'].includes($ID.text) }?
 | entry_decl
 ;

attribute_assignments
 : 'attributes:' NEWLINE
	 INDENT
		attribute_assignment+
	 DEDENT ;

attribute_assignment
 : ID ':' value NEWLINE
 | ID ':' value_expr NEWLINE
 | ID ':' NEWLINE 
	 INDENT
     { let u = new UnorderedClauses(this);
       u.mandatory = ['value:']; u.label = $ID.text; }
	  (attribute_assignment_clause {u.add($attribute_assignment_clause.ctx)} )+
 	 DEDENT
 	 { u.check(); }
 ;

capability_assignments
 : 'capabilities:' NEWLINE
	 INDENT
		capability_assignment+
	 DEDENT 
 ;
	
capability_assignment
 : ID ':' NEWLINE  
	 INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text; }
	  ( capability_assignment_clause {u.add($capability_assignment_clause.ctx)} )+
	 DEDENT
 	 { u.check(); }
 ;

capability_assignment_clause
 : property_assignments
 | attribute_assignments
 ;
  
attribute_assignment_clause
 : descr
 | 'value:' value
 | 'value:' value_expr
 ;

inputs
 : 'inputs:' NEWLINE
     INDENT
       property+
     DEDENT
 ;

input_assignments
 : 'inputs:' NEWLINE
     INDENT
       property_assignment+
     DEDENT
 ;
 
input_parameters
 : 'inputs:' NEWLINE
     INDENT
       input_parameter+
     DEDENT
 ;
 
input_parameter
 : 'name:' ID NEWLINE 
     { let u = new UnorderedClauses(this);
       u.mandatory = ['type:']; u.label = $ID.text }
 	 INDENT
 	   (input_parameter_clause {u.add($input_parameter_clause.ctx) } )+
 	 DEDENT
 	 { u.check(); }
 ;

input_parameter_clause
 : 'type:' (ID | BASETYPE_NAMES )  NEWLINE               
 | descr        
 | constraints 					        
 | 'required:' bool  NEWLINE         
 | 'default:' value  NEWLINE?         
 | 'status:' ID NEWLINE
       { ['supported', 'unsupported', 'experimental', 'deprecated'].includes($ID.text) }?
 | entry_decl
 | 'value:' value
 ;
 
output_parameters
 : 'inputs:' NEWLINE
     INDENT
       output_parameter+
     DEDENT
 ;
 
output_parameter
 : 'name:' ID NEWLINE 
     { let u = new UnorderedClauses(this);
       u.mandatory = ['type:']; u.label = $ID.text }
 	 INDENT
 	   (output_parameter_clause {u.add($output_parameter_clause.ctx) } )+
 	 DEDENT
 	 { u.check(); }
 ;

output_parameter_clause
 : 'type:' (ID | BASETYPE_NAMES )  NEWLINE               
 | descr        
 | constraints 					        
 | 'required:' bool  NEWLINE         
 | 'default:' value  NEWLINE?
 | 'status:' ID NEWLINE
       { ['supported', 'unsupported', 'experimental', 'deprecated'].includes($ID.text) }?
 | entry_decl
 | 'value:' ( value | value_expr )
 ;
 
constraints
 : 'constraints:' NEWLINE
		INDENT
			( '-' INDENT constraint_clause NEWLINE? DEDENT)+
		DEDENT
 ;

constraint_clause
 : 'equal:'            value
 | 'greater_than:'     comparable_value 
 | 'greater_or_equal:' comparable_value 
 | 'less_than:'        comparable_value 
 | 'less_or_equal:'    comparable_value 
 | 'in_range:'         range 
 | 'valid_values:'     list 
 | 'length:'           ( str | list | map ) 
 | 'min_length:'       ( str | list | map )
 | 'max_length:'       ( str | list | map )
 | 'pattern:'          short_str
 | 'schema:'           str 
 ;

entry_decl
 : entry_detailed
 | 'entry_schema:' ( ID | BASETYPE_NAMES ) NEWLINE
 ;

entry_detailed
 : 'entry_schema:' NEWLINE
     { let u = new UnorderedClauses(this);
       u.mandatory = ['type:'] }
	 INDENT
	   (entry_clause {u.add($entry_clause.ctx) } )+
	 DEDENT
	 { u.check(); }
 ;

entry_clause
 : 'type:' (ID | BASETYPE_NAMES) NEWLINE
 | descr
 | entry_decl              
 | constraints
 ;

file_import_clause
 : 'file:' short_str NEWLINE
 | 'repository:' ID NEWLINE
 | 'namespace_prefix:' ID NEWLINE
 | 'namespace_uri:' short_str NEWLINE
 ;

entity_metadata
 : 'metadata:' NEWLINE
     { let u = new UnorderedClauses(this); u.label = 'metadata' }
     INDENT
       ( entity_metadata_clause 
         {u.add($entity_metadata_clause.ctx) })+
     DEDENT
 	 { u.check(); }
 ;

entity_metadata_clause
 : ID ':' value NEWLINE
 ;
 
entity_clause
 : 'derived_from:' ID NEWLINE
 | 'version:' version NEWLINE
 | entity_metadata
 | descr
 ;

node_types
 : 'node_types:' NEWLINE
	 INDENT
		node_types+
	 DEDENT
 ;

node_type
 : ID ':' NEWLINE
	 INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text }
         ( node_type_clause {u.add($node_type_clause.ctx) })+
     DEDENT
 	 { u.check(); }
 ;

node_type_clause
 : properties
 | attributes
 | capability_defs
 | requirement_defs
 | interface_defs
 | artifact_defs
 | declarative_node_workflows
 ;
	
relationship_types
 : 'relationship_types:' NEWLINE 
	 INDENT
		relationship_type+
	 DEDENT
	;

relationship_type
 : ID ':' NEWLINE
	 INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text }
         ( relationship_type_clause {u.add($relationship_type_clause.ctx) })+
     DEDENT
 	 { u.check(); }
 ;

relationship_type_clause
 : properties
 | attributes
 | interface_defs
 | 'valid_target_types:' '[' ID (',' ID)* ']' NEWLINE
 | 'valid_target_types:' NEWLINE
     INDENT
       ( '-' INDENT ID NEWLINE DEDENT)+
     DEDENT
 | declarative_rel_workflows
 ;

artifact_types
 : 'artifact_types:' NEWLINE
	 INDENT
	   artifact_type+
	 DEDENT 
 ;

artifact_type
 : ID ':' NEWLINE
	 INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text }
	   ( artifact_type_clause {u.add($artifact_type_clause.ctx)} )+
	 DEDENT
 	 { u.check(); }
 ;

 

artifact_type_clause
 : entity_clause 
 | 'file_ext:' '[' short_str (',' short_str)* ']' NEWLINE
 | 'mime_type:' short_str NEWLINE
 | properties
 ;

data_types
 : 'data_types:' NEWLINE 
	 INDENT
	   data_type+
	 DEDENT 
 ;
	
data_type
 : ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text }
       ( data_type_clause {u.add($data_type_clause.ctx)} )+
     DEDENT
     { u.check(); }
 ;
     
data_type_clause
 : entity_clause 
 | properties
 | constraints
 ;

capability_types
 : 'capability_types:' NEWLINE
     INDENT
	   capability_type+
	 DEDENT 
 ;

capability_type
 : ID ':' NEWLINE
	 INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text }
	   ( capability_type_clause 
	     {u.add($capability_type_clause.ctx)})+
	 DEDENT
     { u.check(); }	 
 ;

capability_type_clause
 : entity_clause 
 | properties
 | attributes
 | 'valid_source_types:' '[' ID (',' ID)* ']' NEWLINE 
 | 'valid_source_types:' NEWLINE
	 INDENT
	   ( '-' INDENT ID NEWLINE DEDENT )+
	 DEDENT
 ; 

capability_defs
 : 'capabilities' ':' NEWLINE
	 INDENT
	   capability_def+
	 DEDENT 
 ;

// quid de 'occurecne' qui n'a pas de sens...
capability_def
 : ID ':' ID NEWLINE
 | ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); 
       u.mandatory = [ 'type' ]; u.label = $ID.text }
       ( capability_def_clause 
         {u.add($capability_def_clause.ctx)})+
     DEDENT
     { u.check(); }	 
 ;

capability_def_clause
 : 'type:' ID NEWLINE
 | descr
 | properties
 | attributes
 | 'valid_source_types:' '[' ID (',' ID)* ']' NEWLINE 
 | 'valid_source_types:' NEWLINE
	 INDENT
	   ( '-' INDENT ID NEWLINE DEDENT)+
	 DEDENT
 ;

requirement_defs
 : 'requirements:' NEWLINE
	INDENT
	  requirement_def+
	DEDENT
 ;

requirement_def
 : '-' INDENT ID ':' ID NEWLINE DEDENT 
 | '-' ID INDENT ':' NEWLINE
         INDENT
         { let u = new UnorderedClauses(this); 
           u.mandatory = [ 'capability:' ]; u.label = $ID.text }
           ( requirement_def_clause {u.add($requirement_def_clause.ctx)})+
         DEDENT
         { u.check(); }
       DEDENT
 ;

requirement_def_clause
 : 'capability:' ID NEWLINE
 | 'node:' ID NEWLINE
 | 'occurences:' range NEWLINE
 | 'relationship:' ID NEWLINE
 | 'relationship:' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); u.mandatory = [ 'type:' ]; }
       ( requirement_def_relation_clause 
         {u.add($requirement_def_relation_clause.ctx)})+
     DEDENT
     { u.check(); }	 
 ;

requirement_def_relation_clause
 : 'type:'  ID NEWLINE
 | interface_defs
 ;

interface_types
 : 'interface_types:' NEWLINE 
	 INDENT
	   interface_type+
	 DEDENT 
 ;

interface_type
 : ID ':' NEWLINE
	 INDENT
     { let u = new UnorderedClauses(this); u.mandatory = [ 'type:' ]; }
	  ( interface_type_clause {u.add($interface_type_clause.ctx)})+
 	 DEDENT
     { u.check(); }	 
 ;

interface_type_clause
 : entity_clause
 | inputs
 | operation_def
 ;
 
interface_defs
 : 'interfaces:' NEWLINE
     INDENT
       interface_def+
     DEDENT
 ;

interface_def
 : ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); 
        u.label = $ID.text; u.mandatory = [ 'type:' ]; }
       ( interface_def_clause {u.add($interface_def_clause.ctx)})+
     DEDENT
     { u.check(); }	 
 ;

interface_def_clause
 : 'type:' ID NEWLINE
 | inputs
 | operation_def
 ;

interface_defs_template
 : 'interfaces:' NEWLINE
     INDENT
       interface_def_template+
	 DEDENT 
 ;

interface_def_template
 : ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); 
       u.label = $ID.text; u.mandatory = [ 'type:' ]; }
       (interface_def_template_clause 
        {u.add($interface_def_template_clause.ctx)})+
     DEDENT
     { u.check(); }	 
 ;

interface_def_template_clause
 : 'type:' ID NEWLINE
 | input_assignments
 | operation_def
 ;
 
operation_def
 : ID ':' ID NEWLINE
 | ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text;}
       (operation_def_clause {u.add($operation_def_clause.ctx)})+
     DEDENT
     { u.check(); }	      
 ;

operation_def_clause
 : descr
 | inputs
 | 'implementation:' ID NEWLINE
 | 'implementation:' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); u.mandatory = [ 'primary:' ]; }
       (implementation_clause {u.add($implementation_clause.ctx)})+
     DEDENT
     { u.check(); }	 
 ;

implementation_clause
 : 'primary:' ID NEWLINE
 | 'dependencies:' NEWLINE
     INDENT
       ('-' INDENT ID NEWLINE DEDENT)+
     DEDENT
 ;

group_types
 : 'group_types:'
	INDENT
	  group_type+
	DEDENT
 ;

group_type
 : ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text; }
	   (group_type_clause {u.add($group_type_clause.ctx)})+
	 DEDENT
	 { u.check(); }	 
 ;

group_type_clause
 : 'derived_from:' ID NEWLINE
 | descr
 | entity_metadata
 | 'version:' ID NEWLINE
 | properties
 | capability_defs
 | requirement_defs
 | interface_defs
 | 'members:' '[' ID (',' ID)* ']' NEWLINE
 | 'members:' NEWLINE
     INDENT
      ('-' INDENT ID NEWLINE DEDENT )+
     DEDENT
 ;

group_defs
 : 'groups:' NEWLINE	
	 INDENT
		group_def+
	 DEDENT
 ;
	
group_def
 : ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); 
       u.label = $ID.text; u.mandatory = [ 'type:' ] }
	    ( group_def_clause {u.add($group_def_clause.ctx)})+
	 DEDENT
	 { u.check(); }	 
 ;
 
group_def_clause
 : 'type:' ID NEWLINE
 | descr
 | entity_metadata
 | properties
 | 'members:' '[' ID (',' ID )* ']' NEWLINE
 | 'members:' NEWLINE 
 	 INDENT
	   ( '-' INDENT ID NEWLINE DEDENT )+
	 DEDENT
	/* ID=type TOSCA (noeud, capacité, group) en coherence avec le type 
	 * meme si la dans la definition, la norme ne reference que les node templates 
	 * */ 
 | interface_defs_template
 ;

policy_types
 : 'policy_types:' NEWLINE
	 INDENT
	   policy_type+
	 DEDENT
 ;

policy_type
 : ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text; }
	    ( policy_type_clause {u.add($policy_type_clause.ctx)})+
	 DEDENT
	 { u.check(); }	 
 ;

policy_type_clause
 : 'derived_from:' ID NEWLINE
 | descr
 | entity_metadata
 | 'version:' ID NEWLINE
 | properties
 | 'targets:' '[' value (',' value)* ']' NEWLINE
 | 'targets:' NEWLINE
	INDENT
	  ( '-' INDENT value NEWLINE DEDENT )+
	DEDENT
 | trigger_defs
 ;

policy_defs
 : 'policies:' NEWLINE
	 INDENT
		policy_def+
	 DEDENT;

policy_def
 : '-' INDENT ID ':' NEWLINE
	     INDENT
         { let u = new UnorderedClauses(this); 
           u.label = $ID.text; u.mandatory = [ 'type:' ] }
	        ( policy_def_clause {u.add($policy_def_clause.ctx)})+
	     DEDENT
	     { u.check(); }
	   DEDENT
 ;
 
policy_def_clause
 : 'type:' ID NEWLINE
 | descr
 | entity_metadata
 | property_assignments
 | 'targets:' '[' ID (',' ID)* ']' NEWLINE 
 | 'targets:' NEWLINE 
	 INDENT
	   ( '-' INDENT ID NEWLINE DEDENT )+
	 DEDENT /* ID=type de noeud ou de groupe */ 
 | trigger_defs
 ;
		
trigger_defs
 : 'triggers:' NEWLINE
	 INDENT
		trigger_def+
	 DEDENT
 ;

trigger_def
 : ID ':' NEWLINE
	 INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text; }
	   ( trigger_def_clause {u.add($trigger_def_clause.ctx)} )+
	 DEDENT
	 { u.check(); }	 
 ;

trigger_def_clause
 : descr
 | 'event:' ID NEWLINE
 | 'event:' NEWLINE
     INDENT
     	'type:' ID NEWLINE
     DEDENT
 | 'schedule:' value // time interval ??
 | 'target_filter:' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); }
       (target_filter_clause {u.add($target_filter_clause.ctx)} )+
     DEDENT
	 { u.check(); }	 
 | 'condition:' constraint_clause NEWLINE 
 | 'condition:' NEWLINE 
     INDENT
       'constraint:' constraint_clause NEWLINE
	 DEDENT
 | 'period:' value NEWLINE // scalar-unit.time 
 | 'evaluations:' integer NEWLINE
 | 'method:' ID NEWLINE
 | 'action:' ID NEWLINE
 | 'action:' NEWLINE
	 INDENT
	   operation_def
	 DEDENT
 ;

target_filter_clause
 : 'node:' ID NEWLINE
 | 'requirement:' ID NEWLINE
 | 'capability:' ID NEWLINE
 ; 

node_filter
 : 'node_filter:' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); }
	   (node_filter_clause {u.add($node_filter_clause.ctx)} )+     
     DEDENT
	 { u.check(); }	 
 ;

node_filter_clause
 : properties_filter
 | capabilities_filter
 ;

properties_filter
 : 'properties:' NEWLINE
     INDENT
	   ( property_filter )+
	 DEDENT
 ;

property_filter
 : '-' INDENT ID ':' constraint_clause NEWLINE DEDENT
 | '-' INDENT ID ':' constraints DEDENT
 ;

capabilities_filter
 : 'capabilities:' NEWLINE
	  INDENT
	    capability_filter+
	  DEDENT
 ;

capability_filter
 : '-' INDENT ID ':' NEWLINE
	     INDENT
	       properties_filter
	     DEDENT
 ; 
 
declarative_node_workflows
 : 'workflows:' NEWLINE
	INDENT
		declarative_node_workflow+
	DEDENT;

declarative_node_workflow
 : ID ':' NEWLINE
	 INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text; }
	   ( declarative_node_workflow_clause 
	     {u.add($declarative_node_workflow_clause.ctx)} )+
	 DEDENT
	 { u.check(); }	 
 ;

declarative_node_workflow_clause
 : descr
 | entity_metadata
 | inputs
 | workflow_preconditions
 | workflow_steps
 ;

declarative_rel_workflows
 : 'workflows:' NEWLINE
	INDENT
		declarative_rel_workflow+
	DEDENT;

declarative_rel_workflow
 : ID ':' NEWLINE
     INDENT
     { let u = new UnorderedClauses(this); u.label = $ID.text; }
	   ( declarative_rel_workflow_clause 
	     {u.add($declarative_rel_workflow_clause.ctx)} )+
	 DEDENT
	 { u.check(); }	 
 ;

declarative_rel_workflow_clause
 : descr
 | entity_metadata
 | inputs
 | workflow_preconditions
 | workflow_source_weavings
 | workflow_target_weavings
 ;

workflow_source_weavings
 : 'source_weaving:' NEWLINE
	 INDENT
		workflow_source_weaving+
	 DEDENT 
 ;
 
workflow_target_weavings
 : 'target_weaving:' NEWLINE
	 INDENT
		workflow_target_weaving +
	 DEDENT
 ;
 
workflow_source_weaving
 : '-' INDENT
     { let u = new UnorderedClauses(this); }
         (workflow_source_weaving_clause 
          {u.add($workflow_source_weaving_clause.ctx)})+
     DEDENT
	 { u.check(); }	 
 ;
 
workflow_source_weaving_clause
 : ('after:'|'before:') workflow_state NEWLINE
 | ('wait_target:'|'after_target:') ID NEWLINE
 | 'activity:' ID NEWLINE
 ;

workflow_target_weaving
 : '-' INDENT
     { let u = new UnorderedClauses(this); }
         (workflow_target_weaving_clause 
          {u.add($workflow_target_weaving_clause.ctx)})+
       DEDENT
	 { u.check(); }	 
 ;

workflow_target_weaving_clause
 : ('after:'|'before:') workflow_state NEWLINE
 | ('wait_source:'|'after_source:') ID NEWLINE
 | 'activity:' ID
 ;

workflow_preconditions
 : 'preconditions:' NEWLINE
	 INDENT
		workflow_precondition+
	 DEDENT 
 ;

workflow_precondition
 : '-' INDENT
     { let u = new UnorderedClauses(this); }
         (workflow_precondition_clause 
          {u.add($workflow_precondition_clause.ctx)})+
       DEDENT
	 { u.check(); }	 
 ;

workflow_precondition_clause
 : 'target' ':' ID NEWLINE /* node template or group name */
 | 'target_relationship' ':' ID NEWLINE /* name of a requirement of the target */
 | workflow_condition_clauses
 ;

workflow_condition_clauses
 : 'condition:' ':' NEWLINE
  	 INDENT
  	   workflow_condition_clause+
  	 DEDENT
;

workflow_filter_clauses
 : 'filter:' NEWLINE
  	 INDENT
  	   workflow_condition_clause+
  	 DEDENT
;

workflow_condition_clause
 : workflow_condition_or_clause
 | workflow_condition_and_clause
 | workflow_condition_assert_clause
 ;
 
workflow_condition_or_clause
 : '-' INDENT 'or:' NEWLINE
         INDENT
           workflow_condition_clause+
         DEDENT
       DEDENT
 ;

workflow_condition_and_clause
 : '-' INDENT 'and:' NEWLINE
         INDENT
           workflow_condition_clause+
         DEDENT
       DEDENT
 ;

workflow_condition_assert_clause
 : '-' INDENT 'assert:' '[' workflow_assertion (',' workflow_assertion)* ']' NEWLINE DEDENT
 | '-' INDENT 'assert:' NEWLINE
         INDENT
           workflow_assertion+
         DEDENT
       DEDENT
 ;

workflow_assertion
 : ID ':' '[' '{' constraint_clause '}' (',' '{' constraint_clause '}')* ']' NEWLINE
 | ID ':' NEWLINE
		INDENT
		  ('-' constraint_clause)+
		DEDENT
 ;

workflow_steps
 : 'steps:'
	 INDENT
	   workflow_step+
	 DEDENT
 ;

workflow_step
 : ID ':' NEWLINE
    INDENT
      workflow_step_clause+
    DEDENT
 ;
 
workflow_step_clause
 : 'target:' ID NEWLINE /* node template or group name */
 | 'target_relationship:' ID NEWLINE /* name of a requirement of the target */
 | workflow_filter_clauses
 | workflow_activities
 | 'operation_host:' ID  NEWLINE
 | 'on_success:' '[' ID (',' ID)* ']' NEWLINE 
 | 'on_success:' NEWLINE
     INDENT
	   ('-' INDENT ID NEWLINE DEDENT )+
     DEDENT
 | 'on_failure:' '[' ID (',' ID)* ']' NEWLINE
 | 'on_failure:' NEWLINE
     INDENT
	   ('-' INDENT ID NEWLINE DEDENT)+
     DEDENT
 ;

workflow_activities
 : 'activities:' '[' workflow_activity (',' workflow_activity )* ']' NEWLINE 
 | 'activities:' NEWLINE 
  	INDENT
  		('-' INDENT workflow_activity NEWLINE DEDENT)+
  	DEDENT;

workflow_activity
 : 'delegate:' ID NEWLINE 
 | 'set_state:' workflow_state NEWLINE
 | 'call_operation:' ID NEWLINE
 | 'inline:' ID NEWLINE
 ; 

imperative_workflows
 : 'workflows:' NEWLINE
	 INDENT
		imperative_workflow+
	 DEDENT
 ;

imperative_workflow
 : ID ':' NEWLINE
     INDENT
       (imperative_workflow_clause )+
     DEDENT
 ;

imperative_workflow_clause
 : descr
 | entity_metadata
 | inputs
 | workflow_preconditions
 | workflow_steps
 ;

workflow_state
 : ID
       { [ 'initial', 'creating', 'created', 'configuring', 'configured',
             'starting', 'started', 'stopping', 'deleting', 
             'error' ].inludes($ID.text) }? 
             // 'stopped' et 'available' plus presents en 1.2
 ;

value_expr
 : '{' func_expr '}'
 ;

func_expr
 : func_concat 
 | func_token 
 | func_join
 | func_get_input 
 | func_get_property 
 | func_get_attribute 
 | func_get_operation_output 
 | func_get_nodes_of_types 
 | func_get_artifact 
 ;

func_arg
 : value_expr
 | short_str 
 ;

 
func_concat
 : 'concat:' 
     '[' func_arg (',' func_arg)+ ']' 
 ;

func_join
 : 'join:' 
 	 '[' ('[' short_str (',' short_str)+ ']') | func_arg (',' short_str)? ']' 
 ;

func_token
 : 'token:' 
     '[' func_arg ',' short_str ',' integer ']'
 ;

func_get_input
 : 'get_input:' 
     ID
 ;

func_get_property
 : 'get_property:' 
     '[' (('SELF' | 'HOST' | 'SOURCE' | 'TARGET') | ID) ',' 
         ID (',' (ID|integer))+ ']'
 ;

func_get_attribute
 : 'get_attribute:' 
     '[' (('SELF' | 'HOST' | 'SOURCE' | 'TARGER') | ID) ',' 
      	 ID (',' (ID|integer))+ ']'
 ;

func_get_operation_output
 : 'get_operation_output:' 
     '[' (('SELF' | 'HOST' | 'SOURCE' | 'TARGET') | ID) ',' 
	     ID ',' ID ',' ID ']';

func_get_nodes_of_types
 : 'get_nodes_of_types:' 
     ID
 ;

func_get_artifact
 : 'get_artifact:' 
     '[' (('SELF' | 'HOST' | 'SOURCE' | 'TARGET') | ID) ',' 
	     ID (',' (short_str | 'local_file'))? (',' bool)? ']'
 ;


value
 : comparable_value
 | null_value
 | nan
 | list 
 | map
 | range
 | bool
 | short_str
 ; 

comparable_value
 : size 
 | time
 | freq
 | infinity
 | number
 | timestamp
 | version
 ; 
 
 
list
 : '[' NEWLINE? (value ',' NEWLINE?)+ value NEWLINE? ']'
 | '[' NEWLINE? ']'
 | ('-' INDENT value NEWLINE? DEDENT)+
 | NEWLINE INDENT
      ('-' INDENT value NEWLINE? DEDENT)+
   DEDENT
 ;

map
 : '{' NEWLINE? (value_assoc ',' NEWLINE?)+ value_assoc NEWLINE? '}'  
 | '{' NEWLINE? '}' 
 | ( value_assoc NEWLINE? )+
 | NEWLINE INDENT
     ( value_assoc NEWLINE? )+
   DEDENT
 ;

value_assoc
 : ID ':' value 
 | ID ':' NEWLINE
   INDENT
     value NEWLINE?
   DEDENT
 ;

range
 : '[' size ',' size ']'
 | '[' time ',' time ']'
 | '[' freq ',' freq ']'
 | '[' ( number | infinity) ',' ( number | infinity) ']'
 | '[' timestamp ',' timestamp ']'
 | '[' version ',' version ']'
 | '[' UNBOUNDED ',' UNBOUNDED ']'
 | '[' comparable_value ',' UNBOUNDED ']'
 | '[' UNBOUNDED ',' comparable_value ']'
 ;

short_str
 : STRING_LITERAL
 | alltoken*
 ;
 
str
 : short_str
 | MLPREF alltoken* NEWLINE 
       (INDENT 
           sub_mlstring+
       DEDENT)? 
 ;

sub_mlstring
 : alltoken* NEWLINE
 | INDENT sub_mlstring+ DEDENT
 ;
 
number
 : integer
 | real
 ;
 
version
 : VERSION
 | INT_DOT_INT
 ;

real
 : INT_DOT_INT
 | FLOAT_NUMBER
 | '0'
 | INFINITY
 | NAN
 | integer
 ;
 
bool
 : TRUE
 | FALSE
 ;

null_value
 : NULL
 ;

nan
 : NAN
 ;

infinity
 : INFINITY
 ;

timestamp
 : TIMESTAMP
 ;
 
integer
 : DECIMAL_INTEGER
 | OCT_INTEGER
 | HEX_INTEGER
 | BIN_INTEGER
 | '0'
 | INFINITY
 | NAN
 ;

size
 : SCALAR_SIZE
 	 ;

time
 : SCALAR_TIME
 ;

freq
 : SCALAR_FREQ
 ;

alltoken
 : SCALAR_SIZE
 | SCALAR_TIME
 | SCALAR_FREQ
 | TOSCA_DEFINITIONS_VERSION
 | METADATA
 | TEMPLATE_NAME
 | TEMPLATE_AUTHOR
 | TEMPLATE_VERSION
 | ARTIFACT_TYPES
 | DERIVED_FROM
 | MIME_TYPE
 | FILE_EXT
 | DATA_TYPES
 | PROPERTIES
 | TYPE
 | REQUIRED
 | STATUS
 | DEFAULT
 | REPOSITORIES
 | URL
 | DESCRIPTION
 | CREDENTIAL
 | TOKEN
 | PROTOCOL
 | TOKEN_TYPE
 | USER
 | IMPORTS
 | FILE
 | REPOSITORY
 | NAMESPACE_PREFIX
 | NAMESPACE_URI
 | CAPABILITY_TYPES
 | NODE_TYPES
 | INTERFACE_TYPES
 | RELATIONSHIP_TYPES
 | GROUP_TYPES
 | GROUPS
 | COPY
 | POLICY_TYPES
 | TOPOLOGY_TYPES
 | RELATIONSHIP_TEMPLATES
 | CONSTRAINTS
 | EQUAL
 | GREATER_THAN
 | GREATER_OR_EQUAL
 | LESS_THAN
 | LESS_OR_EQUAL
 | IN_RANGE
 | VALID_VALUES
 | VALUE
 | LENGTH
 | MIN_LENGTH
 | MAX_LENGTH
 | PATTERN
 | ENTRY_SCHEMA
 | ATTRIBUTES
 | VALID_SOURCE_TYPES
 | VALID_TARGET_TYPES
 | INPUTS
 | INTERFACES
 | RELATIONSHIP
 | OCCURENCES
 | DEPLOY_PATH
 | CAPABILITIES
 | NODE
 | IMPLEMENTATION
 | DEPENDENCIES
 | CAPABILITY
 | REQUIREMENTS
 | PRIMARY
 | K_SELF
 | K_HOST
 | K_SOURCE
 | K_TARGET
 | LOCAL_FILE
 | GET_INPUT
 | GET_PROPERTY
 | GET_ATTRIBUTE
 | GET_OPERATION_OUTPUT
 | GET_NODES_OF_TYPES
 | GET_ARTIFACT
 | CONCAT
 | DELEGATE
 | SET_STATE
 | CALL_OPERATION
 | DIRECTIVES
 | INLINE
 | TARGET
 | TARGET_RELATIONSHIP
 | FILTER
 | ACTIVITIES
 | OPERATION_HOST
 | ON_SUCCESS
 | ON_FAILURE
 | ASSERT
 | OR
 | AND
 | AFTER
 | BEFORE
 | WAIT_SOURCE
 | AFTER_SOURCE
 | WAIT_TARGET
 | AFTER_TARGET
 | ACTIVITY
 | TARGET_WEAVING
 | SOURCE_WEAVING
 | WORKFLOWS
 | MEMBERS
 | TRUE
 | FALSE
 | ID
 | STRING_LITERAL
 | FLOAT_NUMBER
 | DECIMAL_INTEGER
 | OCT_INTEGER
 | HEX_INTEGER
 | BIN_INTEGER
 | STAR
 | OPEN_PAREN
 | CLOSE_PAREN
 | COMMA
 | COLON 
 | SEMI_COLON
 | POWER
 | ASSIGN
 | OPEN_BRACK
 | CLOSE_BRACK
 | XOR
 | LEFT_SHIFT
 | RIGHT_SHIFT
 | ADD
 | MINUS
 | DIV
 | MOD
 | IDIV
 | OPEN_BRACE
 | CLOSE_BRACE
 | UNKNOWN_CHAR
 | INFINITY
 | UNBOUNDED
 | NULL
 | NAN
 | TIMESTAMP
 | BASETYPE_NAMES
 | DOT
 | MAPPING
 | NODE_TEMPLATES
 | ARTIFACTS
 | NAME
 | TARGETS
 | POLICIES
 | EVENT
 | SCHEDULE
 | TARGET_FILTER
 | CONDITION
 | CONSTRAINT
 | PERIOD
 | EVALUATIONS
 | METHOD
 | ACTION
 | NODE_FILTER
 | PRECONDITIONS
 | STEPS
 | JOIN
 | NAMESPACE
 | MLPREF
 ;

BASETYPE_NAMES
 : STRING
 | BOOLEAN
 | LIST
 | MAP
 | RANGE
 | INTEGER
 | FLOAT
 | SCALAR_UNIT_SIZE
 | LSIZE
 | SCALAR_UNIT_TIME
 | LTIME
 | SCALAR_UNIT_FREQUENCY
 | LFREQUENCY
 | LVERSION
 ;


 
/*
 * lexer rules
 */

/* basetypes */
STRING: 'string';
BOOLEAN: 'boolean';
LIST: 'list';
MAP: 'map';
RANGE: 'range';
INTEGER: 'integer';
FLOAT: 'float';
SCALAR_UNIT_SIZE: 'scalar-unit.size';
LSIZE: 'size';
SCALAR_UNIT_TIME: 'scalar-unit.time';
LTIME: 'time';
SCALAR_UNIT_FREQUENCY: 'scalar-unit.frequency';
LFREQUENCY: 'frequency';

/* keywords */
ACTION: 'action';
ACTIVITY: 'activity:';
ACTIVITIES: 'activities:';
AFTER: 'after:';                                          
AFTER_SOURCE: 'after_source:';
AFTER_TARGET: 'after_target:';
AND : 'and:';
ARTIFACT_TYPES: 'artifact_types:';
ARTIFACTS: 'artifacts:';
ASSERT : 'assert:';
ATTRIBUTES: 'attributes:';
BEFORE: 'before:';
CALL_OPERATION: 'call_operation:';
CAPABILITIES: 'capabilities:';
CAPABILITY: 'capability:';
CAPABILITY_TYPES: 'capability_types:';
CONCAT: 'concat:';
COPY: 'copy:';
CREDENTIAL: 'credential:';
CONDITION: 'condition:';
CONSTRAINT: 'constraint:';
CONSTRAINTS: 'constraints:';
DATA_TYPES: 'data_types:';
DEFAULT: 'default:';
DELEGATE: 'delegate:';
DEPENDENCIES: 'dependencies:';
DEPLOY_PATH: 'deploy_path:';
DERIVED_FROM: 'derived_from:';
DESCRIPTION: 'description:';
DIRECTIVES: 'directives:';
ENTRY_SCHEMA: 'entry_schema:';
EQUAL: 'equal:';
EVALUATIONS: 'evaluations:';
EVENT: 'event:';
FILE: 'file:';
FILE_EXT: 'file_ext:';
FILTER: 'filter:';
GET_ARTIFACT: 'get_artifact:';
GET_ATTRIBUTE: 'get_attribute:';
GET_INPUT: 'get_input:';
GET_NODES_OF_TYPES: 'get_nodes_of_types:';
GET_OPERATION_OUTPUT: 'get_operation_output:';
GET_PROPERTY: 'get_property:';
GREATER_THAN: 'greater_than:';
GREATER_OR_EQUAL: 'greater_or_equal:';
GROUP_TYPES: 'group_types:';
GROUPS: 'groups:';
IMPLEMENTATION: 'implementation:';
IMPORTS: 'imports:';
IN_RANGE: 'in_range:';
INLINE: 'inline:';
INPUTS: 'inputs:';
INTERFACE_TYPES: 'interface_types:';
INTERFACES: 'interfaces:';
JOIN: 'join:';
LENGTH: 'length:';
LESS_OR_EQUAL: 'less_or_equal:';
LESS_THAN: 'less_than:';
MAPPING: 'mapping:';
MAX_LENGTH: 'max_length:';
MEMBERS: 'members:';
METADATA: 'metadata:';
METHOD: 'method:';
MIME_TYPE: 'mime_type:';
MIN_LENGTH: 'min_length:';
NAME: 'name:';
NAMESPACE: 'namespace';
NAMESPACE_PREFIX: 'namespace_prefix:';
NAMESPACE_URI: 'namespace_uri:';
NODE: 'node:';
NODE_FILTER: 'node_filter:';
NODE_TEMPLATES: 'node_templates:';
NODE_TYPES: 'node_types:';
OCCURENCES: 'occurences:';
ON_SUCCESS: 'on_success:';
ON_FAILURE: 'on_failure:';
OPERATION_HOST: 'operation_host:';
OR : 'or:';
PATTERN: 'pattern:';
PERIOD: 'period:';
POLICY_TYPES: 'policy_types:';
POLICIES: 'policies:';
PRIMARY: 'primary:';
PRECONDITIONS: 'precondditions:';
PROPERTIES: 'properties:';
PROTOCOL: 'protocol:';
RELATIONSHIP: 'relationship:';
RELATIONSHIP_TEMPLATES: 'relationship_templates:';
RELATIONSHIP_TYPES: 'relationship_types:';
REQUIREMENTS: 'requirements:';
REPOSITORIES: 'repositories:';
REPOSITORY: 'repository:';
REQUIRED: 'required:';
SCHEDULE: 'schedule:';
SET_STATE: 'set_state:';
SOURCE_WEAVING: 'source_weaving:';
STATUS: 'status:';
STEPS: 'steps:';
SUBSTITUTION_MAPPING: 'substitution_mappings:';
TARGET: 'target:';
TARGET_FILTER: 'target_filter:';
TARGET_RELATIONSHIP: 'target_relationship:';
TARGET_WEAVING: 'target_weaving:';
TARGETS: 'targets:';
TEMPLATE_AUTHOR: 'template_author:';
TEMPLATE_NAME: 'template_name:';
TEMPLATE_VERSION: 'template_version:';
TOKEN: 'token:';
TOKEN_TYPE: 'token_type:';
TOPOLOGY_TYPES: 'topology_template:';
TOSCA_DEFINITIONS_VERSION: 'tosca_definitions_version:';
TRIGGERS: 'triggers:';
TYPE: 'type:';
URL: 'url:';
USER: 'user:';
VALID_SOURCE_TYPES: 'valid_source_types:';
VALID_TARGET_TYPES: 'valid_target_types:';
VALID_VALUES: 'valid_values:';
VALUE: 'value:';
LVERSION: 'version:';
WAIT_SOURCE: 'wait_source:';
WAIT_TARGET: 'wait_target:';
WORKFLOWS: 'workflows:';



K_SELF: 'SELF';
K_HOST: 'HOST';
K_SOURCE: 'SOURCE';
K_TARGET: 'TARGET';

LOCAL_FILE: 'LOCAL_FILE';


TRUE : 'True'|'true'|'TRUE';
FALSE : 'False'|'false'|'FALSE';
/* <<<<< TOSCA lexer rules */ 

NEWLINE
 : ( {this.atStartOfInput()}?   SPACES
   | ( '\r'? '\n' | '\r' ) SPACES?
   ) {
     let newLine = this.text.replace(/[^\r\n]+/g, '');
     let spaces = this.text.replace(/[\r\n]+/g, '');
     let next = this._input.LA(1);

     if (this.opened > 0 || next === 13 /* '\r' */ || next === 10 /* '\n' */ || next === 35 /* '#' */) {
       // If we're inside a list or on a blank line, ignore all indents,
       // dedents and line breaks.
       this.skip();
     } else {
       this.emitToken(this.commonToken(ToscaParser.NEWLINE, newLine));

       let indent = this.getIndentationCount(spaces);
       let previous = this.indents.length ? this.indents[this.indents.length - 1] : 0;

       if (indent === previous) {
         // skip indents of the same size as the present indent-size
         this.skip();
       } else if (indent > previous) {
         this.indents.push(indent);
         this.emitToken(this.commonToken(ToscaParser.INDENT, spaces));
       } else {
         // Possibly emit more than 1 DEDENT token.
         while (this.indents.length && this.indents[this.indents.length - 1] > indent) {
           this.emitToken(this.createDedent());
           this.indents.pop();
         }
       }
     }
   }
 ;

LITEM 
 : ( '-' SPACES+
   ) {
       this.emitToken(this.commonToken(ToscaParser.MINUS, '-'));
       let tlen = this.text.length
       let idx = tlen;
       let carac = ' ';
       do {
         idx++;
         carac = this._input.LA(-idx);         
       } while (carac === 32 || carac == 45);
       if ( carac === ToscaParser.EOF || 
            carac === 13 /* '\r' */ || 
            carac === 10 /* '\n' */ ) {
         indent = idx - 1
         this.indents.push(indent);
         this.emitToken(this.commonToken(ToscaParser.INDENT, this.text));
       };
     }
 ;

SCALAR_SIZE 
 : (INT_DOT_INT | FLOAT_NUMBER | '0' | DECIMAL_INTEGER) 
   SPACES* 
   ([Bb]|[kK][Bb]|[Kk][iI][Bb]|[Mm][Bb]|[Mm][iI][Bb]|[Gg][Bb]|[Gg][iI][Bb]|[Tt][Bb]|[Tt][iI][Bb])
 ;

SCALAR_TIME 
 : (INT_DOT_INT | FLOAT_NUMBER | '0' | DECIMAL_INTEGER) 
   SPACES* 
   ([dD]|[hH]|[mM]|[s]|[mM][sS]|[uU][sS]|[nN][sS])
 ;

SCALAR_FREQ
 : (INT_DOT_INT | FLOAT_NUMBER | '0' | DECIMAL_INTEGER) 
   SPACES* 
   ([Hh][zZ]|[kK][Hh][zZ]|[Mm][Hh][zZ]|[Gg][Hh][zZ])
 ;  
 
/// stringliteral   ::=  [stringprefix](shortstring | longstring)
/// stringprefix    ::=  "r" | "R"
STRING_LITERAL
 : SHORT_STRING
 ;

NAN
 : '.nan'|'.NaN'|'.NAN'
 ; 

INFINITY
 : [+-]? ('.inf'|'.INF'|'.Inf')
 ;

VERSION
 : INT_DOT_INT '.' DECIMAL_INTEGER ('.' ID ('-'DECIMAL_INTEGER)?)?
 ;

FLOAT_NUMBER
 : INT_DOT_INT ([eE] [+-]? DIGIT+ )
 | [+-] INT_DOT_INT ([eE] [+-]? DIGIT+ )?
 | [+-]? DIGIT+ '.' ([eE] [+-]? DIGIT+ )?
 | [+-]? '.' DIGIT+  ([eE] [+-]? DIGIT+ )?
 ;

INT_DOT_INT
 : DIGIT+ '.' DIGIT+
 ;

DECIMAL_INTEGER
 : [+-]? NON_ZERO_DIGIT DIGIT*
 | '0'+
 ;

/// octinteger     ::=  "0" ("o" | "O") octdigit+
OCT_INTEGER
 : [+-]? '0' [oO] OCT_DIGIT+
 ;

/// hexinteger     ::=  "0" ("x" | "X") hexdigit+
HEX_INTEGER
 : [+-]? '0' [xX] HEX_DIGIT+
 ;

/// bininteger     ::=  "0" ("b" | "B") bindigit+
BIN_INTEGER
 : [+-]? '0' [bB] BIN_DIGIT+
 ;

MLPREF: [|>][+-]?;
DOT : '.';
ELLIPSIS : '...';
STAR : '*';
OPEN_PAREN : '(' {this.opened++;};
CLOSE_PAREN : ')' {this.opened--;};
COMMA : ',';
COLON : ':';
SEMI_COLON : ';';
POWER : '**';
ASSIGN : '=';
OPEN_BRACK : '[' {this.opened++;};
CLOSE_BRACK : ']' {this.opened--;};
XOR : '^';
LEFT_SHIFT : '<<';
RIGHT_SHIFT : '>>';
ADD : '+';
MINUS : '-';
DIV : '/';
MOD : '%';
IDIV : '//';
OPEN_BRACE : '{' {this.opened++;};
CLOSE_BRACE : '}' {this.opened--;};

IGNORER
 : ( SPACES | COMMENT | LINE_JOINING ) -> skip
 ;
 
 
UNBOUNDED
 : 'UNBOUNDED'
 ;
 
NULL
 : 'null'|'NULL'|'Null'|'~'
 ;
 
 
TIMESTAMP
 : DIGIT DIGIT DIGIT DIGIT '-' DIGIT DIGIT? '-' DIGIT DIGIT?
   (([tT]| SPACES+) DIGIT DIGIT? ':' DIGIT DIGIT ':' DIGIT DIGIT ('.' DIGIT+)?
   ( SPACES* ('Z' | ([+-] DIGIT DIGIT?(':' DIGIT DIGIT)?)?)))?
 ; 


URI
 : SCHEME '://' ( URI_STR ':' URI_STR '@')? (URI_STR | IP) (':' DIGIT (DIGIT (DIGIT DIGIT?)?)?)? ('/' (URI_STR ('/' URI_STR)*'/'?)?)?
 ;
 
/// identifier   ::=  id_start id_continue*
ID
 : ID_START ID_CONTINUE*
 ;
                                                 
UNKNOWN_CHAR
 : .
 ;
 
/*
 * fragments
 */

fragment SCHEME
 : 'http'|'https'|'file'
 ;
 
fragment SHORT_STRING
 : '\'' ( STRING_ESCAPE_SEQ | ~[\\'] )* '\''
 | '"' ( STRING_ESCAPE_SEQ | ~[\\"] )* '"'
 ;

fragment STRING_ESCAPE_SEQ
 : '\\' .
 ;

fragment IP
 : DIGIT (DIGIT DIGIT?)? '.' DIGIT (DIGIT DIGIT?)? '.' DIGIT (DIGIT DIGIT?)? '.' DIGIT (DIGIT DIGIT?)?
 ;
 
/// nonzerodigit   ::=  "1"..."9"
fragment NON_ZERO_DIGIT
 : [1-9]
 ;

/// digit          ::=  "0"..."9"
fragment DIGIT
 : [0-9]
 ;

/// octdigit       ::=  "0"..."7"
fragment OCT_DIGIT
 : [0-7]
 ;

/// hexdigit       ::=  digit | "a"..."f" | "A"..."F"
fragment HEX_DIGIT
 : [0-9a-fA-F]
 ;

/// bindigit       ::=  "0" | "1"
fragment BIN_DIGIT
 : [01]
 ;

/// intpart       ::=  digit+
fragment INT_PART
 : DIGIT+
 ;

/// fraction      ::=  "." digit+
fragment FRACTION
 : '.' DIGIT+
 ;

/// exponent      ::=  ("e" | "E") ["+" | "-"] digit+
fragment EXPONENT
 : [eE] [+-]? DIGIT+
 ;

fragment SPACES
 : [ \t]+
 ;

fragment COMMENT
 : '#' ~[\r\n]*
 ;

fragment LINE_JOINING
 : '\\' SPACES? ( '\r'? '\n' | '\r' )
 ;

fragment URI_NAME
 : ([a-zA-Z~0-9] | ('%' HEX_DIGIT)) ([a-zA-Z0-9-] | ('%' HEX_DIGIT))*
 ;
 
fragment URI_STR
 : URI_NAME ('.' URI_NAME)*
 ;
 
/// id_start     ::=  <all characters in general categories Lu, Ll, Lt, Lm, Lo, Nl, the underscore, and characters with the Other_ID_Start property>
fragment ID_START
 : '_'
 | [A-Z]
 | [a-z]
 | '\u00AA'
 | '\u00B5'
 | '\u00BA'
 | [\u00C0-\u00D6]
 | [\u00D8-\u00F6]
 | [\u00F8-\u01BA]
 | '\u01BB'
 | [\u01BC-\u01BF]
 | [\u01C0-\u01C3]
 | [\u01C4-\u0241]
 | [\u0250-\u02AF]
 | [\u02B0-\u02C1]
 | [\u02C6-\u02D1]
 | [\u02E0-\u02E4]
 | '\u02EE'
 | '\u037A'
 | '\u0386'
 | [\u0388-\u038A]
 | '\u038C'
 | [\u038E-\u03A1]
 | [\u03A3-\u03CE]
 | [\u03D0-\u03F5]
 | [\u03F7-\u0481]
 | [\u048A-\u04CE]
 | [\u04D0-\u04F9]
 | [\u0500-\u050F]
 | [\u0531-\u0556]
 | '\u0559'
 | [\u0561-\u0587]
 | [\u05D0-\u05EA]
 | [\u05F0-\u05F2]
 | [\u0621-\u063A]
 | '\u0640'
 | [\u0641-\u064A]
 | [\u066E-\u066F]
 | [\u0671-\u06D3]
 | '\u06D5'
 | [\u06E5-\u06E6]
 | [\u06EE-\u06EF]
 | [\u06FA-\u06FC]
 | '\u06FF'
 | '\u0710'
 | [\u0712-\u072F]
 | [\u074D-\u076D]
 | [\u0780-\u07A5]
 | '\u07B1'
 | [\u0904-\u0939]
 | '\u093D'
 | '\u0950'
 | [\u0958-\u0961]
 | '\u097D'
 | [\u0985-\u098C]
 | [\u098F-\u0990]
 | [\u0993-\u09A8]
 | [\u09AA-\u09B0]
 | '\u09B2'
 | [\u09B6-\u09B9]
 | '\u09BD'
 | '\u09CE'
 | [\u09DC-\u09DD]
 | [\u09DF-\u09E1]
 | [\u09F0-\u09F1]
 | [\u0A05-\u0A0A]
 | [\u0A0F-\u0A10]
 | [\u0A13-\u0A28]
 | [\u0A2A-\u0A30]
 | [\u0A32-\u0A33]
 | [\u0A35-\u0A36]
 | [\u0A38-\u0A39]
 | [\u0A59-\u0A5C]
 | '\u0A5E'
 | [\u0A72-\u0A74]
 | [\u0A85-\u0A8D]
 | [\u0A8F-\u0A91]
 | [\u0A93-\u0AA8]
 | [\u0AAA-\u0AB0]
 | [\u0AB2-\u0AB3]
 | [\u0AB5-\u0AB9]
 | '\u0ABD'
 | '\u0AD0'
 | [\u0AE0-\u0AE1]
 | [\u0B05-\u0B0C]
 | [\u0B0F-\u0B10]
 | [\u0B13-\u0B28]
 | [\u0B2A-\u0B30]
 | [\u0B32-\u0B33]
 | [\u0B35-\u0B39]
 | '\u0B3D'
 | [\u0B5C-\u0B5D]
 | [\u0B5F-\u0B61]
 | '\u0B71'
 | '\u0B83'
 | [\u0B85-\u0B8A]
 | [\u0B8E-\u0B90]
 | [\u0B92-\u0B95]
 | [\u0B99-\u0B9A]
 | '\u0B9C'
 | [\u0B9E-\u0B9F]
 | [\u0BA3-\u0BA4]
 | [\u0BA8-\u0BAA]
 | [\u0BAE-\u0BB9]
 | [\u0C05-\u0C0C]
 | [\u0C0E-\u0C10]
 | [\u0C12-\u0C28]
 | [\u0C2A-\u0C33]
 | [\u0C35-\u0C39]
 | [\u0C60-\u0C61]
 | [\u0C85-\u0C8C]
 | [\u0C8E-\u0C90]
 | [\u0C92-\u0CA8]
 | [\u0CAA-\u0CB3]
 | [\u0CB5-\u0CB9]
 | '\u0CBD'
 | '\u0CDE'
 | [\u0CE0-\u0CE1]
 | [\u0D05-\u0D0C]
 | [\u0D0E-\u0D10]
 | [\u0D12-\u0D28]
 | [\u0D2A-\u0D39]
 | [\u0D60-\u0D61]
 | [\u0D85-\u0D96]
 | [\u0D9A-\u0DB1]
 | [\u0DB3-\u0DBB]
 | '\u0DBD'
 | [\u0DC0-\u0DC6]
 | [\u0E01-\u0E30]
 | [\u0E32-\u0E33]
 | [\u0E40-\u0E45]
 | '\u0E46'
 | [\u0E81-\u0E82]
 | '\u0E84'
 | [\u0E87-\u0E88]
 | '\u0E8A'
 | '\u0E8D'
 | [\u0E94-\u0E97]
 | [\u0E99-\u0E9F]
 | [\u0EA1-\u0EA3]
 | '\u0EA5'
 | '\u0EA7'
 | [\u0EAA-\u0EAB]
 | [\u0EAD-\u0EB0]
 | [\u0EB2-\u0EB3]
 | '\u0EBD'
 | [\u0EC0-\u0EC4]
 | '\u0EC6'
 | [\u0EDC-\u0EDD]
 | '\u0F00'
 | [\u0F40-\u0F47]
 | [\u0F49-\u0F6A]
 | [\u0F88-\u0F8B]
 | [\u1000-\u1021]
 | [\u1023-\u1027]
 | [\u1029-\u102A]
 | [\u1050-\u1055]
 | [\u10A0-\u10C5]
 | [\u10D0-\u10FA]
 | '\u10FC'
 | [\u1100-\u1159]
 | [\u115F-\u11A2]
 | [\u11A8-\u11F9]
 | [\u1200-\u1248]
 | [\u124A-\u124D]
 | [\u1250-\u1256]
 | '\u1258'
 | [\u125A-\u125D]
 | [\u1260-\u1288]
 | [\u128A-\u128D]
 | [\u1290-\u12B0]
 | [\u12B2-\u12B5]
 | [\u12B8-\u12BE]
 | '\u12C0'
 | [\u12C2-\u12C5]
 | [\u12C8-\u12D6]
 | [\u12D8-\u1310]
 | [\u1312-\u1315]
 | [\u1318-\u135A]
 | [\u1380-\u138F]
 | [\u13A0-\u13F4]
 | [\u1401-\u166C]
 | [\u166F-\u1676]
 | [\u1681-\u169A]
 | [\u16A0-\u16EA]
 | [\u16EE-\u16F0]
 | [\u1700-\u170C]
 | [\u170E-\u1711]
 | [\u1720-\u1731]
 | [\u1740-\u1751]
 | [\u1760-\u176C]
 | [\u176E-\u1770]
 | [\u1780-\u17B3]
 | '\u17D7'
 | '\u17DC'
 | [\u1820-\u1842]
 | '\u1843'
 | [\u1844-\u1877]
 | [\u1880-\u18A8]
 | [\u1900-\u191C]
 | [\u1950-\u196D]
 | [\u1970-\u1974]
 | [\u1980-\u19A9]
 | [\u19C1-\u19C7]
 | [\u1A00-\u1A16]
 | [\u1D00-\u1D2B]
 | [\u1D2C-\u1D61]
 | [\u1D62-\u1D77]
 | '\u1D78'
 | [\u1D79-\u1D9A]
 | [\u1D9B-\u1DBF]
 | [\u1E00-\u1E9B]
 | [\u1EA0-\u1EF9]
 | [\u1F00-\u1F15]
 | [\u1F18-\u1F1D]
 | [\u1F20-\u1F45]
 | [\u1F48-\u1F4D]
 | [\u1F50-\u1F57]
 | '\u1F59'
 | '\u1F5B'
 | '\u1F5D'
 | [\u1F5F-\u1F7D]
 | [\u1F80-\u1FB4]
 | [\u1FB6-\u1FBC]
 | '\u1FBE'
 | [\u1FC2-\u1FC4]
 | [\u1FC6-\u1FCC]
 | [\u1FD0-\u1FD3]
 | [\u1FD6-\u1FDB]
 | [\u1FE0-\u1FEC]
 | [\u1FF2-\u1FF4]
 | [\u1FF6-\u1FFC]
 | '\u2071'
 | '\u207F'
 | [\u2090-\u2094]
 | '\u2102'
 | '\u2107'
 | [\u210A-\u2113]
 | '\u2115'
 | '\u2118'
 | [\u2119-\u211D]
 | '\u2124'
 | '\u2126'
 | '\u2128'
 | [\u212A-\u212D]
 | '\u212E'
 | [\u212F-\u2131]
 | [\u2133-\u2134]
 | [\u2135-\u2138]
 | '\u2139'
 | [\u213C-\u213F]
 | [\u2145-\u2149]
 | [\u2160-\u2183]
 | [\u2C00-\u2C2E]
 | [\u2C30-\u2C5E]
 | [\u2C80-\u2CE4]
 | [\u2D00-\u2D25]
 | [\u2D30-\u2D65]
 | '\u2D6F'
 | [\u2D80-\u2D96]
 | [\u2DA0-\u2DA6]
 | [\u2DA8-\u2DAE]
 | [\u2DB0-\u2DB6]
 | [\u2DB8-\u2DBE]
 | [\u2DC0-\u2DC6]
 | [\u2DC8-\u2DCE]
 | [\u2DD0-\u2DD6]
 | [\u2DD8-\u2DDE]
 | '\u3005'
 | '\u3006'
 | '\u3007'
 | [\u3021-\u3029]
 | [\u3031-\u3035]
 | [\u3038-\u303A]
 | '\u303B'
 | '\u303C'
 | [\u3041-\u3096]
 | [\u309B-\u309C]
 | [\u309D-\u309E]
 | '\u309F'
 | [\u30A1-\u30FA]
 | [\u30FC-\u30FE]
 | '\u30FF'
 | [\u3105-\u312C]
 | [\u3131-\u318E]
 | [\u31A0-\u31B7]
 | [\u31F0-\u31FF]
 | [\u3400-\u4DB5]
 | [\u4E00-\u9FBB]
 | [\uA000-\uA014]
 | '\uA015'
 | [\uA016-\uA48C]
 | [\uA800-\uA801]
 | [\uA803-\uA805]
 | [\uA807-\uA80A]
 | [\uA80C-\uA822]
 | [\uAC00-\uD7A3]
 | [\uF900-\uFA2D]
 | [\uFA30-\uFA6A]
 | [\uFA70-\uFAD9]
 | [\uFB00-\uFB06]
 | [\uFB13-\uFB17]
 | '\uFB1D'
 | [\uFB1F-\uFB28]
 | [\uFB2A-\uFB36]
 | [\uFB38-\uFB3C]
 | '\uFB3E'
 | [\uFB40-\uFB41]
 | [\uFB43-\uFB44]
 | [\uFB46-\uFBB1]
 | [\uFBD3-\uFD3D]
 | [\uFD50-\uFD8F]
 | [\uFD92-\uFDC7]
 | [\uFDF0-\uFDFB]
 | [\uFE70-\uFE74]
 | [\uFE76-\uFEFC]
 | [\uFF21-\uFF3A]
 | [\uFF41-\uFF5A]
 | [\uFF66-\uFF6F]
 | '\uFF70'
 | [\uFF71-\uFF9D]
 | [\uFF9E-\uFF9F]
 | [\uFFA0-\uFFBE]
 | [\uFFC2-\uFFC7]
 | [\uFFCA-\uFFCF]
 | [\uFFD2-\uFFD7]
 | [\uFFDA-\uFFDC]
 ;

/// id_continue  ::=  <all characters in id_start, plus characters in the categories Mn, Mc, Nd, Pc and others with the Other_ID_Continue property>
fragment ID_CONTINUE
 : ID_START
 | DOT
 | [0-9]
 | [\u0300-\u036F]
 | [\u0483-\u0486]
 | [\u0591-\u05B9]
 | [\u05BB-\u05BD]
 | '\u05BF'
 | [\u05C1-\u05C2]
 | [\u05C4-\u05C5]
 | '\u05C7'
 | [\u0610-\u0615]
 | [\u064B-\u065E]
 | [\u0660-\u0669]
 | '\u0670'
 | [\u06D6-\u06DC]
 | [\u06DF-\u06E4]
 | [\u06E7-\u06E8]
 | [\u06EA-\u06ED]
 | [\u06F0-\u06F9]
 | '\u0711'
 | [\u0730-\u074A]
 | [\u07A6-\u07B0]
 | [\u0901-\u0902]
 | '\u0903'
 | '\u093C'
 | [\u093E-\u0940]
 | [\u0941-\u0948]
 | [\u0949-\u094C]
 | '\u094D'
 | [\u0951-\u0954]
 | [\u0962-\u0963]
 | [\u0966-\u096F]
 | '\u0981'
 | [\u0982-\u0983]
 | '\u09BC'
 | [\u09BE-\u09C0]
 | [\u09C1-\u09C4]
 | [\u09C7-\u09C8]
 | [\u09CB-\u09CC]
 | '\u09CD'
 | '\u09D7'
 | [\u09E2-\u09E3]
 | [\u09E6-\u09EF]
 | [\u0A01-\u0A02]
 | '\u0A03'
 | '\u0A3C'
 | [\u0A3E-\u0A40]
 | [\u0A41-\u0A42]
 | [\u0A47-\u0A48]
 | [\u0A4B-\u0A4D]
 | [\u0A66-\u0A6F]
 | [\u0A70-\u0A71]
 | [\u0A81-\u0A82]
 | '\u0A83'
 | '\u0ABC'
 | [\u0ABE-\u0AC0]
 | [\u0AC1-\u0AC5]
 | [\u0AC7-\u0AC8]
 | '\u0AC9'
 | [\u0ACB-\u0ACC]
 | '\u0ACD'
 | [\u0AE2-\u0AE3]
 | [\u0AE6-\u0AEF]
 | '\u0B01'
 | [\u0B02-\u0B03]
 | '\u0B3C'
 | '\u0B3E'
 | '\u0B3F'
 | '\u0B40'
 | [\u0B41-\u0B43]
 | [\u0B47-\u0B48]
 | [\u0B4B-\u0B4C]
 | '\u0B4D'
 | '\u0B56'
 | '\u0B57'
 | [\u0B66-\u0B6F]
 | '\u0B82'
 | [\u0BBE-\u0BBF]
 | '\u0BC0'
 | [\u0BC1-\u0BC2]
 | [\u0BC6-\u0BC8]
 | [\u0BCA-\u0BCC]
 | '\u0BCD'
 | '\u0BD7'
 | [\u0BE6-\u0BEF]
 | [\u0C01-\u0C03]
 | [\u0C3E-\u0C40]
 | [\u0C41-\u0C44]
 | [\u0C46-\u0C48]
 | [\u0C4A-\u0C4D]
 | [\u0C55-\u0C56]
 | [\u0C66-\u0C6F]
 | [\u0C82-\u0C83]
 | '\u0CBC'
 | '\u0CBE'
 | '\u0CBF'
 | [\u0CC0-\u0CC4]
 | '\u0CC6'
 | [\u0CC7-\u0CC8]
 | [\u0CCA-\u0CCB]
 | [\u0CCC-\u0CCD]
 | [\u0CD5-\u0CD6]
 | [\u0CE6-\u0CEF]
 | [\u0D02-\u0D03]
 | [\u0D3E-\u0D40]
 | [\u0D41-\u0D43]
 | [\u0D46-\u0D48]
 | [\u0D4A-\u0D4C]
 | '\u0D4D'
 | '\u0D57'
 | [\u0D66-\u0D6F]
 | [\u0D82-\u0D83]
 | '\u0DCA'
 | [\u0DCF-\u0DD1]
 | [\u0DD2-\u0DD4]
 | '\u0DD6'
 | [\u0DD8-\u0DDF]
 | [\u0DF2-\u0DF3]
 | '\u0E31'
 | [\u0E34-\u0E3A]
 | [\u0E47-\u0E4E]
 | [\u0E50-\u0E59]
 | '\u0EB1'
 | [\u0EB4-\u0EB9]
 | [\u0EBB-\u0EBC]
 | [\u0EC8-\u0ECD]
 | [\u0ED0-\u0ED9]
 | [\u0F18-\u0F19]
 | [\u0F20-\u0F29]
 | '\u0F35'
 | '\u0F37'
 | '\u0F39'
 | [\u0F3E-\u0F3F]
 | [\u0F71-\u0F7E]
 | '\u0F7F'
 | [\u0F80-\u0F84]
 | [\u0F86-\u0F87]
 | [\u0F90-\u0F97]
 | [\u0F99-\u0FBC]
 | '\u0FC6'
 | '\u102C'
 | [\u102D-\u1030]
 | '\u1031'
 | '\u1032'
 | [\u1036-\u1037]
 | '\u1038'
 | '\u1039'
 | [\u1040-\u1049]
 | [\u1056-\u1057]
 | [\u1058-\u1059]
 | '\u135F'
 | [\u1369-\u1371]
 | [\u1712-\u1714]
 | [\u1732-\u1734]
 | [\u1752-\u1753]
 | [\u1772-\u1773]
 | '\u17B6'
 | [\u17B7-\u17BD]
 | [\u17BE-\u17C5]
 | '\u17C6'
 | [\u17C7-\u17C8]
 | [\u17C9-\u17D3]
 | '\u17DD'
 | [\u17E0-\u17E9]
 | [\u180B-\u180D]
 | [\u1810-\u1819]
 | '\u18A9'
 | [\u1920-\u1922]
 | [\u1923-\u1926]
 | [\u1927-\u1928]
 | [\u1929-\u192B]
 | [\u1930-\u1931]
 | '\u1932'
 | [\u1933-\u1938]
 | [\u1939-\u193B]
 | [\u1946-\u194F]
 | [\u19B0-\u19C0]
 | [\u19C8-\u19C9]
 | [\u19D0-\u19D9]
 | [\u1A17-\u1A18]
 | [\u1A19-\u1A1B]
 | [\u1DC0-\u1DC3]
 | [\u203F-\u2040]
 | '\u2054'
 | [\u20D0-\u20DC]
 | '\u20E1'
 | [\u20E5-\u20EB]
 | [\u302A-\u302F]
 | [\u3099-\u309A]
 | '\uA802'
 | '\uA806'
 | '\uA80B'
 | [\uA823-\uA824]
 | [\uA825-\uA826]
 | '\uA827'
 | '\uFB1E'
 | [\uFE00-\uFE0F]
 | [\uFE20-\uFE23]
 | [\uFE33-\uFE34]
 | [\uFE4D-\uFE4F]
 | [\uFF10-\uFF19]
 | '\uFF3F'
 ;
