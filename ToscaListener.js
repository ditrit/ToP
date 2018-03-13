// Generated from Tosca.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by ToscaParser.
function ToscaListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

ToscaListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
ToscaListener.prototype.constructor = ToscaListener;

// Enter a parse tree produced by ToscaParser#file_input.
ToscaListener.prototype.enterFile_input = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#file_input.
ToscaListener.prototype.exitFile_input = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#stmt.
ToscaListener.prototype.enterStmt = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#stmt.
ToscaListener.prototype.exitStmt = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#service_template.
ToscaListener.prototype.enterService_template = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#service_template.
ToscaListener.prototype.exitService_template = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#service_template_clause.
ToscaListener.prototype.enterService_template_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#service_template_clause.
ToscaListener.prototype.exitService_template_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#topology_template.
ToscaListener.prototype.enterTopology_template = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#topology_template.
ToscaListener.prototype.exitTopology_template = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#topology_template_clause.
ToscaListener.prototype.enterTopology_template_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#topology_template_clause.
ToscaListener.prototype.exitTopology_template_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#substitution_mapping.
ToscaListener.prototype.enterSubstitution_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#substitution_mapping.
ToscaListener.prototype.exitSubstitution_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#substitution_mapping_node_type.
ToscaListener.prototype.enterSubstitution_mapping_node_type = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#substitution_mapping_node_type.
ToscaListener.prototype.exitSubstitution_mapping_node_type = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#substitution_mapping_clause.
ToscaListener.prototype.enterSubstitution_mapping_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#substitution_mapping_clause.
ToscaListener.prototype.exitSubstitution_mapping_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#properties_mapping.
ToscaListener.prototype.enterProperties_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#properties_mapping.
ToscaListener.prototype.exitProperties_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#property_mapping.
ToscaListener.prototype.enterProperty_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#property_mapping.
ToscaListener.prototype.exitProperty_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#property_mapping_clause.
ToscaListener.prototype.enterProperty_mapping_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#property_mapping_clause.
ToscaListener.prototype.exitProperty_mapping_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#attributes_mapping.
ToscaListener.prototype.enterAttributes_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#attributes_mapping.
ToscaListener.prototype.exitAttributes_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#attribute_mapping.
ToscaListener.prototype.enterAttribute_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#attribute_mapping.
ToscaListener.prototype.exitAttribute_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#attribute_mapping_clause.
ToscaListener.prototype.enterAttribute_mapping_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#attribute_mapping_clause.
ToscaListener.prototype.exitAttribute_mapping_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capabilities_mapping.
ToscaListener.prototype.enterCapabilities_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capabilities_mapping.
ToscaListener.prototype.exitCapabilities_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_mapping.
ToscaListener.prototype.enterCapability_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_mapping.
ToscaListener.prototype.exitCapability_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_mapping_clause.
ToscaListener.prototype.enterCapability_mapping_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_mapping_clause.
ToscaListener.prototype.exitCapability_mapping_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#requirements_mapping.
ToscaListener.prototype.enterRequirements_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#requirements_mapping.
ToscaListener.prototype.exitRequirements_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#requirement_mapping.
ToscaListener.prototype.enterRequirement_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#requirement_mapping.
ToscaListener.prototype.exitRequirement_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#requirement_mapping_clause.
ToscaListener.prototype.enterRequirement_mapping_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#requirement_mapping_clause.
ToscaListener.prototype.exitRequirement_mapping_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interfaces_mapping.
ToscaListener.prototype.enterInterfaces_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interfaces_mapping.
ToscaListener.prototype.exitInterfaces_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_mapping.
ToscaListener.prototype.enterInterface_mapping = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_mapping.
ToscaListener.prototype.exitInterface_mapping = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_templates.
ToscaListener.prototype.enterNode_templates = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_templates.
ToscaListener.prototype.exitNode_templates = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_template.
ToscaListener.prototype.enterNode_template = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_template.
ToscaListener.prototype.exitNode_template = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_template_clause.
ToscaListener.prototype.enterNode_template_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_template_clause.
ToscaListener.prototype.exitNode_template_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#relationship_templates.
ToscaListener.prototype.enterRelationship_templates = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#relationship_templates.
ToscaListener.prototype.exitRelationship_templates = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#relationship_template.
ToscaListener.prototype.enterRelationship_template = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#relationship_template.
ToscaListener.prototype.exitRelationship_template = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#relationship_template_clause.
ToscaListener.prototype.enterRelationship_template_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#relationship_template_clause.
ToscaListener.prototype.exitRelationship_template_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#tosca_definition_version.
ToscaListener.prototype.enterTosca_definition_version = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#tosca_definition_version.
ToscaListener.prototype.exitTosca_definition_version = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#metadata.
ToscaListener.prototype.enterMetadata = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#metadata.
ToscaListener.prototype.exitMetadata = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#metadata_clause.
ToscaListener.prototype.enterMetadata_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#metadata_clause.
ToscaListener.prototype.exitMetadata_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#repositories.
ToscaListener.prototype.enterRepositories = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#repositories.
ToscaListener.prototype.exitRepositories = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#repository.
ToscaListener.prototype.enterRepository = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#repository.
ToscaListener.prototype.exitRepository = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#repository_short.
ToscaListener.prototype.enterRepository_short = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#repository_short.
ToscaListener.prototype.exitRepository_short = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#repository_detail.
ToscaListener.prototype.enterRepository_detail = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#repository_detail.
ToscaListener.prototype.exitRepository_detail = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#repository_clause.
ToscaListener.prototype.enterRepository_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#repository_clause.
ToscaListener.prototype.exitRepository_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#repository_url.
ToscaListener.prototype.enterRepository_url = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#repository_url.
ToscaListener.prototype.exitRepository_url = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#repository_cred.
ToscaListener.prototype.enterRepository_cred = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#repository_cred.
ToscaListener.prototype.exitRepository_cred = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#cred_ele.
ToscaListener.prototype.enterCred_ele = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#cred_ele.
ToscaListener.prototype.exitCred_ele = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#file_imports.
ToscaListener.prototype.enterFile_imports = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#file_imports.
ToscaListener.prototype.exitFile_imports = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#file_import.
ToscaListener.prototype.enterFile_import = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#file_import.
ToscaListener.prototype.exitFile_import = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#artifact_defs.
ToscaListener.prototype.enterArtifact_defs = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#artifact_defs.
ToscaListener.prototype.exitArtifact_defs = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#artifact_def.
ToscaListener.prototype.enterArtifact_def = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#artifact_def.
ToscaListener.prototype.exitArtifact_def = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#artifact_def_clause.
ToscaListener.prototype.enterArtifact_def_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#artifact_def_clause.
ToscaListener.prototype.exitArtifact_def_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_requirement_assignments.
ToscaListener.prototype.enterNode_requirement_assignments = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_requirement_assignments.
ToscaListener.prototype.exitNode_requirement_assignments = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_requirement_assignment.
ToscaListener.prototype.enterNode_requirement_assignment = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_requirement_assignment.
ToscaListener.prototype.exitNode_requirement_assignment = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_requirement_assignment_clause.
ToscaListener.prototype.enterNode_requirement_assignment_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_requirement_assignment_clause.
ToscaListener.prototype.exitNode_requirement_assignment_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#properties.
ToscaListener.prototype.enterProperties = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#properties.
ToscaListener.prototype.exitProperties = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#property.
ToscaListener.prototype.enterProperty = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#property.
ToscaListener.prototype.exitProperty = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#property_clause.
ToscaListener.prototype.enterProperty_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#property_clause.
ToscaListener.prototype.exitProperty_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#property_assignments.
ToscaListener.prototype.enterProperty_assignments = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#property_assignments.
ToscaListener.prototype.exitProperty_assignments = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#property_assignment.
ToscaListener.prototype.enterProperty_assignment = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#property_assignment.
ToscaListener.prototype.exitProperty_assignment = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#property_assignment_clause.
ToscaListener.prototype.enterProperty_assignment_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#property_assignment_clause.
ToscaListener.prototype.exitProperty_assignment_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#attributes.
ToscaListener.prototype.enterAttributes = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#attributes.
ToscaListener.prototype.exitAttributes = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#attribute.
ToscaListener.prototype.enterAttribute = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#attribute.
ToscaListener.prototype.exitAttribute = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#attribute_clause.
ToscaListener.prototype.enterAttribute_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#attribute_clause.
ToscaListener.prototype.exitAttribute_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#attribute_assignments.
ToscaListener.prototype.enterAttribute_assignments = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#attribute_assignments.
ToscaListener.prototype.exitAttribute_assignments = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#attribute_assignment.
ToscaListener.prototype.enterAttribute_assignment = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#attribute_assignment.
ToscaListener.prototype.exitAttribute_assignment = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_assignments.
ToscaListener.prototype.enterCapability_assignments = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_assignments.
ToscaListener.prototype.exitCapability_assignments = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_assignment.
ToscaListener.prototype.enterCapability_assignment = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_assignment.
ToscaListener.prototype.exitCapability_assignment = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_assignment_clause.
ToscaListener.prototype.enterCapability_assignment_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_assignment_clause.
ToscaListener.prototype.exitCapability_assignment_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#attribute_assignment_clause.
ToscaListener.prototype.enterAttribute_assignment_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#attribute_assignment_clause.
ToscaListener.prototype.exitAttribute_assignment_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#inputs.
ToscaListener.prototype.enterInputs = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#inputs.
ToscaListener.prototype.exitInputs = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#input_assignments.
ToscaListener.prototype.enterInput_assignments = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#input_assignments.
ToscaListener.prototype.exitInput_assignments = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#input_parameters.
ToscaListener.prototype.enterInput_parameters = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#input_parameters.
ToscaListener.prototype.exitInput_parameters = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#input_parameter.
ToscaListener.prototype.enterInput_parameter = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#input_parameter.
ToscaListener.prototype.exitInput_parameter = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#input_parameter_clause.
ToscaListener.prototype.enterInput_parameter_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#input_parameter_clause.
ToscaListener.prototype.exitInput_parameter_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#output_parameters.
ToscaListener.prototype.enterOutput_parameters = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#output_parameters.
ToscaListener.prototype.exitOutput_parameters = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#output_parameter.
ToscaListener.prototype.enterOutput_parameter = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#output_parameter.
ToscaListener.prototype.exitOutput_parameter = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#output_parameter_clause.
ToscaListener.prototype.enterOutput_parameter_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#output_parameter_clause.
ToscaListener.prototype.exitOutput_parameter_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#constraints.
ToscaListener.prototype.enterConstraints = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#constraints.
ToscaListener.prototype.exitConstraints = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#constraint_clause.
ToscaListener.prototype.enterConstraint_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#constraint_clause.
ToscaListener.prototype.exitConstraint_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#entry_decl.
ToscaListener.prototype.enterEntry_decl = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#entry_decl.
ToscaListener.prototype.exitEntry_decl = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#entry_detailed.
ToscaListener.prototype.enterEntry_detailed = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#entry_detailed.
ToscaListener.prototype.exitEntry_detailed = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#entry_clause.
ToscaListener.prototype.enterEntry_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#entry_clause.
ToscaListener.prototype.exitEntry_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#file_import_clause.
ToscaListener.prototype.enterFile_import_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#file_import_clause.
ToscaListener.prototype.exitFile_import_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#entity_metadata.
ToscaListener.prototype.enterEntity_metadata = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#entity_metadata.
ToscaListener.prototype.exitEntity_metadata = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#entity_metadata_clause.
ToscaListener.prototype.enterEntity_metadata_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#entity_metadata_clause.
ToscaListener.prototype.exitEntity_metadata_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#entity_clause.
ToscaListener.prototype.enterEntity_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#entity_clause.
ToscaListener.prototype.exitEntity_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_types.
ToscaListener.prototype.enterNode_types = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_types.
ToscaListener.prototype.exitNode_types = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_type.
ToscaListener.prototype.enterNode_type = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_type.
ToscaListener.prototype.exitNode_type = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_type_clause.
ToscaListener.prototype.enterNode_type_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_type_clause.
ToscaListener.prototype.exitNode_type_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#relationship_types.
ToscaListener.prototype.enterRelationship_types = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#relationship_types.
ToscaListener.prototype.exitRelationship_types = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#relationship_type.
ToscaListener.prototype.enterRelationship_type = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#relationship_type.
ToscaListener.prototype.exitRelationship_type = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#relationship_type_clause.
ToscaListener.prototype.enterRelationship_type_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#relationship_type_clause.
ToscaListener.prototype.exitRelationship_type_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#artifact_types.
ToscaListener.prototype.enterArtifact_types = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#artifact_types.
ToscaListener.prototype.exitArtifact_types = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#artifact_type.
ToscaListener.prototype.enterArtifact_type = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#artifact_type.
ToscaListener.prototype.exitArtifact_type = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#artifact_type_clause.
ToscaListener.prototype.enterArtifact_type_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#artifact_type_clause.
ToscaListener.prototype.exitArtifact_type_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#data_types.
ToscaListener.prototype.enterData_types = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#data_types.
ToscaListener.prototype.exitData_types = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#data_type.
ToscaListener.prototype.enterData_type = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#data_type.
ToscaListener.prototype.exitData_type = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#data_type_clause.
ToscaListener.prototype.enterData_type_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#data_type_clause.
ToscaListener.prototype.exitData_type_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_types.
ToscaListener.prototype.enterCapability_types = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_types.
ToscaListener.prototype.exitCapability_types = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_type.
ToscaListener.prototype.enterCapability_type = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_type.
ToscaListener.prototype.exitCapability_type = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_type_clause.
ToscaListener.prototype.enterCapability_type_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_type_clause.
ToscaListener.prototype.exitCapability_type_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_defs.
ToscaListener.prototype.enterCapability_defs = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_defs.
ToscaListener.prototype.exitCapability_defs = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_def.
ToscaListener.prototype.enterCapability_def = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_def.
ToscaListener.prototype.exitCapability_def = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_def_clause.
ToscaListener.prototype.enterCapability_def_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_def_clause.
ToscaListener.prototype.exitCapability_def_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#requirement_defs.
ToscaListener.prototype.enterRequirement_defs = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#requirement_defs.
ToscaListener.prototype.exitRequirement_defs = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#requirement_def.
ToscaListener.prototype.enterRequirement_def = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#requirement_def.
ToscaListener.prototype.exitRequirement_def = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#requirement_def_clause.
ToscaListener.prototype.enterRequirement_def_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#requirement_def_clause.
ToscaListener.prototype.exitRequirement_def_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#requirement_def_relation_clause.
ToscaListener.prototype.enterRequirement_def_relation_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#requirement_def_relation_clause.
ToscaListener.prototype.exitRequirement_def_relation_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_types.
ToscaListener.prototype.enterInterface_types = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_types.
ToscaListener.prototype.exitInterface_types = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_type.
ToscaListener.prototype.enterInterface_type = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_type.
ToscaListener.prototype.exitInterface_type = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_type_clause.
ToscaListener.prototype.enterInterface_type_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_type_clause.
ToscaListener.prototype.exitInterface_type_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_defs.
ToscaListener.prototype.enterInterface_defs = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_defs.
ToscaListener.prototype.exitInterface_defs = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_def.
ToscaListener.prototype.enterInterface_def = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_def.
ToscaListener.prototype.exitInterface_def = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_def_clause.
ToscaListener.prototype.enterInterface_def_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_def_clause.
ToscaListener.prototype.exitInterface_def_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_defs_template.
ToscaListener.prototype.enterInterface_defs_template = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_defs_template.
ToscaListener.prototype.exitInterface_defs_template = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_def_template.
ToscaListener.prototype.enterInterface_def_template = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_def_template.
ToscaListener.prototype.exitInterface_def_template = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#interface_def_template_clause.
ToscaListener.prototype.enterInterface_def_template_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#interface_def_template_clause.
ToscaListener.prototype.exitInterface_def_template_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#operation_def.
ToscaListener.prototype.enterOperation_def = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#operation_def.
ToscaListener.prototype.exitOperation_def = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#operation_def_clause.
ToscaListener.prototype.enterOperation_def_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#operation_def_clause.
ToscaListener.prototype.exitOperation_def_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#implementation_clause.
ToscaListener.prototype.enterImplementation_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#implementation_clause.
ToscaListener.prototype.exitImplementation_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#group_types.
ToscaListener.prototype.enterGroup_types = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#group_types.
ToscaListener.prototype.exitGroup_types = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#group_type.
ToscaListener.prototype.enterGroup_type = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#group_type.
ToscaListener.prototype.exitGroup_type = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#group_type_clause.
ToscaListener.prototype.enterGroup_type_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#group_type_clause.
ToscaListener.prototype.exitGroup_type_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#group_defs.
ToscaListener.prototype.enterGroup_defs = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#group_defs.
ToscaListener.prototype.exitGroup_defs = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#group_def.
ToscaListener.prototype.enterGroup_def = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#group_def.
ToscaListener.prototype.exitGroup_def = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#group_def_clause.
ToscaListener.prototype.enterGroup_def_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#group_def_clause.
ToscaListener.prototype.exitGroup_def_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#policy_types.
ToscaListener.prototype.enterPolicy_types = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#policy_types.
ToscaListener.prototype.exitPolicy_types = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#policy_type.
ToscaListener.prototype.enterPolicy_type = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#policy_type.
ToscaListener.prototype.exitPolicy_type = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#policy_type_clause.
ToscaListener.prototype.enterPolicy_type_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#policy_type_clause.
ToscaListener.prototype.exitPolicy_type_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#policy_defs.
ToscaListener.prototype.enterPolicy_defs = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#policy_defs.
ToscaListener.prototype.exitPolicy_defs = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#policy_def.
ToscaListener.prototype.enterPolicy_def = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#policy_def.
ToscaListener.prototype.exitPolicy_def = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#policy_def_clause.
ToscaListener.prototype.enterPolicy_def_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#policy_def_clause.
ToscaListener.prototype.exitPolicy_def_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#trigger_defs.
ToscaListener.prototype.enterTrigger_defs = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#trigger_defs.
ToscaListener.prototype.exitTrigger_defs = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#trigger_def.
ToscaListener.prototype.enterTrigger_def = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#trigger_def.
ToscaListener.prototype.exitTrigger_def = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#trigger_def_clause.
ToscaListener.prototype.enterTrigger_def_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#trigger_def_clause.
ToscaListener.prototype.exitTrigger_def_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#target_filter_clause.
ToscaListener.prototype.enterTarget_filter_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#target_filter_clause.
ToscaListener.prototype.exitTarget_filter_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_filter.
ToscaListener.prototype.enterNode_filter = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_filter.
ToscaListener.prototype.exitNode_filter = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#node_filter_clause.
ToscaListener.prototype.enterNode_filter_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#node_filter_clause.
ToscaListener.prototype.exitNode_filter_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#properties_filter.
ToscaListener.prototype.enterProperties_filter = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#properties_filter.
ToscaListener.prototype.exitProperties_filter = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#property_filter.
ToscaListener.prototype.enterProperty_filter = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#property_filter.
ToscaListener.prototype.exitProperty_filter = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capabilities_filter.
ToscaListener.prototype.enterCapabilities_filter = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capabilities_filter.
ToscaListener.prototype.exitCapabilities_filter = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#capability_filter.
ToscaListener.prototype.enterCapability_filter = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#capability_filter.
ToscaListener.prototype.exitCapability_filter = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#declarative_node_workflows.
ToscaListener.prototype.enterDeclarative_node_workflows = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#declarative_node_workflows.
ToscaListener.prototype.exitDeclarative_node_workflows = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#declarative_node_workflow.
ToscaListener.prototype.enterDeclarative_node_workflow = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#declarative_node_workflow.
ToscaListener.prototype.exitDeclarative_node_workflow = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#declarative_node_workflow_clause.
ToscaListener.prototype.enterDeclarative_node_workflow_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#declarative_node_workflow_clause.
ToscaListener.prototype.exitDeclarative_node_workflow_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#declarative_rel_workflows.
ToscaListener.prototype.enterDeclarative_rel_workflows = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#declarative_rel_workflows.
ToscaListener.prototype.exitDeclarative_rel_workflows = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#declarative_rel_workflow.
ToscaListener.prototype.enterDeclarative_rel_workflow = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#declarative_rel_workflow.
ToscaListener.prototype.exitDeclarative_rel_workflow = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#declarative_rel_workflow_clause.
ToscaListener.prototype.enterDeclarative_rel_workflow_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#declarative_rel_workflow_clause.
ToscaListener.prototype.exitDeclarative_rel_workflow_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_source_weavings.
ToscaListener.prototype.enterWorkflow_source_weavings = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_source_weavings.
ToscaListener.prototype.exitWorkflow_source_weavings = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_target_weavings.
ToscaListener.prototype.enterWorkflow_target_weavings = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_target_weavings.
ToscaListener.prototype.exitWorkflow_target_weavings = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_source_weaving.
ToscaListener.prototype.enterWorkflow_source_weaving = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_source_weaving.
ToscaListener.prototype.exitWorkflow_source_weaving = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_source_weaving_clause.
ToscaListener.prototype.enterWorkflow_source_weaving_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_source_weaving_clause.
ToscaListener.prototype.exitWorkflow_source_weaving_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_target_weaving.
ToscaListener.prototype.enterWorkflow_target_weaving = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_target_weaving.
ToscaListener.prototype.exitWorkflow_target_weaving = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_target_weaving_clause.
ToscaListener.prototype.enterWorkflow_target_weaving_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_target_weaving_clause.
ToscaListener.prototype.exitWorkflow_target_weaving_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_preconditions.
ToscaListener.prototype.enterWorkflow_preconditions = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_preconditions.
ToscaListener.prototype.exitWorkflow_preconditions = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_precondition.
ToscaListener.prototype.enterWorkflow_precondition = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_precondition.
ToscaListener.prototype.exitWorkflow_precondition = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_precondition_clause.
ToscaListener.prototype.enterWorkflow_precondition_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_precondition_clause.
ToscaListener.prototype.exitWorkflow_precondition_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_condition_clauses.
ToscaListener.prototype.enterWorkflow_condition_clauses = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_condition_clauses.
ToscaListener.prototype.exitWorkflow_condition_clauses = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_filter_clauses.
ToscaListener.prototype.enterWorkflow_filter_clauses = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_filter_clauses.
ToscaListener.prototype.exitWorkflow_filter_clauses = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_condition_clause.
ToscaListener.prototype.enterWorkflow_condition_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_condition_clause.
ToscaListener.prototype.exitWorkflow_condition_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_condition_or_clause.
ToscaListener.prototype.enterWorkflow_condition_or_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_condition_or_clause.
ToscaListener.prototype.exitWorkflow_condition_or_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_condition_and_clause.
ToscaListener.prototype.enterWorkflow_condition_and_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_condition_and_clause.
ToscaListener.prototype.exitWorkflow_condition_and_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_condition_assert_clause.
ToscaListener.prototype.enterWorkflow_condition_assert_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_condition_assert_clause.
ToscaListener.prototype.exitWorkflow_condition_assert_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_assertion.
ToscaListener.prototype.enterWorkflow_assertion = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_assertion.
ToscaListener.prototype.exitWorkflow_assertion = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_steps.
ToscaListener.prototype.enterWorkflow_steps = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_steps.
ToscaListener.prototype.exitWorkflow_steps = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_step.
ToscaListener.prototype.enterWorkflow_step = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_step.
ToscaListener.prototype.exitWorkflow_step = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_step_clause.
ToscaListener.prototype.enterWorkflow_step_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_step_clause.
ToscaListener.prototype.exitWorkflow_step_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_activities.
ToscaListener.prototype.enterWorkflow_activities = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_activities.
ToscaListener.prototype.exitWorkflow_activities = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_activity.
ToscaListener.prototype.enterWorkflow_activity = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_activity.
ToscaListener.prototype.exitWorkflow_activity = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#imperative_workflows.
ToscaListener.prototype.enterImperative_workflows = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#imperative_workflows.
ToscaListener.prototype.exitImperative_workflows = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#imperative_workflow.
ToscaListener.prototype.enterImperative_workflow = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#imperative_workflow.
ToscaListener.prototype.exitImperative_workflow = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#imperative_workflow_clause.
ToscaListener.prototype.enterImperative_workflow_clause = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#imperative_workflow_clause.
ToscaListener.prototype.exitImperative_workflow_clause = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#value_expr.
ToscaListener.prototype.enterValue_expr = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#value_expr.
ToscaListener.prototype.exitValue_expr = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_expr.
ToscaListener.prototype.enterFunc_expr = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_expr.
ToscaListener.prototype.exitFunc_expr = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_arg.
ToscaListener.prototype.enterFunc_arg = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_arg.
ToscaListener.prototype.exitFunc_arg = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_concat.
ToscaListener.prototype.enterFunc_concat = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_concat.
ToscaListener.prototype.exitFunc_concat = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_join.
ToscaListener.prototype.enterFunc_join = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_join.
ToscaListener.prototype.exitFunc_join = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_token.
ToscaListener.prototype.enterFunc_token = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_token.
ToscaListener.prototype.exitFunc_token = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_get_input.
ToscaListener.prototype.enterFunc_get_input = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_get_input.
ToscaListener.prototype.exitFunc_get_input = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_get_property.
ToscaListener.prototype.enterFunc_get_property = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_get_property.
ToscaListener.prototype.exitFunc_get_property = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_get_attribute.
ToscaListener.prototype.enterFunc_get_attribute = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_get_attribute.
ToscaListener.prototype.exitFunc_get_attribute = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_get_operation_output.
ToscaListener.prototype.enterFunc_get_operation_output = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_get_operation_output.
ToscaListener.prototype.exitFunc_get_operation_output = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_get_nodes_of_types.
ToscaListener.prototype.enterFunc_get_nodes_of_types = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_get_nodes_of_types.
ToscaListener.prototype.exitFunc_get_nodes_of_types = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#func_get_artifact.
ToscaListener.prototype.enterFunc_get_artifact = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#func_get_artifact.
ToscaListener.prototype.exitFunc_get_artifact = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#value.
ToscaListener.prototype.enterValue = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#value.
ToscaListener.prototype.exitValue = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#descr.
ToscaListener.prototype.enterDescr = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#descr.
ToscaListener.prototype.exitDescr = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#list.
ToscaListener.prototype.enterList = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#list.
ToscaListener.prototype.exitList = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#map.
ToscaListener.prototype.enterMap = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#map.
ToscaListener.prototype.exitMap = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#value_assoc.
ToscaListener.prototype.enterValue_assoc = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#value_assoc.
ToscaListener.prototype.exitValue_assoc = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#range.
ToscaListener.prototype.enterRange = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#range.
ToscaListener.prototype.exitRange = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#short_str.
ToscaListener.prototype.enterShort_str = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#short_str.
ToscaListener.prototype.exitShort_str = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#str.
ToscaListener.prototype.enterStr = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#str.
ToscaListener.prototype.exitStr = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#sub_mlstring.
ToscaListener.prototype.enterSub_mlstring = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#sub_mlstring.
ToscaListener.prototype.exitSub_mlstring = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#number.
ToscaListener.prototype.enterNumber = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#number.
ToscaListener.prototype.exitNumber = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#bool.
ToscaListener.prototype.enterBool = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#bool.
ToscaListener.prototype.exitBool = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#integer.
ToscaListener.prototype.enterInteger = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#integer.
ToscaListener.prototype.exitInteger = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#size.
ToscaListener.prototype.enterSize = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#size.
ToscaListener.prototype.exitSize = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#time.
ToscaListener.prototype.enterTime = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#time.
ToscaListener.prototype.exitTime = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#freq.
ToscaListener.prototype.enterFreq = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#freq.
ToscaListener.prototype.exitFreq = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#workflow_state.
ToscaListener.prototype.enterWorkflow_state = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#workflow_state.
ToscaListener.prototype.exitWorkflow_state = function(ctx) {
};


// Enter a parse tree produced by ToscaParser#alltoken.
ToscaListener.prototype.enterAlltoken = function(ctx) {
};

// Exit a parse tree produced by ToscaParser#alltoken.
ToscaListener.prototype.exitAlltoken = function(ctx) {
};



exports.ToscaListener = ToscaListener;