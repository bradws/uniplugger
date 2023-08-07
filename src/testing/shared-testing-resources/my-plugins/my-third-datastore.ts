import { IDatastore } from '../iDatastore';
import { TestConstants } from '../test-constants';

export default class MyThirdDatastore implements IDatastore {
    
    public name: string = TestConstants.PluginName3;
    
}
