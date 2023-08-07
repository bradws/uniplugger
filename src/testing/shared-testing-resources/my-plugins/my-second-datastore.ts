import { IDatastore } from '../iDatastore';
import { TestConstants } from '../test-constants';

export default class MySecondDatastore implements IDatastore {
    
    public name: string = TestConstants.PluginName2;
    
}
