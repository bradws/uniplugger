import fs from 'fs';
import path from 'node:path';

export class Uniplugger<T> {

    #folder: string;
    public get folder() {
        return this.#folder;
    }
    public plugins: Array<T>;

    #alreadyBeenDiscovered: boolean;

    public constructor(folder: string) {

        // 1 of 2 - Must have a valid folder
        if( folder === undefined ) {
            // User either did not provide a value, or provided 'undefined'
            throw new Error(`Please provide a folder where the plugins are to reside.`);
        }
        this.#folder = folder;

        // Convert the provided folder to an absolute folder;
        this.#folder = path.join( process.cwd(), this.#folder);

        // 2 of 2 - Initialise the remaining properties
        // Initialise the plugins array ready to be populated
        this.plugins = new Array<T>();
        // Restrict user to 'discover()' the plugins only once
        this.#alreadyBeenDiscovered = false;
    }

    public async discover(): Promise<void> {

        // Make sure the user only calls 'discover()' once.
        if( this.#alreadyBeenDiscovered ) {
            throw new Error(`The 'discover()' function has already been called. You cannot 'discover()' plugins more than once`);
        }   
        this.#alreadyBeenDiscovered = true;

        // Make sure the provided folder actually exist
        if( !fs.existsSync(this.#folder) ) {
            throw new Error(`Folder "${this.#folder}" does not exist`);
        }
        
         // Get the filename(s) of the plugins in the user-supplied 'pluginFolder'
        let jsFilenames: Array<string> = this.#getAllJsFilenames(this.#folder);

        // Import() them into the 'plugins' array ready for use by the user       
        for( let filename of jsFilenames) {

            // Get the absolute path 
            const filename2 = path.join( this.folder, filename);

            let theModule = await import(filename2);
            let theClass = theModule.default;
            let thePlugin = new theClass();

            this.plugins.push(thePlugin);
        }
        
    }

    #getAllJsFilenames(folder: string): Array<string> {

        const jSFileNames: Array<string> = new Array<string>();

        // Scan all the files within a folder, and return their filename
        const fileNames = fs.readdirSync( folder );

        // Loop thru the fileNames list to only include '.js' files
        fileNames.forEach( fileName => {

            if( fileName.endsWith('.js') ) {
                jSFileNames.push( fileName );
            }
        });

        return jSFileNames;
    }
}
