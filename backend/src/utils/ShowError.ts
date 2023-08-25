export class ShowError extends Error {
  constructor(message: string) {
    super(`+ ${message}`);
  }

  static internalServerError() {
    return new ShowError("Something went wrong, please try again later.");
  }
}
