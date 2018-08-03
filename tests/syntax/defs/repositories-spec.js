basedir=process.cwd()

classes = require(basedir + '/ToscaTypes.js').classes
app = require(basedir + '/topar.js');

describe("Tosca Compiler syntax -> ", function() {
	
  describe("repositories : ", function() {

    beforeAll(function() {
      rep1 = app.parse_string(`
        my_project_artifact_repo:
          description: development repository for TAR archives and Bash scripts
          url: http://mycompany.com/repository/myproject/
        `, 'repositories');

      rep2 = app.parse_string(`
        docker_hub: https://registry.hub.docker.com
        `, 'repositories');

      rep3 = app.parse_string(`
        my_code_repo:
          description: My project’s code repository in GitHub
          url: https://github.com/my-project/
          credential: 
            protocol: http
            token_type: basic_auth
            # Username and password are combined into a string
            # Note: this would be base64 encoded before transmission by any impl.
            token: myusername:mypassword
        `, 'repositories'  );

      rep4 = app.parse_string(`
        my_code_repo:
          description: My project’s code repository in GitHub
          url: https://github.com/my-project/
          credential: 
            protocol: http
            token_type: basic_auth
            # token is not defined
        `, 'repositories'  );

      rep5 = app.parse_string(`
        my_code_repo:
          description: My project’s code repository in GitHub
          url: https://github.com/my-project/
          credential: {  token_type: plain, token: "myuser:mypassword", protocol: http }
        `, 'repositories'  );

    });

	it("The compiler should accept example of the normative doc",
		function() { expect( rep1 instanceof classes.ToscaRepositories).toEqual(true) });

  it("The compiler should extract url ",
    function() { expect( rep1.ids.my_project_artifact_repo.url instanceof classes.ToscaURL).toEqual(true) });

  it("The compiler should extract description ",
    function() { expect( rep1.ids.my_project_artifact_repo.description instanceof classes.ToscaStr).toEqual(true) });

  it("The compiler should assign null for credential if not defined",
    function() { expect( rep1.ids.my_project_artifact_repo.credential === null).toEqual(true) });

	it("The compiler should accept short notation",
		function() { expect( rep2 instanceof classes.ToscaRepositories).toEqual(true) });

  it("The compiler should accept short notation",
    function() { expect( rep2.ids.docker_hub.description === null).toEqual(true) });  

  it("The compiler should extract short value as url ",
    function() { expect( rep2.ids.docker_hub.url instanceof classes.ToscaURL).toEqual(true) });

	it("The compiler should accept repositories with credentials",
		function() { expect( rep3 instanceof classes.ToscaRepositories).toEqual(true) });

  it("The compiler should extract token from credentials in repositories",
    function() { expect( rep3.ids.my_code_repo.credential.token.val == "myusername:mypassword").toEqual(true) });

  it("The compiler should reject repositories with credentials but no token provided",
    function() { expect( rep4 instanceof classes.ToscaRepositories).toEqual(false) });

	it("The compiler should accept repositories with credentials in short notation",
    function() { expect( rep5 instanceof classes.ToscaRepositories).toEqual(true) });    

  });                                               
});