import { describe, test, expect } from 'vitest';

import { Uniplugger } from '../../uniplugger';
import { IDatastore } from '../shared-testing-resources/iDatastore';

describe.concurrent('Able to construct the uniplugger class correctly', async () => { 

    test('should be able to be constructed with a user-supplied folder', async () => {

        const userSuppliedfolder: string = './my-plugins';
        const uniplugger = new Uniplugger<IDatastore>( userSuppliedfolder );

        expect(uniplugger).toBeInstanceOf(Uniplugger);
    });

    /*
    test('should only be able to call discover() once', async () => {
    });

    test('should be able to be constructed with a user-supplied folder', async () => {
    });

    test('should be able to be constructed with a user-supplied folder', async () => {
    });

    test('should be able to be constructed with a user-supplied folder', async () => {
    });

    test('should be able to be constructed with a user-supplied folder', async () => {
    });

    test('should be able to be constructed with a user-supplied folder', async () => {
    });
    */
});
