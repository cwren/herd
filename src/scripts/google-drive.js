import { google } from 'googleapis';
import { SERVICE_KEY, DRIVE_ID } from "astro:env/server";

export class DriveClient {
  constructor() {
    this.auth = undefined;
    this.drive = undefined;
    this.sheets = undefined;
  }

  /**
   * Request or authorization to call APIs.
   *
   */
  async authorize() {
    if (!this.auth) {
        try {
            const keys = JSON.parse(SERVICE_KEY);
            this.auth = google.auth.fromJSON(keys);
            this.auth.scopes = ['https://www.googleapis.com/auth/drive'];
            this.drive =  google.drive({version: 'v3', auth: this.auth});
            this.sheets =  google.sheets({version: 'v4', auth: this.auth});
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
  }
  
  /**
   * find or create a folder.
   */
  async findOrCreateFolder(name, parentId) {
    return this.findOrCreateFile(
        name,
        'application/vnd.google-apps.folder',
        parentId,
    );
  }
  
  /**
   * find or create a file.
   */
  async findOrCreateFile(name, mimeType, parentId) {
    try {
      const drive = google.drive({version: 'v3', auth: this.auth});
      let queryTerms = [
        `name = '${name}'`,
        "trashed = false",
        `mimeType = '${mimeType}'`,
      ];
      if (parentId) {
        queryTerms.push(`'${parentId}' in parents`);
      }
      const query = queryTerms.join(" and ");
  
      const res = await drive.files.list({
        pageSize: 10,
        q: query,
        driveId: DRIVE_ID,
        corpora: 'drive',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        fields: 'nextPageToken, files(id, name)',
      });
      const files = res.data.files;
      if (files.length === 0) {
        // create the missing folder
        let fileMetadata = {
          name: name,
          mimeType: mimeType,
        };
        if (parentId) {
          fileMetadata.parents = [parentId];
        }
        const folder = await drive.files.create({
          requestBody: fileMetadata,
          fields: 'id',
          driveId: DRIVE_ID,
          corpora: 'drive',
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        });
        return folder.data.id;
      }
      return files[0].id;
    } catch (err) {
        console.log(err);
        throw err;
    }
  }

  async createFile(opts) {
    return this.drive.files.create(opts);
  }

  async createPermission(opts) {
    return this.drive.permissions.create(opts);
  }

  async appendRow(opts) {
    return this.sheets.spreadsheets.values.append(opts);
  }
}