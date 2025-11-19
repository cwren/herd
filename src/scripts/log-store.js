export class LogStorage {
  constructor(client) {
    this.client = client;
    this.topFolder = 'Letters';
    this.sheetName = 'VisitorLog';
  }

  /**
   * add letters to the ledger
   * 
   * Create the destination spreadsheet if necessary.
   * Log the cross-reference tag for lookup.
   */
   async recordLetters(letters) {
    await this.client.authorize();
    const sheetId = await this.#getLog();

    if (letters.length > 0) {
      const logValue = {
        values: [[
          letters[0].letterId,
          letters[0].today,
          letters[0].address.name,
          letters[0].address.city,
          letters[0].address.state,
          letters[0].address.email,
          letters[0].address.subscribe ? "subscribed" : "not subscribed",
          letters[0].hasPhoto ? "has Photo" : "no Photo",
          letters[0].recipient.fullName,
          letters.length > 1 ? letters[1].recipient.fullName : "",
        ]]
      };
      return this.client.appendRow({
          spreadsheetId: sheetId,
          range: 'Sheet1',
          valueInputOption: 'RAW',
          resource: logValue,
      });
    }
    console.log("we tried to log an empty letter?")
    return Promise.resolve(); // nothing to log
  }

  async #getLog() {
    const lettersId = await this.client.findOrCreateFolder(this.topFolder, undefined);
    return this.client.findOrCreateFile(
        this.sheetName,
        'application/vnd.google-apps.spreadsheet',
        lettersId);
  }
}
