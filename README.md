# Welcome to Uniplugger

* A simple, fast, no-frills, plugin architecture for your Node application!
* For both Typescript and Javascript: it's small and has zero external dependencies.
* It's a light-weight wrapper over javascript's dynamic `import()`, and it's real-easy to use.
* Just create your contract, develop and drop your plugins into a folder, then in your code call `discover()`.

# Install

`npm install uniplugger`

# How to Use
## Quick Overview

At a minimum, there are generally 3 parts to a plugin arcitecture:

1. **The main application.** This is your main application that will use the plugin. The plugins will be discovered and loaded at run time when specified.
2. **The plugin.** This is the piece of functionality that is abstracted out of the application for use.
3. **The contract.** Your application needs to know what your plugin is offering, and your plugin needs to agree to provide the specific functionality.

> Take a look at the [uniplugger-example](https://github.com/bradws/uniplugger-example) project to see a simple example in action

Similar to other plugin implementations, you'll typically do the following:

1. Define the contract between your application and your plugin. This is usually an interface of some-sort (e.g. a Typescript interface).
2. Decide upon the name of a folder where to put your plugin.
3. Define the plugin class by implementing the interface. Export the class with the `default` keyword.
4. Build/transpile your plugin and put it into your folder. The built plugin will typically be a Javascript file.
5. Then in your main applicaiton, tell Uniplugger your contract and name of the folder, and call `discover()` at run-time.
6. Your app will then have all the plugins ready for use.

## Walk Through

Let's create a very simple *datalayer* for an application that needs to get some details of employees. But we need to access different databases at run-time to do it. We'll need some type of a plugin arcitecture like Uniplugger. One could define an interface like this:

```typescript
// iDatalayer.ts (The contract)
export interface IDatalayer {
    name: string;
    getEmployeeDetails(employeeId: string): Array<string>
}
```

Then, develop your plugin by implementing this interface. For our example this plugin happens to use MySql to access the data, so let's call it 'MySqlDatalayer'. Don't forget to mark your class as `default`.

```typescript
// mysql-datalayer.ts (The plugin)
import { IDatalayer } from './iDatalayer';

export default class MySqlDatalayer implements IDatalayer {
    public name: string = 'MySql';
    public getEmployeeDetails(employeeId: string): string[] {
        let employeeData: Array<string> = new Array<string>();

        // Write MySql-specific code to getting the data from a MySql database
        // ...
        // employeeData = ???

        return employeeData;
    }
}
```

Let's define a second plugin. This one gets the details of employees directly from disk.

```typescript
// disk-datalayer.ts (The 2nd plugin)
import { IDatalayer } from './iDatalayer';

export default class DiskDatalayer implements IDatalayer {
    public name: string = 'Disk';
    public getEmployeeDetails(employeeId: string): string[] {
        let employeeData: Array<string> = new Array<string>();

        // Write code to get the data from a file on disk
        // ...
        // employeeData = ???

        return employeeData;
    }
}
```

Build & test your plugins just like any other code you write. Choose an arbitrary folder name like 'plugins' and drop your two built javascript files in there.
Now in your main application, you will import and instantiate Uniplugger by providing the interface you defined, along with your folder where you put your plugins.

```typescript
// app.ts (The main application)
import { Uniplugger } from "uniplugger";
import { IDatalayer } from "./iDatalayer";

async function main() {

    // Instantiate Uniplugger by passing in the interface and the plugin folder
    const uniplugger = new Uniplugger<IDatalayer>('./plugins');

    console.log(`Your plugin folder is ${uniplugger.folder}`);
    
    // Discover the plugins. Note it returns a Promise, so you'll have to await it.
    await uniplugger.discover();

    // You're done! The plugins are ready for use. 
    console.log(`Number of plugins discovered = ${uniplugger.plugins.length}`);    
    
    console.log(`uniplugger.plugins[0].name = ${uniplugger.plugins[0].name}`);
    const data1 = uniplugger.plugins[0].getEmployeeDetails('1');

    console.log(`uniplugger.plugins[1].name: ${uniplugger.plugins[1].name}`);   
    const data2 = uniplugger.plugins[1].getEmployeeDetails('1');
 
}

main();
```

# Limitations

* All the plugins are discovered and loaded once, and once only. Would be nice to be able to 're-discover' any new plugins that have appeared without restarting the application.
* It would be great if you could filter and load only the plugins you want.
* The plugins are flat - your plugins can't have other nested plugins

# Thoughts for future versions

* Allow an 'absolute' folder to be used (in addition to the existing 'relative' one)
* Allow `discover()` to be called more than once
>This current limitation is due to some subtle complexities. For example, if the 2nd call to `discover()` produces a different result to the first call, what do we do exactly? You may have duplicate plugins. Plugins that were there previously may no longer exist. There may be extra ones. Further analysis needs to be done to define these requirements if this feature is to be implemented.
* Allow more than 1 plugins folder to be specified
* Filter certain kinds of plugins to load in
* Allow nested plugins

# Feedback Welcome

Thoughts, comments, bugs & feature requestes are welcome :)
