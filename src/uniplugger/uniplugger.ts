import { glob } from 'glob';
export class Uniplugger<T> {

    #globString: any;

    #fileNames: Array<string>;
    public get fileNames() {
        return this.#fileNames;
    }

    public plugins: Array<T>;

    #alreadyBeenDiscovered: boolean;

    /**
     * The constructor of Uniplugger.
     *
     * @param glob The string or array of strings containing a glob pattern e.g. './my-plugins/*.js', or ['./my-plugins/*.js', './my-other-plugins/*.js']
     */
    public constructor(globString: any) {

        // Make sure its a string
        if(this.#isString(globString) || this.#isArrayOfStrings(globString)) {
            this.#globString = globString;
        }
        else {
            throw new Error(`You can provide either a string containing a glob pattern, or an array of strings containing a glob pattern`);
        }

        // Initialise the plugins array ready to be populated when user calls 'discover()'
        this.plugins = new Array<T>();
        
        // Restrict user to 'discover()' the plugins only once
        this.#alreadyBeenDiscovered = false;
    }
    
    public async discover(): Promise<void> {

        // Restrict user to 'discover()' the plugins only once
        if( this.#alreadyBeenDiscovered ) {
            throw new Error(`The 'discover()' function has already been called. You cannot 'discover()' plugins more than once`);
        }   
        this.#alreadyBeenDiscovered = true;

        // Get the filename(s) of the plugins from the user-supplied globString pattern
        this.#fileNames = await glob(this.#globString);

        // Import() them into the 'plugins' array ready for use by the user       
        for( let fileName of this.fileNames) {
            
            let theModule = await import(fileName);
            
            let thePlugin = new theModule.default;
            
            this.plugins.push(thePlugin);
        }
    }

    #isString(variable: any): variable is string {
        return typeof variable === 'string';
    }

    #isArrayOfStrings(variable: any): variable is Array<string> {

        // Make sure the variable is an array of some-sort
        if( !Array.isArray(variable) )
            return false;

        // Make sure all the array's elements are strings
        return variable.every( (element) => typeof element === 'string');
    }

}
