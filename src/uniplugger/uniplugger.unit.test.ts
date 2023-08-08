import { describe, test, expect, beforeAll } from 'vitest';

import { Uniplugger } from './uniplugger';
import { IDatastore } from '../testing/shared-testing-resources/iDatastore';
import { TestConstants } from '../testing/shared-testing-resources/test-constants';

describe.concurrent('Tests for Uniplugger', async () => { 

    // A valid relative folder containing 3 plugins
    const validFolderPath: string = './dist/testing/shared-testing-resources/my-plugins';

    test('should have all properties initialised', async () => {

        const uniPlugger = new Uniplugger<IDatastore>(validFolderPath);

        expect(uniPlugger.fileNames.length).toEqual(0);
        expect(uniPlugger.folderPath).toEqual('');
        expect(uniPlugger.plugins.length).toEqual(0);
    });

    test("should not allow a folderPath that doesn't exist", async () => {

        const nonExistantFolderPath = './some/folder/that/doesnt/exist';
        const uniPlugger = new Uniplugger<IDatastore>(nonExistantFolderPath);

        await expect( async () => {
            await uniPlugger.discover();
        }).rejects.toThrowError(/doesn't exist/);
    });

    test('should not allow a file name that exists', async () => {

        const validFilename = './src/index.ts';
        const uniPlugger = new Uniplugger<IDatastore>(validFilename);

        await expect( async () => {
            await uniPlugger.discover();
        }).rejects.toThrowError(/does not appear to be a folder/);
    });

    test("should not allow a file name that doesn't exist", async () => {

        const inValidFilename = 'someinvalidfilename.js';
        const uniPlugger = new Uniplugger<IDatastore>(inValidFilename);

        await expect( async () => {
            await uniPlugger.discover();
        }).rejects.toThrowError(/doesn't exist/);
    });

    test('should be able to use 3 plugins from a folder', async () => {

        const uniplugger = new Uniplugger<IDatastore>( validFolderPath );
        await uniplugger.discover();

        // Make sure there are 3 plugins discovered
        expect(uniplugger.fileNames.length).toEqual(3);

        // Sort the plugin list by the 'name' property (them so we can test each plugin in order)
        uniplugger.plugins.sort( (el1, el2) => {
            if( el1.name < el2.name )
                return -1;
            else if( el1.name > el2.name )
                return 1;
            
            return 0;
        } );

        // Test each plugin was correctly instantiated by checking the 'name' property
        expect(uniplugger.plugins[0].name).toEqual(TestConstants.PluginName1);
        expect(uniplugger.plugins[1].name).toEqual(TestConstants.PluginName2);
        expect(uniplugger.plugins[2].name).toEqual(TestConstants.PluginName3);
    });

    test.skip('should be able to use 3 plugins from a folder, and 1 plugin from a second folder', async () => {

        // A folder containing 3 plugins
        const userSuppliedGlob1: string = './dist/testing/shared-testing-resources/my-plugins/*.js';
        // A folder containing 1 plugin
        const userSuppliedGlob2: string = './dist/testing/shared-testing-resources/my-other-plugins/*.js';
        
        const uniplugger = new Uniplugger<IDatastore>( [userSuppliedGlob1, userSuppliedGlob2] );
        await uniplugger.discover();

        // Make sure there are 4 plugins discovered
        expect(uniplugger.fileNames.length).toEqual(4);

        // Sort the plugin list by the 'name' property (them so we can test each plugin in order)
        uniplugger.plugins.sort( (el1, el2) => {
            if( el1.name < el2.name )
                return -1;
            else if( el1.name > el2.name )
                return 1;
            
            return 0;
        } );

        // Test each plugin was correctly instantiated by checking the 'name' property
        expect(uniplugger.plugins[0].name).toEqual(TestConstants.PluginName1);
        expect(uniplugger.plugins[1].name).toEqual(TestConstants.PluginName2);
        expect(uniplugger.plugins[2].name).toEqual(TestConstants.PluginName3);
        expect(uniplugger.plugins[3].name).toEqual(TestConstants.PluginName4);

    });

    test.skip('should only be able to instantiate Uniplugger with either a string or array of string folder paths', async () => {

        // A folder containing 3 plugins
        const userSuppliedGlob1: string = './dist/testing/shared-testing-resources/my-plugins/*.js';
        // A folder containing 1 plugin
        const userSuppliedGlob2: string = './dist/testing/shared-testing-resources/my-other-plugins/*.js';

        // Allow for a string
        const uniPlugger1 = new Uniplugger<IDatastore>(userSuppliedGlob1);
        expect(uniPlugger1).instanceOf(Uniplugger);

        // Allow for an array of stringss
        const uniPlugger2 = new Uniplugger<IDatastore>([userSuppliedGlob1, userSuppliedGlob2]);
        expect(uniPlugger2).instanceOf(Uniplugger);

        // Don't allow for a number
        expect( () => {
            const uniplugger3 = new Uniplugger<IDatastore>( 42 );
        } ).toThrowError();

        //  Don't allow for an array of numbers
        expect( () => {
            const uniPlugger4 = new Uniplugger<IDatastore>( [1,2] );
        } ).toThrowError();
                
        //  Don't allow for an array of mixed types
        expect( () => {
            const uniPlugger5 = new Uniplugger<IDatastore>( [userSuppliedGlob1, true, 3] );
        } ).toThrowError();
                
    });

});
