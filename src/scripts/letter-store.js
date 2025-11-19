import { DriveClient } from '@/scripts/google-drive';
import { DRIVE_ID } from "astro:env/server";

export class LetterStorage {
  constructor(client) {
    this.client = client;
    this.weekId = undefined;
    this.topFolder = 'Letters';
  }
  
  /**
   * Upload an array of letters
   * 
   * Create the destination folder if necessary.
   * Uploading letters singly risks a race condition on folder creation,
   * so bundle that creation up front and then upload all (two) letters.
   */
  async uploadLetters(letters) {
    await this.client.authorize();
    if (!this.weekId) {
      await this.#getWeeklyFolder();
    }
    let links = letters.map((letter) => this.#uploadLetter(letter));
    return Promise.all(links);
  }
  
  async #getWeeklyFolder() {
    if (!this.weekId) {
      let weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const day = weekStart.getDate().toString().padStart(2, "0");
      const month = (weekStart.getMonth() + 1).toString().padStart(2, "0");
      const year = weekStart.getFullYear().toString().padStart(4, "0");
      const folderName = `${year}-${month}-${day}`;
  
      const lettersId = await this.client.findOrCreateFolder(this.topFolder, undefined);
      this.weekId = await this.client.findOrCreateFolder(folderName, lettersId);
    }
    return this.weekId;
  }

  async #uploadLetter(letter) {
    const fileMetadata = {
      name: letter.filename,
      fields: 'id',
      parents: [ this.weekId ],
    };
    const media = {
      mimeType: 'application/pdf',
      body: letter.data,
    };

    try {
      let file = await this.client.createFile({  // @ts-ignore await definitely does have an effect here
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
        driveId: DRIVE_ID,
        corpora: 'drive',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });
      this.client.createPermission({
        fileId: file.data.id,
        requestBody: {
          type: "anyone",
          role: "reader",
        },
        driveId: DRIVE_ID,
        corpora: 'drive',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });

      return {
        'recipient' : letter.recipient.fullName,
        'url': `https://drive.google.com/file/d/${file.data.id}/view?usp=sharing`,
      };
    } catch (err) {
      throw err;
    }
  }
}