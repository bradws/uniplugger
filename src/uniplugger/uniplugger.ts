import fs from 'fs';
import path from 'path';
export class Uniplugger<T> {

    #temporaryFolderPath: string;

    #folderPath: string;
    public get folderPath() {
        return this.#folderPath;
    }
    
    #fileNames: Array<string>;
    public get fileNames() {
        return this.#fileNames;
    }

    #plugins: Array<T>;
    public get plugins() {
        return this.#plugins;
    }

    #alreadyBeenDiscovered: boolean;

    /**
     * The constructor of Uniplugger.
     *
     * @param folderPath The string containing the folder path where the plugins reside e.g. './my-plugins/', or './my-plugins'
     */
    public constructor(folderPath: string) {

        // Init all properties
        this.#temporaryFolderPath = folderPath;
        this.#folderPath = ''; 
        this.#fileNames = new Array<string>();
        this.#plugins = new Array<T>();
        
        // Restrict user to 'discover()' the plugins only once
        this.#alreadyBeenDiscovered = false;
    }
    
    public async discover(): Promise<void> {

        // Restrict user to 'discover()' the plugins only once
        if( this.#alreadyBeenDiscovered ) {
            throw new Error(`The 'discover()' function has already been called. You cannot 'discover()' plugins more than once`);
        }   
        this.#alreadyBeenDiscovered = true;

        // Make sure the user-supplied folder is an 'absolute' folder path
        if( this.#isAbsoluteFolderPath(this.#temporaryFolderPath))
            this.#folderPath = this.#temporaryFolderPath;
        else
            this.#folderPath = path.join( __dirname, this.#temporaryFolderPath);

        // Make sure the folder actually exists
        if( !fs.existsSync(this.#folderPath) ) {
            throw new Error(`The folder ${this.#folderPath} doesn't exist.`);
        }

        // Make sure it's actually a folder (and not a file)
        let statsObj = fs.statSync(this.#folderPath);
        if( !statsObj.isDirectory() ) {
            throw new Error(`${this.#folderPath} does not appear to be a folder.`);
        }

        // Get all the Javascript files 
        this.#fileNames =  this.#getJsFilesfileNames(this.folderPath);
        
        // Import() them into the 'plugins' array ready for use by the user       
        for( let fileName of this.fileNames) {
            
            let theModule = await import(fileName);
            
            let thePlugin = new theModule.default;
            
            this.plugins.push(thePlugin);
        }
    }

    #isAbsoluteFolderPath(folderPath: string): boolean {
        //TODO: 
        return false;
    }

    #getJsFilesfileNames(folderName: string): Array<string> {

        // Reads the content of the folder, both files and subfolders, and returns their relative path:
        let jsFileFileNames = fs.readdirSync(folderName).map(fileName => {
            return path.join( folderName, fileName); // Join the folder name and path to the filename
        })
        // Only return the '.js' files
        .filter( (filename) => {
            return filename.endsWith('.js');
        });

        return jsFileFileNames;
    }
    
}
