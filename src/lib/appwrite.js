import chalk from "chalk";
import * as sdk from "node-appwrite";
class appcomment {
  client = new sdk.Client();
  databases;
  account;
  users;
  constructor({ baseUrl, projectId, api, databaseId = "" }) {
    this.baseUrl = baseUrl;
    this.projectId = projectId;
    this.api = api;
    this.databaseId = databaseId;
    this.collectionId = "comments";
    this.client.setEndpoint(baseUrl).setProject(projectId).setKey(api);

    this.databases = new sdk.Databases(this.client);
    this.account = new sdk.Account(this.client);
    this.users = new sdk.Users(this.client);
  }

  // ##### CLIENT ######
  setDatabaseId(id) {
    this.databaseId = id;
  }

  setCollectionId(id) {
    this.collectionId = id;
  }

  getConfig() {
    return {
      databaseContainer: this.databases,
      accountContainer: this.account,
      databaseID: this.databaseId,
      collectionID: this.collectionId,
      projectID: this.projectId,
      baseURL: this.baseUrl,
    };
  }

  // ################## AUTH ####################

  async createUser({ email, password, name, userId }) {
    if (this.getUser(userId) === null || userId.length >= 36) {
      throw new Error(chalk.red("userId already exist"));
    }
    try {
      const account = await this.account.create(userId, email, password, name);
      if (account) {
        this.login({ email, password });
        return account;
      }
    } catch (err) {
      throw new Error(chalk.red("Unable to create user :: appwrite\n", err));
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (err) {
      throw new Error(
        chalk.red("Unable to login\ncheck email or password\n", err)
      );
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      throw new Error(
        chalk.red(("Unable to get current user :: appwrite", error))
      );
    }
  }

  async logout() {
    try {
      this.account.deleteSessions();
    } catch (error) {
      throw new Error(chalk.red("Unable to logout :: appwrite", error));
    }
  }

  async getUser(userId) {
    try {
      return await this.users.get(userId);
    } catch (err) {
      console.error("No user found with given userId\n", err);
    }
  }

  async getAllUsers({ query = [], search = "" }) {
    try {
      return await this.users.list(query, search);
    } catch (err) {
      error;
    }
  }
  // ############ DATABSE #################

  async createDatabase(databaseName = "app-comment") {
    try {
      this.databaseId = "app-comment";
      return await this.databases.create("app-comment", databaseName);
    } catch (err) {
      throw new Error(chalk.red("Error creating database :: appwrite\n", err));
    }
  }

  async getDatabase(databaseId = this.databaseId) {
    try {
      return await this.databases.get(databaseId);
    } catch (err) {
      throw new Error(chalk.red("Error getting database :: appwrite\n", err));
    }
  }

  async createCollection(databaseId = this.databaseId) {
    try {
      return await this.databases.createCollection(
        databaseId,
        this.collectionId,
        "comments"
      );
    } catch (err) {
      throw new Error(
        chalk.red("Error creating collection :: appwrite\n", err)
      );
    }
  }

  async getCollection(
    collectionId = this.collectionId,
    databaseId = this.collectionId
  ) {
    try {
      return await this.databases.getCollection(databaseId, collectionId);
    } catch (err) {
      throw new Error(chalk.red("Error getting collection :: appwrite\n", err));
    }
  }

  async createDocument({
    databaseId = this.databaseId,
    collectionId = this.collectionId,
    data = {},
    userId,
  }) {
    try {
      return await this.databases.createDocument(
        databaseId,
        collectionId,
        sdk.ID.unique(),
        data,
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.update(sdk.Role.user(userId)),
          sdk.Permission.delete(sdk.Role.user(userId)),
        ]
      );
    } catch (err) {
      throw new Error(
        chalk.red("Unable to create document :: appwrite\n", err)
      );
    }
  }

  async listDocuments({
    databaseId = this.databaseId,
    collectionId = this.collectionId,
    query = [],
  }) {
    try {
      return await this.databases.listDocuments(databaseId, collectionId, query);
    } catch (err) {
      throw new Error(chalk.red("Unable to list documents :: appwrite\n", err));
    }
  }

  async deleteDocument({
    databaseId = this.databaseId,
    collectionId = this.collectionId,
    documentId,
  }) {
    try {
      return await this.databases.deleteDocument(
        databaseId,
        collectionId,
        documentId
      );
    } catch (err) {
      throw new Error(
        chalk.red("Unable to delete document :: appwrite\n", err)
      );
    }
  }

  async updateDocument({
    databaseId = this.databaseId,
    collectionId = this.collectionId,
    documentId,
    data,
  }) {
    try {
      return await this.databases.updateDocument(
        databaseId,
        collectionId,
        documentId,
        data
      );
    } catch (err) {
      throw new Error(
        chalk.red("Unbale to update the document :: appwrite\n", err)
      );
    }
  }
  // ########## ATTRIBUTES ############
  async createBoolean({
    databaseId = this.databaseId,
    collectionId = this.collectionId,
    options = {},
  }) {
    const name = options.name.trim().split(" ").join("-");
    let defaultValue = options?.isArray ? null : options?.defaultValue;

    try {
      return await this.databases.createBooleanAttribute(
        databaseId,
        collectionId,
        name,
        options?.isRequired || false,
        defaultValue,
        options?.isArray
      );
    } catch (err) {
      throw new Error(
        chalk.red(
          "unable to create boolean attribute :: appwrite\n",
          err
        )
      );
    }
  }

  async createString({
    databaseId = this.databaseId,
    collectionId = this.collectionId,
    options = {},
  }) {
    const name = options.name.trim().split(" ").join("-");
    let defaultValue = options?.isArray ? null : options?.defaultValue;
    try {
      return await this.databases.createStringAttribute(
        databaseId,
        collectionId,
        name,
        options?.size || 200,
        options?.isRequired || false,
        defaultValue,
        options?.isArray,
        options?.isEncrypted
      );
    } catch (err) {
      throw new Error(
        chalk.red(
          "unable to create string attribute :: appwrite\n",
          err
        )
      );
    }
  }

  async createNumber({
    databaseId = this.databaseId,
    collectionId = this.collectionId,
    options = {},
  }) {
    const name = options.name.trim().split(" ").join("-");
    let defaultValue = options?.isArray ? null : options?.defaultValue;
    try {
      return await this.databases.createIntegerAttribute(
        databaseId,
        collectionId,
        name,
        options?.isRequired || false,
        options?.minValue,
        options?.maxValue,
        defaultValue,
        options?.isArray
      );
    } catch (err) {
      throw new Error(
        chalk.red(
          "unable to create number/integer attribute :: appwrite\n",
          err
        )
      );
    }
  }
}

export default appcomment;
